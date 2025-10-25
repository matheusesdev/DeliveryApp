import React, { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState({}); // { [id]: { item, qty } }

  const addItem = (item) => {
    setItems((prev) => {
      const existing = prev[item.id];
      const qty = existing ? existing.qty + 1 : 1;
      return { ...prev, [item.id]: { item, qty } };
    });
  };

  const removeItem = (id) => {
    setItems((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const increment = (id) => {
    setItems((prev) => {
      const entry = prev[id];
      if (!entry) return prev;
      return { ...prev, [id]: { ...entry, qty: entry.qty + 1 } };
    });
  };

  const decrement = (id) => {
    setItems((prev) => {
      const entry = prev[id];
      if (!entry) return prev;
      const nextQty = entry.qty - 1;
      if (nextQty <= 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: { ...entry, qty: nextQty } };
    });
  };

  const { count, total } = useMemo(() => {
    const values = Object.values(items);
    const count = values.reduce((acc, it) => acc + it.qty, 0);
    const total = values.reduce((acc, it) => acc + it.qty * it.item.price, 0);
    return { count, total };
  }, [items]);

  const value = useMemo(
    () => ({ items, addItem, removeItem, increment, decrement, count, total }),
    [items, count, total]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

export const currency = (n) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);
