// Tela de finalização do pedido: escolha endereço, forma de pagamento e confirme
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart, currency } from '../context/CartContext';
import { useAddress } from '../context/AddressContext';

// Mock de formas de pagamento - posteriormente virá de um contexto
const PAYMENT_METHODS = [
  { id: 'pix', name: 'PIX', icon: 'qr-code-outline', description: 'Pagamento instantâneo' },
  { id: 'credit', name: 'Cartão de Crédito', icon: 'card-outline', description: 'Visa •••• 1234' },
  { id: 'debit', name: 'Cartão de Débito', icon: 'card-outline', description: 'Mastercard •••• 5678' },
  { id: 'money', name: 'Dinheiro', icon: 'cash-outline', description: 'Pagamento na entrega' },
];

const DELIVERY_FEE = 8.00;

export default function CheckoutScreen({ navigation }) {
  const { items, total, clearCart } = useCart();
  const { addresses, defaultAddress } = useAddress();
  const [selectedAddress, setSelectedAddress] = useState(defaultAddress?.id);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [changeFor, setChangeFor] = useState('');
  const [observations, setObservations] = useState('');

  const data = Object.values(items);
  const selectedAddressData = addresses.find(a => a.id === selectedAddress);
  const selectedPaymentData = PAYMENT_METHODS.find(p => p.id === selectedPayment);
  const finalTotal = total + DELIVERY_FEE;

  const handleConfirmOrder = () => {
    if (!selectedAddress) {
      Alert.alert('Endereço obrigatório', 'Selecione um endereço de entrega');
      return;
    }
    if (!selectedPayment) {
      Alert.alert('Forma de pagamento obrigatória', 'Selecione uma forma de pagamento');
      return;
    }

    // Simulação de confirmação do pedido
    Alert.alert(
      'Pedido confirmado! 🎉',
      `Seu pedido no valor de ${currency(finalTotal)} foi confirmado!\n\nTempo estimado: 30-40 min`,
      [
        {
          text: 'OK',
          onPress: () => {
            clearCart();
            navigation.navigate('HomeStack', { screen: 'Home' });
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Endereço de entrega */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location" size={24} color="#1a1309" />
            <Text style={styles.sectionTitle}>Endereço de entrega</Text>
          </View>

          {selectedAddressData ? (
            <TouchableOpacity
              style={styles.card}
              onPress={() => setShowAddressModal(true)}
            >
              <View style={styles.cardContent}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardLabel}>{selectedAddressData.label}</Text>
                  <Text style={styles.cardText}>
                    {selectedAddressData.street}
                    {selectedAddressData.complement ? `, ${selectedAddressData.complement}` : ''}
                  </Text>
                  <Text style={styles.cardText}>
                    {selectedAddressData.neighborhood} - {selectedAddressData.city}/{selectedAddressData.state}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#6b655c" />
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddressModal(true)}
            >
              <Ionicons name="add-circle-outline" size={24} color="#d6a05b" />
              <Text style={styles.addButtonText}>Adicionar endereço</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Forma de pagamento */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="wallet" size={24} color="#1a1309" />
            <Text style={styles.sectionTitle}>Forma de pagamento</Text>
          </View>

          {selectedPaymentData ? (
            <TouchableOpacity
              style={styles.card}
              onPress={() => setShowPaymentModal(true)}
            >
              <View style={styles.cardContent}>
                <Ionicons name={selectedPaymentData.icon} size={24} color="#d6a05b" />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.cardLabel}>{selectedPaymentData.name}</Text>
                  <Text style={styles.cardText}>{selectedPaymentData.description}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#6b655c" />
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowPaymentModal(true)}
            >
              <Ionicons name="add-circle-outline" size={24} color="#d6a05b" />
              <Text style={styles.addButtonText}>Selecionar forma de pagamento</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Resumo do pedido */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="receipt" size={24} color="#1a1309" />
            <Text style={styles.sectionTitle}>Resumo do pedido</Text>
          </View>

          <View style={styles.card}>
            {data.map((entry, index) => (
              <View
                key={entry.item.id}
                style={[styles.itemRow, index > 0 && { marginTop: 8 }]}
              >
                <Text style={styles.itemQty}>{entry.qty}x</Text>
                <Text style={styles.itemName}>{entry.item.name}</Text>
                <Text style={styles.itemPrice}>
                  {currency(entry.qty * entry.item.price)}
                </Text>
              </View>
            ))}

            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>{currency(total)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Taxa de entrega</Text>
              <Text style={styles.totalValue}>{currency(DELIVERY_FEE)}</Text>
            </View>

            <View style={[styles.divider, { marginVertical: 12 }]} />

            <View style={styles.totalRow}>
              <Text style={styles.finalTotalLabel}>TOTAL</Text>
              <Text style={styles.finalTotalValue}>{currency(finalTotal)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Botão fixo de confirmação */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.confirmButton, (!selectedAddress || !selectedPayment) && styles.confirmButtonDisabled]}
          onPress={handleConfirmOrder}
          disabled={!selectedAddress || !selectedPayment}
        >
          <Text style={styles.confirmButtonText}>
            CONFIRMAR PEDIDO • {currency(finalTotal)}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal de seleção de endereço */}
      <Modal
        visible={showAddressModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddressModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecione o endereço</Text>
              <TouchableOpacity onPress={() => setShowAddressModal(false)}>
                <Ionicons name="close" size={28} color="#1a1309" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {addresses.map((address) => (
                <TouchableOpacity
                  key={address.id}
                  style={[
                    styles.modalItem,
                    selectedAddress === address.id && styles.modalItemSelected,
                  ]}
                  onPress={() => {
                    setSelectedAddress(address.id);
                    setShowAddressModal(false);
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.modalItemLabel}>{address.label}</Text>
                    <Text style={styles.modalItemText}>
                      {address.street}, {address.complement}
                    </Text>
                    <Text style={styles.modalItemText}>
                      {address.neighborhood} - {address.city}/{address.state}
                    </Text>
                  </View>
                  {selectedAddress === address.id && (
                    <Ionicons name="checkmark-circle" size={24} color="#d6a05b" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal de seleção de pagamento */}
      <Modal
        visible={showPaymentModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Forma de pagamento</Text>
              <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                <Ionicons name="close" size={28} color="#1a1309" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {PAYMENT_METHODS.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.modalItem,
                    selectedPayment === method.id && styles.modalItemSelected,
                  ]}
                  onPress={() => {
                    setSelectedPayment(method.id);
                    setShowPaymentModal(false);
                  }}
                >
                  <Ionicons name={method.icon} size={24} color="#d6a05b" />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.modalItemLabel}>{method.name}</Text>
                    <Text style={styles.modalItemText}>{method.description}</Text>
                  </View>
                  {selectedPayment === method.id && (
                    <Ionicons name="checkmark-circle" size={24} color="#d6a05b" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2e9dd',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1a1309',
    marginLeft: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1309',
    marginBottom: 4,
  },
  cardText: {
    fontSize: 14,
    color: '#6b655c',
    lineHeight: 20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#d6a05b',
    borderStyle: 'dashed',
  },
  addButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '700',
    color: '#d6a05b',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemQty: {
    width: 40,
    fontSize: 14,
    fontWeight: '700',
    color: '#6b655c',
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    color: '#1a1309',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1309',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#d8cdbf',
    marginVertical: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 14,
    color: '#6b655c',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1309',
  },
  finalTotalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1a1309',
  },
  finalTotalValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1a1309',
  },
  footer: {
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#d8cdbf',
    backgroundColor: '#f2e9dd',
  },
  confirmButton: {
    backgroundColor: '#d6a05b',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#d8cdbf',
    opacity: 0.6,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1a1309',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#f2e9dd',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#d8cdbf',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1a1309',
  },
  modalBody: {
    padding: 16,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  modalItemSelected: {
    borderWidth: 2,
    borderColor: '#d6a05b',
  },
  modalItemLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1309',
    marginBottom: 4,
  },
  modalItemText: {
    fontSize: 14,
    color: '#6b655c',
    lineHeight: 20,
  },
});
