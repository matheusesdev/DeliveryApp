// Contexto para gerenciar endereços do usuário
import React, { createContext, useContext, useState, useMemo } from 'react';

const AddressContext = createContext(null);

// Mock inicial de endereços
const INITIAL_ADDRESSES = [
  {
    id: '1',
    label: 'Casa',
    street: 'Rua das Flores, 123',
    complement: 'Apto 45',
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01000-000',
    isDefault: true,
  },
  {
    id: '2',
    label: 'Trabalho',
    street: 'Av. Paulista, 1000',
    complement: 'Sala 801',
    neighborhood: 'Bela Vista',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01310-100',
    isDefault: false,
  },
];

export function AddressProvider({ children }) {
  const [addresses, setAddresses] = useState(INITIAL_ADDRESSES);

  // Adicionar novo endereço
  const addAddress = (address) => {
    const newAddress = {
      ...address,
      id: Date.now().toString(),
      isDefault: addresses.length === 0, // Primeiro endereço é automaticamente padrão
    };
    setAddresses((prev) => [...prev, newAddress]);
    return newAddress;
  };

  // Atualizar endereço existente
  const updateAddress = (id, updates) => {
    setAddresses((prev) =>
      prev.map((addr) => (addr.id === id ? { ...addr, ...updates } : addr))
    );
  };

  // Remover endereço
  const removeAddress = (id) => {
    setAddresses((prev) => {
      const filtered = prev.filter((addr) => addr.id !== id);
      // Se removemos o endereço padrão e ainda há outros, definir o primeiro como padrão
      const hasDefault = filtered.some((addr) => addr.isDefault);
      if (!hasDefault && filtered.length > 0) {
        filtered[0].isDefault = true;
      }
      return filtered;
    });
  };

  // Definir endereço como padrão
  const setDefaultAddress = (id) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  };

  // Obter endereço padrão
  const defaultAddress = useMemo(
    () => addresses.find((addr) => addr.isDefault) || addresses[0] || null,
    [addresses]
  );

  const value = useMemo(
    () => ({
      addresses,
      addAddress,
      updateAddress,
      removeAddress,
      setDefaultAddress,
      defaultAddress,
    }),
    [addresses, defaultAddress]
  );

  return <AddressContext.Provider value={value}>{children}</AddressContext.Provider>;
}

export const useAddress = () => {
  const ctx = useContext(AddressContext);
  if (!ctx) throw new Error('useAddress must be used within AddressProvider');
  return ctx;
};
