/**
 * PaymentContext - Gerenciamento de Formas de Pagamento
 * 
 * Este contexto gerencia todos os métodos de pagamento do usuário, incluindo:
 * - Cartões salvos (crédito e débito)
 * - Métodos fixos (PIX e dinheiro)
 * - CRUD de cartões
 * - Sistema de método padrão
 * - Validação e formatação de dados de cartão
 */

import React, { createContext, useContext, useState, useMemo } from 'react';

// Criação do contexto - será acessível via usePayment() hook
const PaymentContext = createContext(null);

/**
 * INITIAL_PAYMENT_METHODS - Dados mockados de cartões salvos
 * 
 * Estrutura de cada cartão:
 * - id: Identificador único
 * - type: Tipo do cartão ('credit' ou 'debit')
 * - name: Nome descritivo para exibição
 * - brand: Bandeira do cartão (Visa, Mastercard, Elo, American Express)
 * - lastDigits: Últimos 4 dígitos do cartão (para segurança)
 * - holderName: Nome do titular (como aparece no cartão)
 * - expiryMonth: Mês de validade (01-12)
 * - expiryYear: Ano de validade (YY)
 * - isDefault: Boolean indicando se é o método padrão
 */
const INITIAL_PAYMENT_METHODS = [
  {
    id: '1',
    type: 'credit', // Tipo: crédito
    name: 'Cartão de Crédito',
    brand: 'Visa',
    lastDigits: '1234',
    holderName: 'MATHEUS E SANTO',
    expiryMonth: '12',
    expiryYear: '2028',
    isDefault: true, // Cartão padrão
  },
  {
    id: '2',
    type: 'debit', // Tipo: débito
    name: 'Cartão de Débito',
    brand: 'Mastercard',
    lastDigits: '5678',
    holderName: 'MATHEUS E SANTO',
    expiryMonth: '08',
    expiryYear: '2027',
    isDefault: false,
  },
];

/**
 * FIXED_METHODS - Métodos de pagamento fixos que não podem ser removidos
 * 
 * Estes métodos são sempre disponíveis e não podem ser editados ou excluídos:
 * - PIX: Pagamento instantâneo via QR Code
 * - Dinheiro: Pagamento em espécie na entrega
 * 
 * Cada método fixo tem:
 * - id: Identificador único fixo
 * - type: Tipo do método (pix, money)
 * - name: Nome para exibição
 * - icon: Ícone do Ionicons
 * - description: Descrição do método
 * - isFixed: Flag para identificar que é um método fixo
 */
const FIXED_METHODS = [
  {
    id: 'pix',
    type: 'pix',
    name: 'PIX',
    icon: 'qr-code-outline',
    description: 'Pagamento instantâneo',
    isFixed: true, // Não pode ser removido
  },
  {
    id: 'money',
    type: 'money',
    name: 'Dinheiro',
    icon: 'cash-outline',
    description: 'Pagamento na entrega',
    isFixed: true, // Não pode ser removido
  },
];

/**
 * PaymentProvider - Provedor do contexto de pagamentos
 * 
 * Envolve a aplicação para fornecer acesso ao estado e funções de
 * gerenciamento de métodos de pagamento.
 * 
 * @param {Object} props
 * @param {ReactNode} props.children - Componentes filhos
 */
export function PaymentProvider({ children }) {
  // Estado que armazena apenas os cartões salvos (métodos fixos são constantes)
  const [savedMethods, setSavedMethods] = useState(INITIAL_PAYMENT_METHODS);

  /**
   * allMethods - Computed value que combina cartões salvos + métodos fixos
   * 
   * Usa useMemo para otimização - só recalcula quando savedMethods mudar.
   * Retorna um array com todos os métodos disponíveis para o usuário.
   */
  const allMethods = useMemo(() => {
    return [...savedMethods, ...FIXED_METHODS]; // Cartões primeiro, depois métodos fixos
  }, [savedMethods]);

  /**
   * addPaymentMethod - Adiciona um novo cartão de crédito/débito
   * 
   * @param {Object} methodData - Dados do cartão (type, brand, lastDigits, etc.)
   * @returns {Object} O cartão criado com id e isDefault definidos
   * 
   * Lógica:
   * 1. Gera ID único baseado no timestamp
   * 2. Se for o primeiro cartão, define automaticamente como padrão
   * 3. Adiciona ao final da lista de cartões salvos
   */
  const addPaymentMethod = (methodData) => {
    const newMethod = {
      ...methodData,
      id: Date.now().toString(), // ID único
      isDefault: savedMethods.length === 0, // Primeiro cartão é automaticamente padrão
    };
    setSavedMethods((prev) => [...prev, newMethod]);
    return newMethod;
  };

  /**
   * updatePaymentMethod - Atualiza os dados de um cartão existente
   * 
   * @param {string} id - ID do cartão a ser atualizado
   * @param {Object} updates - Objeto contendo os campos a serem atualizados
   * 
   * Permite atualizar informações como nome, data de validade, tipo, etc.
   * Mantém imutabilidade do estado usando map().
   */
  const updatePaymentMethod = (id, updates) => {
    setSavedMethods((prev) =>
      prev.map((method) => (method.id === id ? { ...method, ...updates } : method))
    );
  };

  /**
   * removePaymentMethod - Remove um cartão da lista
   * 
   * @param {string} id - ID do cartão a ser removido
   * 
   * Lógica de segurança:
   * 1. Filtra o cartão com o ID especificado
   * 2. Se o cartão removido era o padrão, define o primeiro da lista como novo padrão
   * 3. Isso garante que sempre haverá um método padrão (se houver cartões)
   * 
   * Nota: Métodos fixos (PIX, dinheiro) não podem ser removidos
   */
  const removePaymentMethod = (id) => {
    setSavedMethods((prev) => {
      const filtered = prev.filter((method) => method.id !== id);
      
      // Verifica se ainda existe um cartão marcado como padrão
      const hasDefault = filtered.some((method) => method.isDefault);
      
      // Se não houver padrão e ainda existirem cartões, define o primeiro como padrão
      if (!hasDefault && filtered.length > 0) {
        filtered[0].isDefault = true;
      }
      
      return filtered;
    });
  };

  /**
   * setDefaultPaymentMethod - Define um método específico como padrão
   * 
   * @param {string} id - ID do método a ser marcado como padrão
   * 
   * Percorre todos os cartões salvos:
   * - Define isDefault=true apenas para o cartão com o ID especificado
   * - Define isDefault=false para todos os outros
   * Garante que apenas um método seja padrão por vez
   */
  const setDefaultPaymentMethod = (id) => {
    setSavedMethods((prev) =>
      prev.map((method) => ({
        ...method,
        isDefault: method.id === id, // true apenas para o método selecionado
      }))
    );
  };

  /**
   * defaultMethod - Valor computado que retorna o método padrão atual
   * 
   * Usa useMemo para otimização - só recalcula quando savedMethods mudar
   * 
   * @returns {Object|null} O método marcado como padrão, ou o primeiro da lista,
   *                        ou null se não houver métodos salvos
   */
  const defaultMethod = useMemo(
    () => savedMethods.find((method) => method.isDefault) || savedMethods[0] || null,
    [savedMethods] // Dependência: recalcula apenas quando savedMethods mudar
  );

  /**
   * value - Objeto que será disponibilizado pelo contexto
   * 
   * Usa useMemo para evitar recriação desnecessária do objeto em cada render
   * Contém:
   * - savedMethods: Array com cartões salvos
   * - allMethods: Array com cartões + métodos fixos
   * - Funções: addPaymentMethod, updatePaymentMethod, removePaymentMethod, setDefaultPaymentMethod
   * - defaultMethod: Método padrão computado
   */
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
    [savedMethods, allMethods, defaultMethod] // Recria quando qualquer um destes mudar
  );

  return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
}

/**
 * usePayment - Hook personalizado para acessar o PaymentContext
 * 
 * @returns {Object} Objeto contendo métodos de pagamento e funções CRUD
 * @throws {Error} Se usado fora de um PaymentProvider
 * 
 * Exemplo de uso:
 * const { allMethods, addPaymentMethod, defaultMethod } = usePayment();
 */
export const usePayment = () => {
  const ctx = useContext(PaymentContext);
  if (!ctx) throw new Error('usePayment must be used within PaymentProvider');
  return ctx;
};

// ============================================================================
// HELPER FUNCTIONS - Funções utilitárias para formatação e validação
// ============================================================================

/**
 * formatCardNumber - Formata número do cartão com espaços
 * 
 * @param {string} number - Número do cartão sem formatação
 * @returns {string} Número formatado (XXXX XXXX XXXX XXXX)
 * 
 * Exemplo: "1234567890123456" -> "1234 5678 9012 3456"
 */
export const formatCardNumber = (number) => {
  return number.replace(/(\d{4})(?=\d)/g, '$1 '); // Adiciona espaço a cada 4 dígitos
};

/**
 * getCardBrandIcon - Retorna o nome do ícone Ionicons para cada bandeira
 * 
 * @param {string} brand - Bandeira do cartão (Visa, Mastercard, etc.)
 * @returns {string} Nome do ícone do Ionicons
 * 
 * Por enquanto retorna o mesmo ícone para todas as bandeiras.
 * Pode ser expandido para usar ícones específicos de cada bandeira.
 */
export const getCardBrandIcon = (brand) => {
  const icons = {
    Visa: 'card-outline',
    Mastercard: 'card-outline',
    Elo: 'card-outline',
    'American Express': 'card-outline',
  };
  return icons[brand] || 'card-outline'; // Retorna ícone padrão se não encontrar
};

/**
 * isCardExpired - Verifica se um cartão está vencido
 * 
 * @param {string} month - Mês de validade (01-12)
 * @param {string} year - Ano de validade (YY - dois dígitos)
 * @returns {boolean} true se o cartão está vencido, false caso contrário
 * 
 * Compara a data de validade com a data atual.
 * Considera vencido se já passou do último dia do mês de validade.
 */
export const isCardExpired = (month, year) => {
  const now = new Date();
  const expiry = new Date(parseInt(`20${year}`), parseInt(month) - 1);
  return expiry < now;
};
