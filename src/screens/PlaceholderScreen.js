// Uma tela simples e honesta para dizer: ainda estamos construindo isso aqui :)
// Mantemos o mesmo visual base do app para não quebrar a experiência.
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PlaceholderScreen({ route }) {
  // Você pode personalizar a mensagem via props/route
  const message = route?.params?.message || 'Em construção';

  return (
    <View style={styles.container}>
      <Ionicons name="construct" size={64} color="#d6a05b" />
      <Text style={styles.title}>{message}</Text>
      <Text style={styles.subtitle}>
        Estamos ajeitando os detalhes desta tela. Volte mais tarde 🙂
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2e9dd',
    padding: 24,
  },
  title: { marginTop: 12, fontSize: 20, fontWeight: '900', color: '#1a1309' },
  subtitle: { marginTop: 6, color: '#6b655c', textAlign: 'center' },
});
