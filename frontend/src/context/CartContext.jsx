import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const KEY = "sharma_cart_v1";

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  const add = (product, qty = 1) => {
    setItems((prev) => {
      const i = prev.findIndex((p) => p.product_id === product.id);
      if (i >= 0) {
        const c = [...prev];
        c[i] = { ...c[i], quantity: c[i].quantity + qty };
        return c;
      }
      return [
        ...prev,
        {
          product_id: product.id,
          name: product.name,
          price: product.price,
          quantity: qty,
          image: product.image,
        },
      ];
    });
    setOpen(true);
  };
  const remove = (id) => setItems((p) => p.filter((i) => i.product_id !== id));
  const setQty = (id, q) =>
    setItems((p) =>
      p.map((i) => (i.product_id === id ? { ...i, quantity: Math.max(1, q) } : i))
    );
  const clear = () => setItems([]);

  const subtotal = useMemo(
    () => items.reduce((s, i) => s + i.price * i.quantity, 0),
    [items]
  );
  const count = useMemo(
    () => items.reduce((s, i) => s + i.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{ items, add, remove, setQty, clear, subtotal, count, open, setOpen }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
