import React from "react";
import { FESTIVALS } from "../lib/site";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export default function FestivalSection() {
  return (
    <section data-testid="festival-section" className="section-pad bg-gradient-to-b from-cream to-cream-alt">
      <div className="container-x">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="eyebrow mb-3">Festive Calendar</div>
          <h2 className="text-4xl md:text-5xl text-maroon-deep">A sweet for every celebration</h2>
          <div className="divider-gold mx-auto mt-6"/>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FESTIVALS.map((f, idx) => (
            <article
              key={f.key}
              data-testid={`festival-card-${f.key}`}
              className="relative overflow-hidden group hover-lift bg-maroon-deep text-cream aspect-[3/4]"
            >
              <img
                src={f.image}
                alt={f.name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-[1200ms]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-maroon-deep via-maroon-deep/60 to-transparent" />
              <div className="relative h-full flex flex-col justify-end p-6">
                <div className="flex items-center gap-2 mb-2 text-gold text-[10px] tracking-[0.25em] uppercase">
                  <Sparkles size={12}/> {f.name}
                </div>
                <h3 className="font-heading text-2xl mb-2 leading-tight">{f.headline}</h3>
                <p className="text-sm text-cream/80 mb-3">{f.desc}</p>
                <div className="text-xs bg-gold/20 backdrop-blur-sm border border-gold/40 inline-block px-3 py-1 mb-4 w-fit">{f.offer}</div>
                <Link
                  to="/menu?category=Festival Gift Boxes"
                  data-testid={`festival-cta-${f.key}`}
                  className="text-xs uppercase tracking-widest text-gold border-b border-gold/40 w-fit hover:text-cream pb-1"
                >
                  Shop {f.name} →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
