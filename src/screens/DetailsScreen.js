import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useCart, currency } from '../context/CartContext';

export default function DetailsScreen({ route, navigation }) {
  const { item } = route.params;
  const { addItem } = useCart();

  const onAdd = () => {
    addItem(item);
    // feedback rápido
    navigation.navigate('Home');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
      <Image source={{ uri: item.image }} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.title}>{item.name.toUpperCase()}</Text>
        <Text style={styles.price}>{currency(item.price)}</Text>

        <Text style={styles.section}>Ingredientes</Text>
        <Text style={styles.ingredients}>{item.ingredients}</Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={onAdd}>
          <Text style={styles.buttonText}>ADICIONAR AO PEDIDO</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2e9dd' },
  image: { width: '100%', height: 260 },
  content: { padding: 16 },
  title: { fontSize: 18, fontWeight: '800', color: '#1a1309', marginBottom: 6 },
  price: { fontSize: 16, fontWeight: '800', color: '#1a1309', marginBottom: 12 },
  section: { fontSize: 12, color: '#6b655c', marginBottom: 4, fontWeight: '700' },
  ingredients: { fontSize: 14, color: '#1a1309', lineHeight: 20 },
  footer: { paddingHorizontal: 16, paddingTop: 4 },
  button: {
    backgroundColor: '#d6a05b',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#1a1309', fontWeight: '800' },
});
