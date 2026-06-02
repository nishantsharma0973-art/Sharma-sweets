import React from "react";
import { Link } from "react-router-dom";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function CartDrawer() {
  const { items, open, setOpen, setQty, remove, subtotal } = useCart();

  return (
    <>
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-maroon-deep/40 z-[60] transition-opacity ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
      <aside
        data-testid="cart-drawer"
        className={`fixed top-0 right-0 h-full w-full sm:w-[440px] bg-cream z-[70] shadow-2xl transition-transform duration-500 flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gold/30">
          <div>
            <div className="text-[10px] tracking-[0.3em] uppercase text-saffron">Your selection</div>
            <h3 className="font-heading text-2xl text-maroon-deep">Cart</h3>
          </div>
          <button data-testid="cart-close" onClick={() => setOpen(false)} aria-label="Close" className="p-2">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-10 text-center">
              <ShoppingBag size={48} className="text-gold mb-4" strokeWidth={1} />
              <div className="font-heading text-2xl text-maroon-deep mb-2">Your cart is empty</div>
              <p className="text-sm text-muted2 mb-6">Begin your celebration with a hand-picked sweet.</p>
              <Link to="/menu" onClick={() => setOpen(false)} className="btn-primary" data-testid="cart-empty-cta">
                Explore Menu
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gold/20">
              {items.map((it) => (
                <li key={it.product_id} className="p-5 flex gap-4">
                  <img src={it.image} alt={it.name} className="w-20 h-20 object-cover bg-cream-alt" />
                  <div className="flex-1">
                    <div className="font-heading text-lg text-maroon-deep leading-tight">{it.name}</div>
                    <div className="text-sm text-muted2 mt-1">₹{it.price.toLocaleString("en-IN")}</div>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="inline-flex items-center border border-gold/40">
                        <button data-testid={`qty-dec-${it.product_id.slice(0,6)}`} onClick={() => setQty(it.product_id, it.quantity - 1)} className="px-2 py-1 hover:bg-gold/10"><Minus size={12}/></button>
                        <span className="px-3 text-sm">{it.quantity}</span>
                        <button data-testid={`qty-inc-${it.product_id.slice(0,6)}`} onClick={() => setQty(it.product_id, it.quantity + 1)} className="px-2 py-1 hover:bg-gold/10"><Plus size={12}/></button>
                      </div>
                      <button data-testid={`remove-${it.product_id.slice(0,6)}`} onClick={() => remove(it.product_id)} className="text-muted2 hover:text-maroon ml-auto"><Trash2 size={16}/></button>
                    </div>
                  </div>
                  <div className="font-heading text-lg text-ink whitespace-nowrap">₹{(it.price * it.quantity).toLocaleString("en-IN")}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-gold/30 p-6 space-y-4 bg-cream-alt">
            <div className="flex justify-between text-sm">
              <span className="text-muted2">Subtotal</span>
              <span data-testid="cart-subtotal" className="font-heading text-xl text-maroon-deep">₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="text-xs text-muted2">Free delivery on orders above ₹999. Taxes calculated at checkout.</div>
            <Link to="/checkout" onClick={() => setOpen(false)} className="btn-primary w-full" data-testid="cart-checkout">
              Proceed to Checkout
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
