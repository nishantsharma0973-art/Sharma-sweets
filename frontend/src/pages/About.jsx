import React from "react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div data-testid="about-page" className="bg-cream">
      <section className="container-x pt-16 pb-24 grid md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-6">
          <div className="eyebrow mb-3">Our Story</div>
          <h1 className="text-5xl md:text-6xl text-maroon-deep leading-tight">A family. A flame. <br/><em className="text-saffron not-italic">A handful</em> of tradition.</h1>
          <div className="divider-gold mt-6"/>
          <p className="text-muted2 mt-6 leading-relaxed">
            Sharma Sweets began as a single brass kadhai in a corner of old Dausa — patience, pure ghee, and a recipe whispered down four generations. Today, we serve weddings, festivals and quiet evenings across India with the same flame, the same hands, the same heart.
          </p>
          <p className="text-muted2 mt-4 leading-relaxed">
            Every sweet you receive is hand-portioned on the day of dispatch. No preservatives, no shortcuts, no compromise.
          </p>
        </div>
        <div className="md:col-span-6">
          <img src="https://images.pexels.com/photos/8887062/pexels-photo-8887062.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Family preparing traditional sweets" className="w-full aspect-[4/5] object-cover"/>
        </div>
      </section>

      <section className="bg-cream-alt section-pad">
        <div className="container-x grid md:grid-cols-3 gap-8">
          {[
            {t:"Our Mission", d:"To preserve the soul of Indian sweet-making in an age of mass production — one hand-rolled peda at a time."},
            {t:"Our Values", d:"Purity, patience, and pride. We never use synthetic colours, vanaspati or preservatives. Ever."},
            {t:"Hygiene Commitment", d:"FSSAI-certified kitchens, monthly food-safety audits, hand-sealed tamper-proof packaging on every order."},
          ].map((x,i)=>(
            <div key={i} className="bg-cream border border-gold/20 p-8">
              <div className="font-heading text-3xl text-maroon-deep">{x.t}</div>
              <div className="divider-gold mt-4 mb-5"/>
              <p className="text-muted2 leading-relaxed">{x.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-pad bg-maroon-deep text-cream">
        <div className="container-x grid md:grid-cols-4 gap-8 text-center">
          {[
            {n:"4+", l:"Generations"},
            {n:"50K+", l:"Boxes shipped"},
            {n:"2.4K+", l:"5★ reviews"},
            {n:"100%", l:"Hand-crafted"},
          ].map((s,i)=>(
            <div key={i}>
              <div className="font-heading text-5xl md:text-6xl text-gold">{s.n}</div>
              <div className="text-xs uppercase tracking-[0.3em] mt-2 text-cream/70">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-pad text-center">
        <div className="container-x">
          <h2 className="text-4xl md:text-5xl text-maroon-deep">Taste a piece of our story</h2>
          <div className="divider-gold mx-auto mt-6 mb-8"/>
          <Link to="/menu" data-testid="about-cta-menu" className="btn-primary">Explore Menu →</Link>
        </div>
      </section>
    </div>
  );
}
