import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './src/screens/HomeScreen';
import DetailsScreen from './src/screens/DetailsScreen';
import CartScreen from './src/screens/CartScreen';
import { CartProvider, useCart } from './src/context/CartContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

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
      <Tab.Screen name="Cart" component={CartScreen} options={{ title: `Pedido${count ? ` (${count})` : ''}` }} />
      {/* Telas "decorativas" para compor a barra, podem ser implementadas depois */}
      <Tab.Screen name="Search" component={HomeScreen} options={{ title: 'Buscar' }} />
      <Tab.Screen name="Profile" component={HomeScreen} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <CartProvider>
      <NavigationContainer theme={theme}>
        <StatusBar barStyle="dark-content" />
        <TabNavigator />
      </NavigationContainer>
    </CartProvider>
  );
}
