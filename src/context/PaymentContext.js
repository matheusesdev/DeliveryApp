// Contexto para gerenciar formas de pagamento
import React, { createContext, useContext, useState, useMemo } from 'react';

const PaymentContext = createContext(null);

// Mock inicial de formas de pagamento
const INITIAL_PAYMENT_METHODS = [
  {
    id: '1',
    type: 'credit', // credit, debit, pix, money
    name: 'Cartão de Crédito',
    brand: 'Visa',
    lastDigits: '1234',
    holderName: 'MATHEUS E SANTO',
    expiryMonth: '12',
    expiryYear: '2028',
    isDefault: true,
  },
  {
    id: '2',
    type: 'debit',
    name: 'Cartão de Débito',
    brand: 'Mastercard',
    lastDigits: '5678',
    holderName: 'MATHEUS E SANTO',
    expiryMonth: '08',
    expiryYear: '2027',
    isDefault: false,
  },
];

// Métodos fixos (não podem ser removidos)
const FIXED_METHODS = [
  {
    id: 'pix',
    type: 'pix',
    name: 'PIX',
    icon: 'qr-code-outline',
    description: 'Pagamento instantâneo',
    isFixed: true,
  },
  {
    id: 'money',
    type: 'money',
    name: 'Dinheiro',
    icon: 'cash-outline',
    description: 'Pagamento na entrega',
    isFixed: true,
  },
];

export function PaymentProvider({ children }) {
  const [savedMethods, setSavedMethods] = useState(INITIAL_PAYMENT_METHODS);

  // Todos os métodos (salvos + fixos)
  const allMethods = useMemo(() => {
    return [...savedMethods, ...FIXED_METHODS];
  }, [savedMethods]);

  // Adicionar novo método de pagamento
  const addPaymentMethod = (methodData) => {
    const newMethod = {
      ...methodData,
      id: Date.now().toString(),
      isDefault: savedMethods.length === 0, // Primeiro é padrão
    };
    setSavedMethods((prev) => [...prev, newMethod]);
    return newMethod;
  };

  // Atualizar método existente
  const updatePaymentMethod = (id, updates) => {
    setSavedMethods((prev) =>
      prev.map((method) => (method.id === id ? { ...method, ...updates } : method))
    );
  };

  // Remover método
  const removePaymentMethod = (id) => {
    setSavedMethods((prev) => {
      const filtered = prev.filter((method) => method.id !== id);
      // Se removemos o padrão e ainda há outros, definir o primeiro como padrão
      const hasDefault = filtered.some((method) => method.isDefault);
      if (!hasDefault && filtered.length > 0) {
        filtered[0].isDefault = true;
      }
      return filtered;
    });
  };

  // Definir método como padrão
  const setDefaultPaymentMethod = (id) => {
    setSavedMethods((prev) =>
      prev.map((method) => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
  };

  // Obter método padrão
  const defaultMethod = useMemo(
    () => savedMethods.find((method) => method.isDefault) || savedMethods[0] || null,
    [savedMethods]
  );

  const value = useMemo(
    () => ({
      savedMethods,
      allMethods,
      addPaymentMethod,
      updatePaymentMethod,
      removePaymentMethod,
      setDefaultPaymentMethod,
      defaultMethod,
    }),
    [savedMethods, allMethods, defaultMethod]
  );

  return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
}

export const usePayment = () => {
  const ctx = useContext(PaymentContext);
  if (!ctx) throw new Error('usePayment must be used within PaymentProvider');
  return ctx;
};

// Helper para formatar número do cartão
export const formatCardNumber = (number) => {
  return number.replace(/(\d{4})(?=\d)/g, '$1 ');
};

// Helper para obter ícone da bandeira
export const getCardBrandIcon = (brand) => {
  const icons = {
    Visa: 'card-outline',
    Mastercard: 'card-outline',
    Elo: 'card-outline',
    'American Express': 'card-outline',
  };
  return icons[brand] || 'card-outline';
};

// Helper para validar expiração
export const isCardExpired = (month, year) => {
  const now = new Date();
  const expiry = new Date(parseInt(`20${year}`), parseInt(month) - 1);
  return expiry < now;
};
