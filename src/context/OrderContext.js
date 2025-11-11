/**
 * OrderContext - Gerenciamento de Histórico de Pedidos
 * 
 * Este contexto gerencia todo o histórico de pedidos do usuário, incluindo:
 * - Criação de novos pedidos
 * - Acompanhamento de status (5 estados possíveis)
 * - Cancelamento de pedidos
 * - Função "Pedir Novamente" (reorder)
 * - Helpers para formatação de data/hora e visualização de status
 */

import React, { createContext, useContext, useState, useMemo } from 'react';

// Criação do contexto - será acessível via useOrders() hook
const OrderContext = createContext(null);

/**
 * INITIAL_ORDERS - Dados mockados de pedidos anteriores
 * 
 * Cada pedido contém:
 * - id: Identificador único do pedido
 * - date: Data/hora do pedido (objeto Date)
 * - status: Estado atual - 'pending' | 'preparing' | 'on_the_way' | 'delivered' | 'cancelled'
 * - items: Array de itens do pedido (com id, name, price, qty)
 * - subtotal: Soma dos itens sem taxa de entrega
 * - deliveryFee: Taxa de entrega fixa
 * - total: Valor total (subtotal + deliveryFee)
 * - address: Endereço de entrega completo
 * - payment: Método de pagamento utilizado
 */
const INITIAL_ORDERS = [
  {
    id: '1001',
    date: new Date('2025-11-10T19:30:00'),
    status: 'delivered', // Status: entregue
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

/**
 * OrderProvider - Provedor do contexto de pedidos
 * 
 * Envolve a aplicação para fornecer acesso ao estado e funções de
 * gerenciamento de pedidos para todos os componentes filhos.
 * 
 * @param {Object} props
 * @param {ReactNode} props.children - Componentes filhos
 */
export function OrderProvider({ children }) {
  // Estado que armazena todos os pedidos do usuário
  const [orders, setOrders] = useState(INITIAL_ORDERS);

  /**
   * addOrder - Cria um novo pedido e adiciona ao histórico
   * 
   * @param {Object} orderData - Dados do pedido (items, address, payment, valores)
   * @returns {Object} O pedido criado com id, date e status inicializados
   * 
   * Lógica:
   * 1. Gera ID único baseado no timestamp
   * 2. Define data/hora atual
   * 3. Inicia com status 'pending' (aguardando confirmação)
   * 4. Adiciona no início do array (pedidos mais recentes primeiro)
   */
  const addOrder = (orderData) => {
    const newOrder = {
      ...orderData,
      id: Date.now().toString(), // ID único
      date: new Date(), // Data/hora atual
      status: 'pending', // Status inicial: aguardando confirmação
    };
    setOrders((prev) => [newOrder, ...prev]); // Adiciona no início (mais recentes primeiro)
    return newOrder;
  };

  /**
   * updateOrderStatus - Atualiza o status de um pedido específico
   * 
   * @param {string} orderId - ID do pedido a ser atualizado
   * @param {string} newStatus - Novo status (pending, preparing, on_the_way, delivered, cancelled)
   * 
   * Percorre todos os pedidos e atualiza apenas o que tem o ID correspondente.
   * Mantém imutabilidade criando um novo array.
   */
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  /**
   * cancelOrder - Cancela um pedido (atalho para updateOrderStatus)
   * 
   * @param {string} orderId - ID do pedido a ser cancelado
   * 
   * Função de conveniência que define o status como 'cancelled'.
   * Útil para manter o código mais semântico e legível.
   */
  const cancelOrder = (orderId) => {
    updateOrderStatus(orderId, 'cancelled');
  };

  /**
   * reorder - Cria um novo pedido baseado em um pedido anterior
   * 
   * @param {string} orderId - ID do pedido a ser reordenado
   * @returns {Object|null} Novo pedido criado ou null se o pedido não for encontrado
   * 
   * Funcionalidade "Pedir Novamente":
   * 1. Busca o pedido original pelo ID
   * 2. Cria um novo pedido com os mesmos itens, endereço e forma de pagamento
   * 3. O novo pedido recebe novo ID, nova data e status 'pending'
   */
  const reorder = (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return null; // Pedido não encontrado
    
    // Cria novo pedido com os dados do pedido original
    const newOrder = {
      items: order.items,
      subtotal: order.subtotal,
      deliveryFee: order.deliveryFee,
      total: order.total,
      address: order.address,
      payment: order.payment,
    };

    return addOrder(newOrder); // Adiciona como novo pedido
  };

  /**
   * value - Objeto disponibilizado pelo contexto
   * 
   * Usa useMemo para otimização - só recria quando orders mudar
   */
  const value = useMemo(
    () => ({
      orders,
      addOrder,
      updateOrderStatus,
      cancelOrder,
      reorder,
    }),
    [orders] // Recria apenas quando orders mudar
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

/**
 * useOrders - Hook personalizado para acessar o OrderContext
 * 
 * @returns {Object} Objeto contendo orders e funções de gerenciamento
 * @throws {Error} Se usado fora de um OrderProvider
 * 
 * Exemplo de uso:
 * const { orders, addOrder, reorder } = useOrders();
 */
export const useOrders = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrders must be used within OrderProvider');
  return ctx;
};

// ============================================================================
// HELPER FUNCTIONS - Funções utilitárias para formatação e visualização
// ============================================================================

/**
 * formatOrderDate - Formata a data do pedido para exibição
 * 
 * @param {Date|string} date - Data do pedido
 * @returns {string} Data formatada no padrão brasileiro (DD/MM/YYYY)
 * 
 * Exemplo: "10/11/2025"
 */
export const formatOrderDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

/**
 * formatOrderTime - Formata a hora do pedido para exibição
 * 
 * @param {Date|string} date - Data/hora do pedido
 * @returns {string} Hora formatada no padrão 24h (HH:MM)
 * 
 * Exemplo: "19:30"
 */
export const formatOrderTime = (date) => {
  const d = new Date(date);
  return d.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * getStatusLabel - Retorna o texto amigável para cada status
 * 
 * @param {string} status - Status do pedido
 * @returns {string} Label em português para exibição
 * 
 * Mapeamento:
 * - pending -> "Pendente"
 * - preparing -> "Em Preparo"
 * - on_the_way -> "A Caminho"
 * - delivered -> "Entregue"
 * - cancelled -> "Cancelado"
 */
export const getStatusLabel = (status) => {
  const labels = {
    pending: 'Pendente',
    preparing: 'Em Preparo',
    on_the_way: 'A Caminho',
    delivered: 'Entregue',
    cancelled: 'Cancelado',
  };
  return labels[status] || status; // Retorna o próprio status se não encontrar mapeamento
};

/**
 * getStatusColor - Retorna a cor associada a cada status
 * 
 * @param {string} status - Status do pedido
 * @returns {string} Código hexadecimal da cor
 * 
 * Cores para identificação visual rápida:
 * - pending (Pendente): Laranja (#f59e0b)
 * - preparing (Em Preparo): Azul (#3b82f6)
 * - on_the_way (A Caminho): Roxo (#8b5cf6)
 * - delivered (Entregue): Verde (#10b981)
 * - cancelled (Cancelado): Vermelho (#ef4444)
 */
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
