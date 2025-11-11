/**
 * AddressContext - Gerenciamento de Endereços de Entrega
 * 
 * Este contexto é responsável por gerenciar todos os endereços de entrega do usuário.
 * Fornece funcionalidades de CRUD (Create, Read, Update, Delete) e gerenciamento
 * de endereço padrão que será usado automaticamente no checkout.
 */

import React, { createContext, useContext, useState, useMemo } from 'react';

// Criação do contexto - será acessível via useAddress() hook
const AddressContext = createContext(null);

/**
 * INITIAL_ADDRESSES - Dados mockados para demonstração
 * Em produção, esses dados viriam de uma API e seriam salvos localmente (AsyncStorage)
 * 
 * Estrutura de cada endereço:
 * - id: Identificador único
 * - label: Rótulo amigável (Casa, Trabalho, etc.)
 * - street: Logradouro completo com número
 * - complement: Complemento (apartamento, bloco, etc.) - opcional
 * - neighborhood: Bairro
 * - city: Cidade
 * - state: Estado (UF)
 * - zipCode: CEP formatado
 * - isDefault: Boolean indicando se é o endereço padrão
 */
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

/**
 * AddressProvider - Provedor do contexto de endereços
 * 
 * Envolve a aplicação (ou parte dela) para fornecer acesso ao estado e funções
 * de gerenciamento de endereços para todos os componentes filhos.
 * 
 * @param {Object} props - Props do componente
 * @param {ReactNode} props.children - Componentes filhos que terão acesso ao contexto
 */
export function AddressProvider({ children }) {
  // Estado que armazena a lista de todos os endereços do usuário
  const [addresses, setAddresses] = useState(INITIAL_ADDRESSES);

  /**
   * addAddress - Adiciona um novo endereço à lista
   * 
   * @param {Object} address - Objeto contendo os dados do novo endereço
   * @returns {Object} O endereço criado com id e isDefault definidos
   * 
   * Lógica:
   * 1. Gera um ID único baseado no timestamp
   * 2. Se for o primeiro endereço, define automaticamente como padrão
   * 3. Adiciona o novo endereço ao final da lista
   */
  const addAddress = (address) => {
    const newAddress = {
      ...address,
      id: Date.now().toString(), // ID único baseado no timestamp atual
      isDefault: addresses.length === 0, // Primeiro endereço é automaticamente padrão
    };
    setAddresses((prev) => [...prev, newAddress]);
    return newAddress;
  };

  /**
   * updateAddress - Atualiza os dados de um endereço existente
   * 
   * @param {string} id - ID do endereço a ser atualizado
   * @param {Object} updates - Objeto contendo os campos a serem atualizados
   * 
   * Utiliza map() para criar um novo array, modificando apenas o endereço
   * com o ID correspondente. Mantém imutabilidade do estado.
   */
  const updateAddress = (id, updates) => {
    setAddresses((prev) =>
      prev.map((addr) => (addr.id === id ? { ...addr, ...updates } : addr))
    );
  };

  /**
   * removeAddress - Remove um endereço da lista
   * 
   * @param {string} id - ID do endereço a ser removido
   * 
   * Lógica de segurança:
   * 1. Filtra o endereço com o ID especificado
   * 2. Se o endereço removido era o padrão, define o primeiro da lista como novo padrão
   * 3. Isso garante que sempre haverá um endereço padrão (se houver endereços)
   */
  const removeAddress = (id) => {
    setAddresses((prev) => {
      const filtered = prev.filter((addr) => addr.id !== id);
      
      // Verifica se ainda existe um endereço marcado como padrão
      const hasDefault = filtered.some((addr) => addr.isDefault);
      
      // Se não houver padrão e ainda existirem endereços, define o primeiro como padrão
      if (!hasDefault && filtered.length > 0) {
        filtered[0].isDefault = true;
      }
      
      return filtered;
    });
  };

  /**
   * setDefaultAddress - Define um endereço específico como padrão
   * 
   * @param {string} id - ID do endereço a ser marcado como padrão
   * 
   * Percorre todos os endereços:
   * - Define isDefault=true apenas para o endereço com o ID especificado
   * - Define isDefault=false para todos os outros
   * Garante que apenas um endereço seja padrão por vez
   */
  const setDefaultAddress = (id) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id, // true apenas para o endereço selecionado
      }))
    );
  };

  /**
   * defaultAddress - Valor computado que retorna o endereço padrão atual
   * 
   * Usa useMemo para otimização - só recalcula quando a lista de endereços muda
   * 
   * @returns {Object|null} O endereço marcado como padrão, ou o primeiro da lista,
   *                        ou null se não houver endereços
   */
  const defaultAddress = useMemo(
    () => addresses.find((addr) => addr.isDefault) || addresses[0] || null,
    [addresses] // Dependência: recalcula apenas quando addresses mudar
  );

  /**
   * value - Objeto que será disponibilizado pelo contexto
   * 
   * Usa useMemo para evitar recriação desnecessária do objeto em cada render
   * Contém:
   * - addresses: Array com todos os endereços
   * - Funções: addAddress, updateAddress, removeAddress, setDefaultAddress
   * - defaultAddress: Endereço padrão computado
   */
  const value = useMemo(
    () => ({
      addresses,
      addAddress,
      updateAddress,
      removeAddress,
      setDefaultAddress,
      defaultAddress,
    }),
    [addresses, defaultAddress] // Recria apenas quando addresses ou defaultAddress mudarem
  );

  return <AddressContext.Provider value={value}>{children}</AddressContext.Provider>;
}

/**
 * useAddress - Hook personalizado para acessar o AddressContext
 * 
 * @returns {Object} Objeto contendo addresses, funções CRUD e defaultAddress
 * @throws {Error} Se usado fora de um AddressProvider
 * 
 * Exemplo de uso:
 * const { addresses, addAddress, defaultAddress } = useAddress();
 */
export const useAddress = () => {
  const ctx = useContext(AddressContext);
  if (!ctx) throw new Error('useAddress must be used within AddressProvider');
  return ctx;
};
