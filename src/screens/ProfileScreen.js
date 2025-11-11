// Tela de perfil: dados do usuário, preferências e configurações
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen({ navigation }) {
  // Estados para as configurações
  const [notifications, setNotifications] = useState(true);
  const [promotions, setPromotions] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Mock de dados do usuário
  const userData = {
    name: 'Matheus Espírito Santo',
    email: 'matheus@example.com',
    phone: '(11) 99999-9999',
    address: 'Rua Exemplo, 123 - São Paulo, SP',
  };

  const handleEditProfile = () => {
    Alert.alert('Editar Perfil', 'Funcionalidade em desenvolvimento');
  };

  const handleOrderHistory = () => {
    navigation.navigate('OrderHistory');
  };

  const handlePaymentMethods = () => {
    Alert.alert('Formas de Pagamento', 'Funcionalidade em desenvolvimento');
  };

  const handleAddresses = () => {
    navigation.navigate('Addresses');
  };

  const handleSupport = () => {
    Alert.alert('Suporte', 'Entre em contato pelo WhatsApp: (11) 99999-9999');
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Header do perfil */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={48} color="#1a1309" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userData.name}</Text>
            <Text style={styles.profileEmail}>{userData.email}</Text>
          </View>
          <TouchableOpacity onPress={handleEditProfile} style={styles.editButton}>
            <Ionicons name="pencil" size={20} color="#1a1309" />
          </TouchableOpacity>
        </View>

        {/* Informações pessoais */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INFORMAÇÕES PESSOAIS</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={20} color="#6b655c" />
              <Text style={styles.infoText}>{userData.phone}</Text>
            </View>
            
            <View style={[styles.infoRow, { marginTop: 12 }]}>
              <Ionicons name="location-outline" size={20} color="#6b655c" />
              <Text style={styles.infoText}>{userData.address}</Text>
            </View>
          </View>
        </View>

        {/* Opções do menu */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MINHA CONTA</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={handleOrderHistory}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="time-outline" size={24} color="#1a1309" />
              <Text style={styles.menuItemText}>Histórico de pedidos</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6b655c" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handlePaymentMethods}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="card-outline" size={24} color="#1a1309" />
              <Text style={styles.menuItemText}>Formas de pagamento</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6b655c" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleAddresses}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="home-outline" size={24} color="#1a1309" />
              <Text style={styles.menuItemText}>Meus endereços</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6b655c" />
          </TouchableOpacity>
        </View>

        {/* Configurações */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CONFIGURAÇÕES</Text>
          
          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="notifications-outline" size={24} color="#1a1309" />
              <Text style={styles.menuItemText}>Notificações</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#d8cdbf', true: '#d6a05b' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="pricetag-outline" size={24} color="#1a1309" />
              <Text style={styles.menuItemText}>Promoções</Text>
            </View>
            <Switch
              value={promotions}
              onValueChange={setPromotions}
              trackColor={{ false: '#d8cdbf', true: '#d6a05b' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="moon-outline" size={24} color="#1a1309" />
              <Text style={styles.menuItemText}>Modo escuro</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#d8cdbf', true: '#d6a05b' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Suporte e Sair */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.menuItem} onPress={handleSupport}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="help-circle-outline" size={24} color="#1a1309" />
              <Text style={styles.menuItemText}>Suporte</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6b655c" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItemDanger} onPress={handleLogout}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="log-out-outline" size={24} color="#b84c4c" />
              <Text style={[styles.menuItemText, { color: '#b84c4c' }]}>Sair da conta</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Versão do app */}
        <Text style={styles.version}>Versão 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2e9dd',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#d6a05b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1a1309',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#6b655c',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f2e9dd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6b655c',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#1a1309',
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  menuItemDanger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#1a1309',
    fontWeight: '600',
  },
  version: {
    textAlign: 'center',
    color: '#6b655c',
    fontSize: 12,
    marginTop: 8,
    marginBottom: 24,
  },
});
