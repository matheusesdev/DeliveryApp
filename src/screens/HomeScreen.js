/**
 * HomeScreen - Tela Principal do Aplicativo
 * 
 * Exibe o catálogo de produtos em destaque organizados em cards.
 * Funcionalidades:
 * - Lista de produtos com imagens, nomes e preços
 * - Navegação para tela de detalhes ao tocar em um produto
 * - Layout responsivo com FlatList
 * 
 * Props:
 * @param {Object} navigation - Objeto de navegação do React Navigation
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * DATA - Produtos mockados para exibição
 * 
 * Em produção, estes dados viriam de uma API.
 * Estrutura de cada produto:
 * - id: Identificador único
 * - name: Nome do produto
 * - price: Preço (number)
 * - size: Tamanho (opcional)
 * - ingredients: Descrição dos ingredientes
 * - image: URL da imagem (Unsplash para demo)
 */

const DATA = [
  {
    id: 'pizza-catupiry',
    name: 'Pizza de frango com catupiry',
    price: 90,
    size: 'G',
    ingredients: 'Mussarela, frango, catupiry, orégano e molho da casa',
    image:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'x-salada',
    name: 'X-Salada Clássico',
    price: 12,
    size: '',
    ingredients: 'Blend especial do chefe, alface, tomate, cheddar e molho da casa',
    image:
      'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1200&auto=format&fit=crop',
  },
];

export default function HomeScreen({ navigation }) {
  /**
   * header - Componente de cabeçalho da lista
   * 
   * Usa useMemo para evitar recriação desnecessária em cada render.
   * Exibe título da seção "Destaques do dia".
   */
  const header = useMemo(
    () => (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Destaques do dia</Text>
      </View>
    ),
    []
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 
        FlatList - Lista otimizada para performance
        - Renderiza apenas itens visíveis na tela
        - Usa keyExtractor para identificar cada item
        - Padding e separadores para melhor visual
      */}
      <FlatList
        data={DATA}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={header}
        contentContainerStyle={{ padding: 16 }}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        renderItem={({ item }) => (
          <>
            {/* 
              Card do Produto - Touchable para navegação
              - activeOpacity 0.9 para feedback visual suave
              - Navega para DetailsScreen passando o item completo
            */}
            <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate('Details', { item })}
            style={styles.card}
          >
            {/* Imagem do produto - proporção 16:9 */}
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            
            <View style={styles.cardBody}>
              {/* Nome do produto em maiúsculas para destaque */}
              <Text style={styles.cardTitle}>{item.name.toUpperCase()}</Text>
              
              <View style={styles.cardFooter}>
                {/* Preço formatado em BRL */}
                <Text style={styles.price}>R$ {item.price.toFixed(2).replace('.', ',')}</Text>
                
                {/* Tamanho (se disponível) */}
                {item.size ? <Text style={styles.size}>({item.size})</Text> : null}
              </View>
            </View>
          </TouchableOpacity>
          </>
        )}
      />
      
      {/* 
        Barra inferior decorativa (não funcional)
        A navegação real vem do TabNavigator em App.js
      */}
      <View style={styles.bottomBar}>
        <Ionicons name="home" size={20} color="#1a1309" />
        <Ionicons name="search" size={20} color="#1a1309" />
        <Ionicons name="basket" size={20} color="#1a1309" />
        <Ionicons name="person" size={20} color="#1a1309" />
      </View>
    </SafeAreaView>
  );
}

/**
 * StyleSheet - Estilos do componente
 * 
 * Paleta de cores:
 * - Background: #f2e9dd (creme)
 * - Primário: #d6a05b (dourado)
 * - Texto: #1a1309 (marrom escuro)
 * - Secundário: #6b655c (cinza acastanhado)
 */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2e9dd' },
  section: {
    backgroundColor: '#d6a05b',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1a1309',
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
  cardImage: { width: '100%', height: 180 },
  cardBody: { padding: 12 },
  cardTitle: { fontSize: 14, color: '#1a1309', fontWeight: '700' },
  cardFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  price: { fontSize: 14, color: '#1a1309', fontWeight: '800' },
  size: { marginLeft: 6, color: '#6b655c' },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 0, // decorativo; a barra real é do TabNavigator
  },
});
