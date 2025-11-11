/**
 * App.js - Componente Principal do DeliveryApp
 * 
 * Este é o ponto de entrada da aplicação. Responsável por:
 * - Configurar a navegação (Tabs + Stacks aninhadas)
 * - Prover os contextos globais (Cart, Address, Order, Payment)
 * - Definir o tema visual do aplicativo
 * - Configurar a StatusBar
 * 
 * Estrutura de Navegação:
 * - TabNavigator (navegação inferior com 4 abas)
 *   ├── HomeStack (Home, Details)
 *   ├── CartStack (Cart, Checkout)
 *   ├── SearchScreen
 *   └── ProfileStack (Profile, Addresses, OrderHistory, PaymentMethods)
 */

/**
 * IMPORTANTE: gesture-handler deve ser importado PRIMEIRO
 * 
 * Este import deve vir antes de qualquer outra importação do React Native.
 * É necessário para o funcionamento correto da navegação, especialmente no Android.
 * Sem ele, pode ocorrer erro: "The 'navigation' object hasn't been initialized yet"
 */
import 'react-native-gesture-handler';

import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// ============================================================================
// IMPORTS DE TELAS
// ============================================================================
// ============================================================================
// IMPORTS DE TELAS
// ============================================================================

import HomeScreen from './src/screens/HomeScreen';           // Catálogo de produtos
import DetailsScreen from './src/screens/DetailsScreen';     // Detalhes do produto
import CartScreen from './src/screens/CartScreen';           // Carrinho de compras
import CheckoutScreen from './src/screens/CheckoutScreen';   // Finalização do pedido
import SearchScreen from './src/screens/SearchScreen';       // Busca de produtos
import ProfileScreen from './src/screens/ProfileScreen';     // Perfil do usuário
import AddressesScreen from './src/screens/AddressesScreen'; // Gerenciamento de endereços
import OrderHistoryScreen from './src/screens/OrderHistoryScreen'; // Histórico de pedidos
import PaymentMethodsScreen from './src/screens/PaymentMethodsScreen'; // Formas de pagamento

// ============================================================================
// IMPORTS DE CONTEXTOS
// ============================================================================

import { CartProvider, useCart } from './src/context/CartContext';     // Carrinho
import { AddressProvider } from './src/context/AddressContext';         // Endereços
import { OrderProvider } from './src/context/OrderContext';             // Pedidos
import { PaymentProvider } from './src/context/PaymentContext';         // Pagamentos

// ============================================================================
// CRIAÇÃO DOS NAVEGADORES
// ============================================================================

/**
 * Tab - Navegador de abas inferiores
 * Permite navegação entre as seções principais: Home, Carrinho, Busca, Perfil
 */
const Tab = createBottomTabNavigator();

/**
 * Stack - Navegador de pilha
 * Permite navegação hierárquica dentro de cada aba (push/pop de telas)
 */
const Stack = createNativeStackNavigator();

// ============================================================================
// TEMA PERSONALIZADO
// ============================================================================

/**
 * theme - Configuração visual global do aplicativo
 * 
 * Sobrescreve o tema padrão do React Navigation para manter
 * consistência visual em todas as telas.
 * 
 * Cor de fundo: #f2e9dd (creme/bege claro)
 */
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#f2e9dd', // Fundo creme em todas as telas
  },
};

// ============================================================================
// STACKS DE NAVEGAÇÃO
// ============================================================================

/**
 * HomeStack - Stack de navegação da aba Home
 * 
 * Contém:
 * - HomeScreen: Tela inicial com catálogo de produtos
 * - DetailsScreen: Detalhes de um produto específico
 * 
 * Configuração visual:
 * - Header dourado (#d6a05b) com texto escuro (#1a1309)
 * - Fonte em negrito (800) e tamanho 24
 */
function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#d6a05b' },
        headerTitleStyle: { color: '#1a1309', fontWeight: '800', fontSize: 24 },
        headerTintColor: '#1a1309',
        contentStyle: { backgroundColor: '#f2e9dd' },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Delivery' }} />
      <Stack.Screen name="Details" component={DetailsScreen} options={{ title: 'Detalhes' }} />
    </Stack.Navigator>
  );
}

/**
 * CartStack - Stack de navegação da aba Carrinho
 * 
 * Contém:
 * - CartScreen: Visualização do carrinho de compras
 * - CheckoutScreen: Finalização do pedido com endereço e pagamento
 * 
 * Mesma configuração visual do HomeStack para manter consistência
 */
function CartStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#d6a05b' },
        headerTitleStyle: { color: '#1a1309', fontWeight: '800', fontSize: 24 },
        headerTintColor: '#1a1309',
        contentStyle: { backgroundColor: '#f2e9dd' },
      }}
    >
      <Stack.Screen name="CartMain" component={CartScreen} options={{ title: 'Pedido' }} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Finalizar Pedido' }} />
    </Stack.Navigator>
  );
}

/**
 * ProfileStack - Stack de navegação da aba Perfil
 * 
 * Contém:
 * - ProfileScreen: Dashboard do perfil do usuário
 * - AddressesScreen: Gerenciamento de endereços (CRUD completo)
 * - OrderHistoryScreen: Histórico de pedidos com status
 * - PaymentMethodsScreen: Gerenciamento de formas de pagamento
 * 
 * Este é o stack mais completo, com 4 telas diferentes
 */
function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#d6a05b' },
        headerTitleStyle: { color: '#1a1309', fontWeight: '800', fontSize: 24 },
        headerTintColor: '#1a1309',
        contentStyle: { backgroundColor: '#f2e9dd' },
      }}
    >
      <Stack.Screen name="ProfileMain" component={ProfileScreen} options={{ title: 'Perfil' }} />
      <Stack.Screen name="Addresses" component={AddressesScreen} options={{ title: 'Meus Endereços' }} />
      <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} options={{ title: 'Histórico de Pedidos' }} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} options={{ title: 'Formas de Pagamento' }} />
    </Stack.Navigator>
  );
}

// ============================================================================
// NAVEGADOR DE ABAS (TAB NAVIGATOR)
// ============================================================================

/**
 * TabNavigator - Navegador principal com 4 abas inferiores
 * 
 * Estrutura:
 * 1. Home (aba inicial) - Catálogo e detalhes
 * 2. Carrinho - Carrinho e checkout
 * 3. Busca - Busca de produtos
 * 4. Perfil - Perfil e configurações
 * 
 * Badge no Carrinho:
 * - Usa useCart() para obter a contagem de itens
 * - Exibe número de itens no badge da aba
 * 
 * Ícones:
 * - home-outline / home (preenchido quando ativo)
 * - cart-outline / cart
 * - search-outline / search
 * - person-outline / person
 */
function TabNavigator() {
  // Obtém a contagem de itens no carrinho para exibir no badge
  const { count } = useCart();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // Headers são mostrados pelos Stacks internos
        tabBarActiveTintColor: '#1a1309',     // Cor do ícone/texto quando ativo
        tabBarInactiveTintColor: '#6b655c',  // Cor do ícone/texto quando inativo
        tabBarStyle: { 
          backgroundColor: '#d6a05b',  // Fundo dourado da barra de abas
          height: 60,                  // Altura da barra
          paddingBottom: 8             // Espaçamento inferior
        },
        
        /**
         * tabBarIcon - Define o ícone de cada aba
         * 
         * @param {Object} params
         * @param {string} params.color - Cor do ícone (ativo/inativo)
         * @param {number} params.size - Tamanho do ícone
         * @param {boolean} params.focused - Se a aba está ativa
         */
        tabBarIcon: ({ color, size, focused }) => {
          // Mapeamento de ícones: outline quando inativo, preenchido quando ativo
          const map = {
            HomeStack: focused ? 'home' : 'home-outline',
            Cart: focused ? 'basket' : 'basket-outline',
            Search: focused ? 'search' : 'search-outline',
            Profile: focused ? 'person' : 'person-outline',
          };
          const name = map[route.name] || 'ellipse-outline';
          return <Ionicons name={name} size={size} color={color} />;
        },
      })}
    >
      {/* Aba 1: Home - Stack com catálogo e detalhes */}
      <Tab.Screen 
        name="HomeStack" 
        component={HomeStack} 
        options={{ title: 'Home' }} 
      />
      
      {/* Aba 2: Carrinho - Mostra número de itens no título para feedback visual */}
      <Tab.Screen 
        name="Cart" 
        component={CartStack} 
        options={{ 
          title: `Pedido${count ? ` (${count})` : ''}`, // "Pedido" ou "Pedido (3)"
          tabBarBadge: count > 0 ? count : undefined,   // Badge numérico no ícone
        }} 
      />
      
      {/* Aba 3: Busca - Tela única de busca de produtos */}
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{ title: 'Buscar' }}
      />
      
      {/* Aba 4: Perfil - Stack com perfil, endereços, histórico e pagamentos */}
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{ title: 'Perfil' }}
      />
    </Tab.Navigator>
  );
}

// ============================================================================
// COMPONENTE PRINCIPAL (ROOT)
// ============================================================================

/**
 * App - Componente raiz da aplicação
 * 
 * Responsabilidades:
 * 1. Prover contextos globais (Providers aninhados)
 * 2. Configurar NavigationContainer com tema personalizado
 * 3. Configurar StatusBar
 * 
 * Ordem dos Providers (de fora para dentro):
 * CartProvider → AddressProvider → OrderProvider → PaymentProvider
 * 
 * Qualquer componente filho pode acessar todos os contextos via hooks:
 * - useCart()
 * - useAddress()
 * - useOrders()
 * - usePayment()
 */
export default function App() {
  return (
    // Provider do carrinho - gerencia itens, quantidades e total
    <CartProvider>
      {/* Provider de endereços - gerencia endereços de entrega */}
      <AddressProvider>
        {/* Provider de pedidos - gerencia histórico e status */}
        <OrderProvider>
          {/* Provider de pagamentos - gerencia cartões e métodos */}
          <PaymentProvider>
            {/* Container de navegação com tema personalizado */}
            <NavigationContainer theme={theme}>
              {/* 
                StatusBar configurada para "dark-content"
                Texto escuro funciona bem com nossos headers dourados (#d6a05b)
              */}
              <StatusBar barStyle="dark-content" />
              
              {/* Navegador principal de abas */}
              <TabNavigator />
            </NavigationContainer>
          </PaymentProvider>
        </OrderProvider>
      </AddressProvider>
    </CartProvider>
  );
}
