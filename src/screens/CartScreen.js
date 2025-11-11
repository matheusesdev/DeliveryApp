// O carrinho é o lugar onde a pessoa confere tudo antes de finalizar.
// Mantemos tudo à vista: título, quantidade, subtotal e total.
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useCart, currency } from '../context/CartContext';

export default function CartScreen({ navigation }) {
  const { items, increment, decrement, removeItem, total } = useCart();
  // Transformamos o dicionário em lista para o FlatList.
  const data = Object.values(items);

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(e) => e.item.id}
        contentContainerStyle={{ padding: 16 }}
  ListEmptyComponent={<Text style={styles.empty}>Seu carrinho está vazio.</Text>}
        renderItem={({ item: entry }) => (
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{entry.item.name}</Text>
              <Text style={styles.muted}>{currency(entry.item.price)} un.</Text>
            </View>
            <View style={styles.qtyBox}>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => decrement(entry.item.id)}>
                <Text style={styles.qtyBtnText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.qty}>{entry.qty}</Text>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => increment(entry.item.id)}>
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>
            <View style={{ width: 90, alignItems: 'flex-end' }}>
              <Text style={styles.subtotal}>{currency(entry.qty * entry.item.price)}</Text>
              <TouchableOpacity onPress={() => removeItem(entry.item.id)}>
                <Text style={styles.remove}>remover</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>TOTAL</Text>
          <Text style={styles.total}>{currency(total)}</Text>
        </View>
        <TouchableOpacity 
          style={styles.checkout} 
          disabled={total === 0}
          onPress={() => navigation.navigate('Checkout')}
        >
          <Text style={styles.checkoutText}>FINALIZAR PEDIDO</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2e9dd' },
  empty: { textAlign: 'center', color: '#6b655c', marginTop: 48 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  title: { fontWeight: '700', color: '#1a1309' },
  muted: { color: '#6b655c', fontSize: 12 },
  qtyBox: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#d6a05b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: { color: '#1a1309', fontWeight: '900' },
  qty: { width: 28, textAlign: 'center', fontWeight: '700', color: '#1a1309' },
  subtotal: { fontWeight: '700', color: '#1a1309' },
  remove: { color: '#b84c4c', fontSize: 12, marginTop: 2 },
  summary: {
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#d8cdbf',
    backgroundColor: '#f2e9dd',
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  totalLabel: { color: '#6b655c', fontWeight: '700' },
  total: { fontWeight: '900', color: '#1a1309' },
  checkout: {
    backgroundColor: '#d6a05b',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    opacity: 1,
  },
  checkoutText: { color: '#1a1309', fontWeight: '900' },
});
