import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingBag, Menu as MenuIcon, X, Search } from "lucide-react";
import { useCart } from "../context/CartContext";

const links = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
  { to: "/catering", label: "Catering" },
  { to: "/gallery", label: "Gallery" },
  { to: "/about", label: "About" },
  { to: "/testimonials", label: "Reviews" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { count, setOpen } = useCart();
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [q, setQ] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const submitSearch = (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    nav(`/menu?search=${encodeURIComponent(q.trim())}`);
    setShowSearch(false);
    setMobile(false);
  };

  return (
    <header
      data-testid="site-navbar"
      className={`sticky top-0 z-50 glass-nav border-b transition-shadow ${
        scrolled ? "shadow-[0_4px_20px_-12px_rgba(128,0,0,0.25)] border-gold/30" : "border-transparent"
      }`}
    >
      <div className="container-x flex items-center justify-between h-20">
        <Link to="/" data-testid="nav-logo" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full bg-maroon flex items-center justify-center text-cream font-heading text-xl">S</div>
          <div className="leading-none">
            <div className="font-heading text-2xl text-maroon-deep">Sharma Sweets</div>
            <div className="text-[10px] tracking-[0.3em] text-saffron uppercase">since tradition</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              data-testid={`nav-link-${l.label.toLowerCase()}`}
              className={({ isActive }) =>
                `px-4 py-2 text-sm tracking-wider uppercase transition-colors ${
                  isActive ? "text-saffron" : "text-ink hover:text-maroon"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button
            data-testid="search-toggle"
            onClick={() => setShowSearch((s) => !s)}
            className="p-2 hover:text-saffron transition-colors"
            aria-label="Search"
          >
            <Search size={20} strokeWidth={1.5} />
          </button>
          <button
            data-testid="cart-button"
            onClick={() => setOpen(true)}
            className="relative p-2 hover:text-saffron transition-colors"
            aria-label="Cart"
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
            {count > 0 && (
              <span
                data-testid="cart-count"
                className="absolute -top-1 -right-1 bg-maroon text-cream text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-medium"
              >
                {count}
              </span>
            )}
          </button>
          <button
            data-testid="mobile-menu-toggle"
            onClick={() => setMobile((s) => !s)}
            className="lg:hidden p-2"
            aria-label="Menu"
          >
            {mobile ? <X size={22} /> : <MenuIcon size={22} />}
          </button>
        </div>
      </div>

      {showSearch && (
        <form onSubmit={submitSearch} className="container-x pb-4 -mt-2">
          <div className="flex items-center gap-2 border-b border-gold/40 pb-2">
            <Search size={18} className="text-maroon" />
            <input
              data-testid="search-input"
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search sweets, namkeen, gift boxes…"
              className="flex-1 bg-transparent outline-none text-ink placeholder:text-muted2 py-2"
            />
            <button data-testid="search-submit" type="submit" className="text-xs uppercase tracking-widest text-saffron">
              Search
            </button>
          </div>
        </form>
      )}

      {mobile && (
        <nav data-testid="mobile-menu" className="lg:hidden border-t border-gold/30 bg-cream">
          <div className="container-x py-4 flex flex-col">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                data-testid={`mobile-nav-link-${l.label.toLowerCase()}`}
                onClick={() => setMobile(false)}
                className={({ isActive }) =>
                  `py-3 border-b border-gold/15 text-sm tracking-widest uppercase ${
                    isActive ? "text-saffron" : "text-ink"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
