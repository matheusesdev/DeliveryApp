// Um contexto simples para centralizar o carrinho.
// Nada de overengineering: estado local com um objeto e alguns helpers.
import React, { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  // Guardamos itens como um dicionário: { [id]: { item, qty } }
  // Isso facilita incrementar/decrementar sem precisar varrer arrays.
  const [items, setItems] = useState({});

  // Quando o usuário aperta "adicionar ao pedido" no detalhe, caímos aqui.
  const addItem = (item) => {
    setItems((prev) => {
      const existing = prev[item.id];
      const qty = existing ? existing.qty + 1 : 1;
      return { ...prev, [item.id]: { item, qty } };
    });
  };

  // Ação direta: remove o item do carrinho sem rodeios.
  const removeItem = (id) => {
    setItems((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  // Botão de "+": só aumenta a quantidade daquele item.
  const increment = (id) => {
    setItems((prev) => {
      const entry = prev[id];
      if (!entry) return prev;
      return { ...prev, [id]: { ...entry, qty: entry.qty + 1 } };
    });
  };

  // Botão de "-": se bater zero, a gente tira o item da lista.
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

  // Derivados úteis para mostrar no UI (badge na tab e total do pedido)
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

// Um pequeno azedinho para evitar uso fora do provider (ajuda no dev)
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

// Formatação BRL que usamos em todo lugar
export const currency = (n) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);
