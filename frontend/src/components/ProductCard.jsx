import React from "react";
import { Plus } from "lucide-react";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";

export default function ProductCard({ product }) {
  const { add } = useCart();
  const onAdd = () => {
    add(product);
    toast.success(`${product.name} added to cart`);
  };
  const slug = product.id.slice(0, 6);
  return (
    <article
      data-testid={`product-card-${slug}`}
      className="bg-white border border-gold/20 hover-lift overflow-hidden group flex flex-col"
    >
      <div className="overflow-hidden bg-cream-alt aspect-square relative">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-110"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 bg-maroon text-cream text-[10px] tracking-widest uppercase px-2 py-1">
            {product.badge}
          </span>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="text-[10px] tracking-[0.25em] uppercase text-saffron mb-1">{product.category}</div>
        <h3 className="font-heading text-2xl text-maroon-deep leading-tight">{product.name}</h3>
        <p className="text-sm text-muted2 mt-2 flex-1 leading-relaxed">{product.description}</p>
        <div className="flex items-end justify-between mt-5 pt-4 border-t border-gold/15">
          <div>
            <div className="text-[10px] tracking-widest uppercase text-muted2">per 500g</div>
            <div className="font-heading text-2xl text-ink">₹{product.price.toLocaleString("en-IN")}</div>
          </div>
          <button
            data-testid={`add-to-cart-${slug}`}
            onClick={onAdd}
            className="inline-flex items-center gap-2 bg-saffron text-white hover:bg-maroon px-4 py-2 text-xs uppercase tracking-widest transition-colors"
          >
            <Plus size={14} strokeWidth={2} /> Add
          </button>
        </div>
      </div>
    </article>
  );
}
