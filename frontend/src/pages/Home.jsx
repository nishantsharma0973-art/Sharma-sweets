import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Award, Heart, Leaf, Star, Truck } from "lucide-react";
import { fetchProducts, fetchTestimonials } from "../lib/api";
import ProductCard from "../components/ProductCard";
import FestivalSection from "../components/FestivalSection";
import FAQ from "../components/FAQ";
import { BUSINESS } from "../lib/site";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    fetchProducts().then((all) => setProducts(all.slice(0, 6))).catch(()=>{});
    fetchTestimonials().then(setTestimonials).catch(()=>{});
  }, []);

  return (
    <div data-testid="home-page">
      {/* HERO */}
      <section className="relative overflow-hidden bg-cream">
        <div className="container-x grid md:grid-cols-12 gap-10 items-center pt-12 md:pt-20 pb-20 md:pb-32">
          <div className="md:col-span-6 fade-up-on-mount">
            <div className="eyebrow mb-4">Est. — Tradition · Dausa, Rajasthan</div>
            <h1 className="text-5xl md:text-7xl text-maroon-deep leading-[0.95] mb-6">
              Bringing <em className="text-saffron not-italic">Sweetness</em><br/>
              to every <span className="italic text-gold">Celebration</span>
            </h1>
            <p className="text-muted2 text-lg max-w-lg mb-8 leading-relaxed">
              Hand-crafted Indian sweets, festival hampers and bespoke catering — made the way grandmother taught us, served the way the moment deserves.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/menu" data-testid="hero-order-now" className="btn-primary">
                Order Now <ArrowRight size={14}/>
              </Link>
              <Link to="/menu" data-testid="hero-view-menu" className="btn-secondary">View Menu</Link>
            </div>
            <div className="mt-10 flex items-center gap-6 text-xs text-muted2 uppercase tracking-widest">
              <div className="flex items-center gap-2"><Award size={16} className="text-gold"/> FSSAI Certified</div>
              <div className="flex items-center gap-2"><Truck size={16} className="text-gold"/> Pan-India Delivery</div>
            </div>
          </div>

          <div className="md:col-span-6 relative">
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1758910536889-43ce7b3199fd?auto=format&fit=crop&w=1200&q=85"
                alt="Assortment of premium Indian sweets"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute top-6 left-6 right-6 h-full border border-gold/40 pointer-events-none"/>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-cream border border-gold/30 p-5 hidden md:block shadow-xl">
              <div className="flex items-center gap-1 text-saffron">
                {Array.from({length:5}).map((_,i)=><Star key={i} size={14} fill="currentColor" strokeWidth={0}/>)}
              </div>
              <div className="font-heading text-xl text-maroon-deep mt-1">4.9 · 2,400+ reviews</div>
              <div className="text-xs text-muted2 tracking-widest uppercase mt-1">Loved across Rajasthan</div>
            </div>
          </div>
        </div>

        <div className="border-y border-gold/20 overflow-hidden py-5 bg-cream-alt">
          <div className="marquee whitespace-nowrap font-heading text-2xl text-maroon-deep">
            {Array.from({length:2}).map((_,j)=>(
              <div key={j} className="flex gap-12">
                {["Kaju Katli","Rasgulla","Diwali Hampers","Sugar-Free","Bengali Sweets","Wedding Catering","Bhujia","Sandesh","Festival Gift Boxes"].map((x,i)=>(
                  <span key={i} className="flex items-center gap-12 italic"><span className="text-gold">✦</span> {x}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section data-testid="featured-section" className="section-pad">
        <div className="container-x">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <div className="eyebrow mb-3">Signatures</div>
              <h2 className="text-4xl md:text-5xl text-maroon-deep">Featured sweets</h2>
              <div className="divider-gold mt-5"/>
            </div>
            <Link to="/menu" data-testid="featured-view-all" className="btn-ghost">View all menu →</Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(p => <ProductCard key={p.id} product={p}/>)}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section data-testid="why-us-section" className="section-pad bg-cream-alt">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="eyebrow mb-3">Why Sharma Sweets</div>
            <h2 className="text-4xl md:text-5xl text-maroon-deep">Tradition you can taste</h2>
            <div className="divider-gold mx-auto mt-6"/>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {icon: Leaf, t:"Pure Ingredients", d:"A2 milk, organic ghee, slow-cooked fillings. Zero shortcuts."},
              {icon: Heart, t:"Family Recipes", d:"Heirloom techniques passed down across four generations."},
              {icon: Award, t:"Hygiene First", d:"FSSAI-certified kitchens with airtight, hand-sealed packaging."},
              {icon: Truck, t:"Fresh Delivery", d:"Same-day in Dausa & Jaipur; cold-chain dispatch pan-India."},
            ].map((x,i)=>(
              <div key={i} className="bg-cream border border-gold/20 p-7 hover-lift">
                <x.icon size={28} strokeWidth={1.3} className="text-saffron"/>
                <div className="font-heading text-2xl text-maroon-deep mt-4">{x.t}</div>
                <p className="text-sm text-muted2 mt-2 leading-relaxed">{x.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FESTIVAL */}
      <FestivalSection/>

      {/* TESTIMONIALS */}
      <section data-testid="testimonials-section" className="section-pad bg-maroon-deep text-cream relative grain">
        <div className="container-x relative">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-xs tracking-[0.25em] uppercase text-gold mb-3">Customer love</div>
            <h2 className="text-4xl md:text-5xl">Stories sweeter than the sweets</h2>
            <div className="divider-gold mx-auto mt-6"/>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.slice(0,3).map((t)=>(
              <figure key={t.id} data-testid={`testimonial-${t.id.slice(0,6)}`} className="border border-gold/20 p-7 hover-lift">
                <div className="flex gap-1 text-gold mb-4">
                  {Array.from({length:t.rating}).map((_,i)=><Star key={i} size={14} fill="currentColor" strokeWidth={0}/>)}
                </div>
                <blockquote className="font-heading text-xl leading-snug">“{t.text}”</blockquote>
                <figcaption className="mt-5 text-xs uppercase tracking-widest text-gold">{t.name} · {t.location}</figcaption>
              </figure>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/testimonials" data-testid="testimonials-all" className="text-xs uppercase tracking-widest text-gold border-b border-gold/40 pb-1 hover:text-cream">Read all reviews</Link>
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="py-20 bg-cream">
        <div className="container-x">
          <div className="bg-gradient-to-r from-saffron via-gold to-saffron text-maroon-deep p-10 md:p-16 grid md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2">
              <div className="text-xs tracking-[0.3em] uppercase mb-2">Limited · Festive Season</div>
              <h3 className="font-heading text-3xl md:text-4xl">Bulk orders for weddings & corporate gifting</h3>
              <p className="mt-3 text-maroon-deep/80">Custom packaging, dedicated coordinator, free design consult.</p>
            </div>
            <Link to="/catering" data-testid="cta-catering" className="btn-secondary !bg-maroon-deep !text-cream !border-maroon-deep hover:!bg-cream hover:!text-maroon-deep justify-self-start md:justify-self-end">Plan an event →</Link>
          </div>
        </div>
      </section>

      <FAQ/>
    </div>
  );
}
