// Contexto para gerenciar histórico de pedidos
import React, { createContext, useContext, useState, useMemo } from 'react';

const OrderContext = createContext(null);

// Mock de pedidos anteriores
const INITIAL_ORDERS = [
  {
    id: '1001',
    date: new Date('2025-11-10T19:30:00'),
    status: 'delivered', // pending, preparing, on_the_way, delivered, cancelled
    items: [
      { id: 'pizza-catupiry', name: 'Pizza de frango com catupiry', price: 90, qty: 1 },
      { id: 'refrigerante', name: 'Refrigerante Lata', price: 5, qty: 2 },
    ],
    subtotal: 100,
    deliveryFee: 8,
    total: 108,
    address: {
      label: 'Casa',
      street: 'Rua das Flores, 123',
      complement: 'Apto 45',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
    },
    payment: {
      method: 'pix',
      name: 'PIX',
    },
  },
  {
    id: '1002',
    date: new Date('2025-11-09T20:15:00'),
    status: 'delivered',
    items: [
      { id: 'x-salada', name: 'X-Salada Clássico', price: 12, qty: 2 },
      { id: 'suco-natural', name: 'Suco Natural', price: 8, qty: 1 },
    ],
    subtotal: 32,
    deliveryFee: 8,
    total: 40,
    address: {
      label: 'Trabalho',
      street: 'Av. Paulista, 1000',
      complement: 'Sala 801',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
    },
    payment: {
      method: 'credit',
      name: 'Cartão de Crédito',
    },
  },
  {
    id: '1003',
    date: new Date('2025-11-08T18:45:00'),
    status: 'cancelled',
    items: [
      { id: 'pizza-calabresa', name: 'Pizza de calabresa', price: 85, qty: 1 },
    ],
    subtotal: 85,
    deliveryFee: 8,
    total: 93,
    address: {
      label: 'Casa',
      street: 'Rua das Flores, 123',
      complement: 'Apto 45',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
    },
    payment: {
      method: 'money',
      name: 'Dinheiro',
    },
  },
];

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(INITIAL_ORDERS);

  // Adicionar novo pedido
  const addOrder = (orderData) => {
    const newOrder = {
      ...orderData,
      id: Date.now().toString(),
      date: new Date(),
      status: 'pending',
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  // Atualizar status do pedido
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  // Cancelar pedido
  const cancelOrder = (orderId) => {
    updateOrderStatus(orderId, 'cancelled');
  };

  // Reordenar (criar novo pedido com os mesmos itens)
  const reorder = (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return null;

    const newOrder = {
      items: order.items,
      subtotal: order.subtotal,
      deliveryFee: order.deliveryFee,
      total: order.total,
      address: order.address,
      payment: order.payment,
    };

    return addOrder(newOrder);
  };

  const value = useMemo(
    () => ({
      orders,
      addOrder,
      updateOrderStatus,
      cancelOrder,
      reorder,
    }),
    [orders]
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export const useOrders = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrders must be used within OrderProvider');
  return ctx;
};

// Helpers para formatação
export const formatOrderDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const formatOrderTime = (date) => {
  const d = new Date(date);
  return d.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getStatusLabel = (status) => {
  const labels = {
    pending: 'Pendente',
    preparing: 'Em Preparo',
    on_the_way: 'A Caminho',
    delivered: 'Entregue',
    cancelled: 'Cancelado',
  };
  return labels[status] || status;
};

export const getStatusColor = (status) => {
  const colors = {
    pending: '#f59e0b',
    preparing: '#3b82f6',
    on_the_way: '#8b5cf6',
    delivered: '#10b981',
    cancelled: '#ef4444',
  };
  return colors[status] || '#6b655c';
};
