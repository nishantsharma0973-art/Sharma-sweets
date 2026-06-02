import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchProducts, fetchCategories } from "../lib/api";
import ProductCard from "../components/ProductCard";
import { Search } from "lucide-react";

export default function Menu() {
  const [products, setProducts] = useState([]);
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const loc = useLocation();
  const nav = useNavigate();
  const params = new URLSearchParams(loc.search);
  const initialCat = params.get("category") || "All";
  const initialSearch = params.get("search") || "";
  const [cat, setCat] = useState(initialCat);
  const [search, setSearch] = useState(initialSearch);

  useEffect(() => {
    fetchCategories().then((d) => setCats(["All", ...d.categories])).catch(()=>{});
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchProducts({ category: cat, search })
      .then(setProducts)
      .finally(() => setLoading(false));
    const q = new URLSearchParams();
    if (cat && cat !== "All") q.set("category", cat);
    if (search) q.set("search", search);
    nav(`/menu${q.toString() ? `?${q.toString()}` : ""}`, { replace: true });
    // eslint-disable-next-line
  }, [cat, search]);

  const filtered = useMemo(() => products, [products]);

  return (
    <div data-testid="menu-page" className="bg-cream">
      <section className="container-x pt-16 pb-10">
        <div className="eyebrow mb-3">Our Menu</div>
        <h1 className="text-5xl md:text-6xl text-maroon-deep">Hand-crafted, daily.</h1>
        <div className="divider-gold mt-6"/>
        <p className="text-muted2 mt-6 max-w-2xl">Browse our complete range — from Bengali classics and dry-fruit delicacies to festival hampers and the entire sugar-free range.</p>
      </section>

      <section className="container-x pb-12">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
          <div className="flex items-center gap-2 border border-gold/40 px-4 py-2 md:w-80">
            <Search size={16} className="text-maroon"/>
            <input
              data-testid="menu-search-input"
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
              placeholder="Search sweets…"
              className="bg-transparent outline-none text-sm w-full"
            />
          </div>
          <div className="flex flex-wrap gap-2 overflow-x-auto no-scrollbar">
            {cats.map((c) => (
              <button
                key={c}
                data-testid={`category-filter-${c.toLowerCase().replace(/[^a-z0-9]+/g,"-")}`}
                onClick={() => setCat(c)}
                className={`px-4 py-2 text-xs uppercase tracking-widest transition-colors border ${
                  cat === c
                    ? "bg-maroon text-cream border-maroon"
                    : "bg-transparent text-maroon border-gold/40 hover:bg-gold/10"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({length:6}).map((_,i)=>(
              <div key={i} className="aspect-square bg-cream-alt animate-pulse"/>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted2">No sweets found. Try a different filter.</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(p => <ProductCard key={p.id} product={p}/>)}
          </div>
        )}
      </section>
    </div>
  );
}
