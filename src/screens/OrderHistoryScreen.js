// Tela de histórico de pedidos
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  useOrders,
  formatOrderDate,
  formatOrderTime,
  getStatusLabel,
  getStatusColor,
} from '../context/OrderContext';
import { currency } from '../context/CartContext';

export default function OrderHistoryScreen({ navigation }) {
  const { orders, reorder } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const handleOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleReorder = (order) => {
    Alert.alert(
      'Refazer pedido',
      'Deseja adicionar os mesmos itens ao carrinho?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sim',
          onPress: () => {
            // TODO: Adicionar itens ao carrinho
            Alert.alert('Sucesso', 'Itens adicionados ao carrinho!');
            navigation.navigate('Cart');
          },
        },
      ]
    );
  };

  const renderOrderCard = ({ item: order }) => {
    const statusColor = getStatusColor(order.status);
    const statusLabel = getStatusLabel(order.status);

    return (
      <TouchableOpacity
        style={styles.orderCard}
        onPress={() => handleOrderDetails(order)}
        activeOpacity={0.7}
      >
        {/* Header do pedido */}
        <View style={styles.orderHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.orderId}>Pedido #{order.id}</Text>
            <Text style={styles.orderDate}>
              {formatOrderDate(order.date)} às {formatOrderTime(order.date)}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{statusLabel}</Text>
          </View>
        </View>

        {/* Itens do pedido */}
        <View style={styles.orderItems}>
          {order.items.map((item, index) => (
            <Text key={index} style={styles.itemText} numberOfLines={1}>
              {item.qty}x {item.name}
            </Text>
          ))}
        </View>

        {/* Footer do pedido */}
        <View style={styles.orderFooter}>
          <Text style={styles.orderTotal}>{currency(order.total)}</Text>
          {order.status === 'delivered' && (
            <TouchableOpacity
              style={styles.reorderButton}
              onPress={() => handleReorder(order)}
            >
              <Ionicons name="refresh-outline" size={16} color="#d6a05b" />
              <Text style={styles.reorderText}>Pedir novamente</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrderCard}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={64} color="#d6a05b" />
            <Text style={styles.emptyTitle}>Nenhum pedido ainda</Text>
            <Text style={styles.emptySubtitle}>
              Seus pedidos aparecerão aqui após a finalização
            </Text>
          </View>
        }
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />

      {/* Modal de detalhes do pedido */}
      <Modal
        visible={showDetailsModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDetailsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedOrder && (
              <>
                <View style={styles.modalHeader}>
                  <View>
                    <Text style={styles.modalTitle}>Pedido #{selectedOrder.id}</Text>
                    <Text style={styles.modalSubtitle}>
                      {formatOrderDate(selectedOrder.date)} às {formatOrderTime(selectedOrder.date)}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => setShowDetailsModal(false)}>
                    <Ionicons name="close" size={28} color="#1a1309" />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalBody}>
                  {/* Status */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>STATUS</Text>
                    <View
                      style={[
                        styles.statusBadgeLarge,
                        { backgroundColor: getStatusColor(selectedOrder.status) },
                      ]}
                    >
                      <Text style={styles.statusTextLarge}>
                        {getStatusLabel(selectedOrder.status)}
                      </Text>
                    </View>
                  </View>

                  {/* Itens do pedido */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>ITENS DO PEDIDO</Text>
                    <View style={styles.detailsCard}>
                      {selectedOrder.items.map((item, index) => (
                        <View
                          key={index}
                          style={[styles.itemRow, index > 0 && { marginTop: 12 }]}
                        >
                          <Text style={styles.itemQty}>{item.qty}x</Text>
                          <Text style={styles.itemName}>{item.name}</Text>
                          <Text style={styles.itemPrice}>
                            {currency(item.qty * item.price)}
                          </Text>
                        </View>
                      ))}

                      <View style={styles.divider} />

                      <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Subtotal</Text>
                        <Text style={styles.totalValue}>
                          {currency(selectedOrder.subtotal)}
                        </Text>
                      </View>
                      <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Taxa de entrega</Text>
                        <Text style={styles.totalValue}>
                          {currency(selectedOrder.deliveryFee)}
                        </Text>
                      </View>

                      <View style={[styles.divider, { marginVertical: 12 }]} />

                      <View style={styles.totalRow}>
                        <Text style={styles.finalTotalLabel}>TOTAL</Text>
                        <Text style={styles.finalTotalValue}>
                          {currency(selectedOrder.total)}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Endereço de entrega */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>ENDEREÇO DE ENTREGA</Text>
                    <View style={styles.detailsCard}>
                      <Text style={styles.addressLabel}>
                        {selectedOrder.address.label}
                      </Text>
                      <Text style={styles.addressText}>
                        {selectedOrder.address.street}
                        {selectedOrder.address.complement
                          ? `, ${selectedOrder.address.complement}`
                          : ''}
                      </Text>
                      <Text style={styles.addressText}>
                        {selectedOrder.address.neighborhood} -{' '}
                        {selectedOrder.address.city}/{selectedOrder.address.state}
                      </Text>
                    </View>
                  </View>

                  {/* Forma de pagamento */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>PAGAMENTO</Text>
                    <View style={styles.detailsCard}>
                      <Text style={styles.paymentText}>{selectedOrder.payment.name}</Text>
                    </View>
                  </View>

                  {/* Botão de refazer pedido */}
                  {selectedOrder.status === 'delivered' && (
                    <TouchableOpacity
                      style={styles.reorderButtonLarge}
                      onPress={() => {
                        setShowDetailsModal(false);
                        handleReorder(selectedOrder);
                      }}
                    >
                      <Ionicons name="refresh-outline" size={20} color="#1a1309" />
                      <Text style={styles.reorderButtonText}>PEDIR NOVAMENTE</Text>
                    </TouchableOpacity>
                  )}
                </ScrollView>
              </>
            )}
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
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1a1309',
  },
  orderDate: {
    fontSize: 12,
    color: '#6b655c',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
    textTransform: 'uppercase',
  },
  orderItems: {
    marginBottom: 12,
  },
  itemText: {
    fontSize: 14,
    color: '#6b655c',
    marginBottom: 4,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#d8cdbf',
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1a1309',
  },
  reorderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#f2e9dd',
  },
  reorderText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '700',
    color: '#d6a05b',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#f2e9dd',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#d8cdbf',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1a1309',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6b655c',
    marginTop: 4,
  },
  modalBody: {
    padding: 20,
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
  statusBadgeLarge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  statusTextLarge: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    textTransform: 'uppercase',
  },
  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
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
  addressLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1309',
    marginBottom: 8,
  },
  addressText: {
    fontSize: 14,
    color: '#6b655c',
    lineHeight: 20,
  },
  paymentText: {
    fontSize: 14,
    color: '#1a1309',
    fontWeight: '600',
  },
  reorderButtonLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d6a05b',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  reorderButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '900',
    color: '#1a1309',
  },
});
