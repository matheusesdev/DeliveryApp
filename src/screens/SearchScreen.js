// Tela de busca: pesquise qualquer item do cardápio em tempo real
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Mock de dados - em produção viria de uma API
const ALL_ITEMS = [
  {
    id: 'pizza-catupiry',
    name: 'Pizza de frango com catupiry',
    price: 90,
    size: 'G',
    category: 'Pizza',
    ingredients: 'Mussarela, frango, catupiry, orégano e molho da casa',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'x-salada',
    name: 'X-Salada Clássico',
    price: 12,
    size: '',
    category: 'Hambúrguer',
    ingredients: 'Blend especial do chefe, alface, tomate, cheddar e molho da casa',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'pizza-calabresa',
    name: 'Pizza de calabresa',
    price: 85,
    size: 'G',
    category: 'Pizza',
    ingredients: 'Mussarela, calabresa, cebola, azeitonas e orégano',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'x-bacon',
    name: 'X-Bacon Supreme',
    price: 15,
    size: '',
    category: 'Hambúrguer',
    ingredients: 'Blend da casa, bacon crocante, cheddar, cebola roxa e molho especial',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'pizza-margherita',
    name: 'Pizza Margherita',
    price: 75,
    size: 'G',
    category: 'Pizza',
    ingredients: 'Molho de tomate, mussarela de búfala, manjericão fresco e azeite',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'refrigerante',
    name: 'Refrigerante Lata',
    price: 5,
    size: '350ml',
    category: 'Bebida',
    ingredients: 'Coca-Cola, Guaraná ou Fanta',
    image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'suco-natural',
    name: 'Suco Natural',
    price: 8,
    size: '500ml',
    category: 'Bebida',
    ingredients: 'Laranja, limão, maracujá ou acerola',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?q=80&w=1200&auto=format&fit=crop',
  },
];

export default function SearchScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filtragem em tempo real baseada no nome ou categoria
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return ALL_ITEMS;
    
    const query = searchQuery.toLowerCase();
    return ALL_ITEMS.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.ingredients.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Barra de busca fixa no topo */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#6b655c" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar pizza, hambúrguer, bebida..."
          placeholderTextColor="#6b655c"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#6b655c" />
          </TouchableOpacity>
        )}
      </View>

      {/* Lista de resultados */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={64} color="#d6a05b" />
            <Text style={styles.emptyTitle}>Nenhum resultado encontrado</Text>
            <Text style={styles.emptySubtitle}>
              Tente buscar por outro termo ou categoria
            </Text>
          </View>
        }
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate('HomeStack', { 
              screen: 'Details', 
              params: { item } 
            })}
            style={styles.card}
          >
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <View style={styles.cardBody}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{item.category}</Text>
              </View>
              <Text style={styles.cardTitle}>{item.name.toUpperCase()}</Text>
              <Text style={styles.ingredients} numberOfLines={2}>
                {item.ingredients}
              </Text>
              <View style={styles.cardFooter}>
                <Text style={styles.price}>R$ {item.price.toFixed(2).replace('.', ',')}</Text>
                {item.size ? <Text style={styles.size}>({item.size})</Text> : null}
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f2e9dd' 
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 12,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#1a1309',
  },
  clearButton: {
    padding: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardImage: { 
    width: '100%', 
    height: 160 
  },
  cardBody: { 
    padding: 12 
  },
  categoryBadge: {
    backgroundColor: '#d6a05b',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1a1309',
    textTransform: 'uppercase',
  },
  cardTitle: { 
    fontSize: 14, 
    color: '#1a1309', 
    fontWeight: '700',
    marginBottom: 4,
  },
  ingredients: {
    fontSize: 12,
    color: '#6b655c',
    marginBottom: 8,
    lineHeight: 16,
  },
  cardFooter: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 4 
  },
  price: { 
    fontSize: 16, 
    color: '#1a1309', 
    fontWeight: '800' 
  },
  size: { 
    marginLeft: 6, 
    color: '#6b655c',
    fontSize: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '800',
    color: '#1a1309',
  },
  emptySubtitle: {
    marginTop: 8,
    fontSize: 14,
    color: '#6b655c',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
