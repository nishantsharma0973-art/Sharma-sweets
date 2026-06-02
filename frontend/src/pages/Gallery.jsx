import React from "react";
import { GALLERY } from "../lib/site";

export default function Gallery() {
  return (
    <div data-testid="gallery-page" className="bg-cream">
      <section className="container-x pt-16 pb-12">
        <div className="eyebrow mb-3">Gallery</div>
        <h1 className="text-5xl md:text-6xl text-maroon-deep">Moments, sweetened.</h1>
        <div className="divider-gold mt-6"/>
        <p className="text-muted2 mt-6 max-w-2xl">A glimpse into our kitchen, our craft and the celebrations we've been a part of.</p>
      </section>
      <section className="container-x pb-24">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {GALLERY.map((src, i) => (
            <div
              key={i}
              data-testid={`gallery-tile-${i}`}
              className={`overflow-hidden group ${i % 5 === 0 ? "row-span-2 aspect-[3/4]" : "aspect-square"}`}
            >
              <img
                src={src}
                alt={`Gallery ${i+1}`}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-110"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
