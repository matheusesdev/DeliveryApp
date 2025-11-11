// Import obrigatório do gesture-handler: ele deve vir ANTES de qualquer outra importação.
// Sem isso, a navegação pode quebrar ou dar erro estranho no Android.
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// Telas principais do app
import HomeScreen from './src/screens/HomeScreen';
import DetailsScreen from './src/screens/DetailsScreen';
import CartScreen from './src/screens/CartScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import SearchScreen from './src/screens/SearchScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AddressesScreen from './src/screens/AddressesScreen';
import OrderHistoryScreen from './src/screens/OrderHistoryScreen';
import PaymentMethodsScreen from './src/screens/PaymentMethodsScreen';
import { CartProvider, useCart } from './src/context/CartContext';
import { AddressProvider } from './src/context/AddressContext';
import { OrderProvider } from './src/context/OrderContext';
import { PaymentProvider } from './src/context/PaymentContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Um toque de identidade visual: mesmo fundo em todas as telas
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#f2e9dd',
  },
};

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

function TabNavigator() {
  const { count } = useCart();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#1a1309',
        tabBarInactiveTintColor: '#6b655c',
        tabBarStyle: { backgroundColor: '#d6a05b', height: 60, paddingBottom: 8 },
        tabBarIcon: ({ color, size, focused }) => {
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
      <Tab.Screen name="HomeStack" component={HomeStack} options={{ title: 'Home' }} />
      {/* A aba do carrinho mostra o total de itens para dar feedback imediato */}
      <Tab.Screen name="Cart" component={CartStack} options={{ title: `Pedido${count ? ` (${count})` : ''}` }} />
      {/* Telas de busca e perfil agora implementadas */}
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{ title: 'Buscar' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{ title: 'Perfil' }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AddressProvider>
        <OrderProvider>
          <PaymentProvider>
            <NavigationContainer theme={theme}>
              {/* Preferimos status bar escura aqui porque a maioria dos headers é clara */}
              <StatusBar barStyle="dark-content" />
              <TabNavigator />
            </NavigationContainer>
          </PaymentProvider>
        </OrderProvider>
      </AddressProvider>
    </CartProvider>
  );
}
