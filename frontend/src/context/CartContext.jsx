import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem("motorly_cart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Persist cart to localStorage on every change
  useEffect(() => {
    localStorage.setItem("motorly_cart", JSON.stringify(items));
  }, [items]);

  const totalQty   = items.reduce((s, i) => s + i.qty, 0);
  const subtotal   = items.reduce((s, i) => s + i.price * i.qty, 0);

  const addToCart = (product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { productId: product.id, name: product.name, price: product.price, img: product.img || null, qty: 1 }];
    });
  };

  const removeFromCart = (productId) =>
    setItems((prev) => prev.filter((i) => i.productId !== productId));

  const updateQty = (productId, delta) => {
    setItems((prev) =>
      prev
        .map((i) => (i.productId === productId ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const clearCart = () => setItems([]);

  const isInCart = (productId) => items.some((i) => i.productId === productId);

  return (
    <CartContext.Provider value={{ items, totalQty, subtotal, addToCart, removeFromCart, updateQty, clearCart, isInCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
