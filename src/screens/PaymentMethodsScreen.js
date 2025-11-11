// Tela de gerenciamento de formas de pagamento
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePayment, formatCardNumber, isCardExpired } from '../context/PaymentContext';

export default function PaymentMethodsScreen({ navigation }) {
  const {
    savedMethods,
    allMethods,
    addPaymentMethod,
    updatePaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod,
  } = usePayment();

  const [showModal, setShowModal] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);
  const [formData, setFormData] = useState({
    type: 'credit',
    cardNumber: '',
    holderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });

  const openAddModal = () => {
    setEditingMethod(null);
    setFormData({
      type: 'credit',
      cardNumber: '',
      holderName: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
    });
    setShowModal(true);
  };

  const openEditModal = (method) => {
    setEditingMethod(method);
    setFormData({
      type: method.type,
      cardNumber: `****${method.lastDigits}`,
      holderName: method.holderName,
      expiryMonth: method.expiryMonth,
      expiryYear: method.expiryYear,
      cvv: '',
    });
    setShowModal(true);
  };

  const detectCardBrand = (number) => {
    const cleaned = number.replace(/\s/g, '');
    if (cleaned.startsWith('4')) return 'Visa';
    if (cleaned.startsWith('5')) return 'Mastercard';
    if (cleaned.startsWith('3')) return 'American Express';
    if (cleaned.startsWith('6')) return 'Elo';
    return 'Outros';
  };

  const handleSave = () => {
    // Validação básica
    if (!formData.holderName.trim()) {
      Alert.alert('Campo obrigatório', 'Digite o nome do titular');
      return;
    }

    if (!editingMethod) {
      // Validação para novo cartão
      const cleanedNumber = formData.cardNumber.replace(/\s/g, '');
      if (cleanedNumber.length < 13 || cleanedNumber.length > 19) {
        Alert.alert('Cartão inválido', 'Digite um número de cartão válido');
        return;
      }

      if (!formData.expiryMonth || !formData.expiryYear) {
        Alert.alert('Data inválida', 'Digite a data de validade');
        return;
      }

      if (isCardExpired(formData.expiryMonth, formData.expiryYear)) {
        Alert.alert('Cartão expirado', 'Este cartão está vencido');
        return;
      }

      if (!formData.cvv || formData.cvv.length < 3) {
        Alert.alert('CVV inválido', 'Digite o código de segurança');
        return;
      }

      const brand = detectCardBrand(cleanedNumber);
      const lastDigits = cleanedNumber.slice(-4);

      const newMethod = {
        type: formData.type,
        name: `Cartão de ${formData.type === 'credit' ? 'Crédito' : 'Débito'}`,
        brand,
        lastDigits,
        holderName: formData.holderName.toUpperCase(),
        expiryMonth: formData.expiryMonth,
        expiryYear: formData.expiryYear,
      };

      addPaymentMethod(newMethod);
      Alert.alert('Sucesso', 'Cartão adicionado!');
    } else {
      // Atualizar método existente
      updatePaymentMethod(editingMethod.id, {
        holderName: formData.holderName.toUpperCase(),
      });
      Alert.alert('Sucesso', 'Cartão atualizado!');
    }

    setShowModal(false);
  };

  const handleDelete = (id, name) => {
    Alert.alert('Remover cartão', `Deseja remover "${name}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: () => {
          removePaymentMethod(id);
        },
      },
    ]);
  };

  const renderFixedMethod = (method) => (
    <View key={method.id} style={styles.methodCard}>
      <View style={styles.methodHeader}>
        <View style={styles.iconContainer}>
          <Ionicons name={method.icon} size={24} color="#d6a05b" />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.methodName}>{method.name}</Text>
          <Text style={styles.methodDescription}>{method.description}</Text>
        </View>
      </View>
    </View>
  );

  const renderSavedMethod = (method) => {
    const expired = isCardExpired(method.expiryMonth, method.expiryYear);

    return (
      <View key={method.id} style={styles.methodCard}>
        <View style={styles.methodHeader}>
          <View style={styles.iconContainer}>
            <Ionicons name="card" size={24} color="#d6a05b" />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <View style={styles.labelRow}>
              <Text style={styles.methodName}>{method.brand}</Text>
              {method.isDefault && (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultText}>PADRÃO</Text>
                </View>
              )}
              {expired && (
                <View style={[styles.defaultBadge, { backgroundColor: '#ef4444' }]}>
                  <Text style={styles.defaultText}>EXPIRADO</Text>
                </View>
              )}
            </View>
            <Text style={styles.cardNumber}>•••• {method.lastDigits}</Text>
            <Text style={styles.cardHolder}>{method.holderName}</Text>
            <Text style={styles.cardExpiry}>
              Validade: {method.expiryMonth}/{method.expiryYear}
            </Text>
          </View>
        </View>

        <View style={styles.methodActions}>
          {!method.isDefault && !expired && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setDefaultPaymentMethod(method.id)}
            >
              <Ionicons name="star-outline" size={20} color="#d6a05b" />
              <Text style={styles.actionText}>Definir como padrão</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => openEditModal(method)}
          >
            <Ionicons name="pencil-outline" size={20} color="#6b655c" />
            <Text style={styles.actionText}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDelete(method.id, `${method.brand} •••• ${method.lastDigits}`)}
          >
            <Ionicons name="trash-outline" size={20} color="#b84c4c" />
            <Text style={[styles.actionText, { color: '#b84c4c' }]}>Remover</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Cartões salvos */}
        {savedMethods.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>MEUS CARTÕES</Text>
            {savedMethods.map(renderSavedMethod)}
          </View>
        )}

        {/* Métodos fixos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>OUTRAS OPÇÕES</Text>
          {allMethods.filter((m) => m.isFixed).map(renderFixedMethod)}
        </View>

        {savedMethods.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="card-outline" size={64} color="#d6a05b" />
            <Text style={styles.emptyTitle}>Nenhum cartão cadastrado</Text>
            <Text style={styles.emptySubtitle}>
              Adicione um cartão para facilitar seus pagamentos
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Botão flutuante de adicionar */}
      <TouchableOpacity style={styles.fab} onPress={openAddModal}>
        <Ionicons name="add" size={28} color="#1a1309" />
      </TouchableOpacity>

      {/* Modal de adicionar/editar */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingMethod ? 'Editar cartão' : 'Adicionar cartão'}
              </Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={28} color="#1a1309" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {!editingMethod && (
                <>
                  <Text style={styles.inputLabel}>Tipo de cartão</Text>
                  <View style={styles.typeSelector}>
                    <TouchableOpacity
                      style={[
                        styles.typeButton,
                        formData.type === 'credit' && styles.typeButtonActive,
                      ]}
                      onPress={() => setFormData({ ...formData, type: 'credit' })}
                    >
                      <Text
                        style={[
                          styles.typeButtonText,
                          formData.type === 'credit' && styles.typeButtonTextActive,
                        ]}
                      >
                        Crédito
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.typeButton,
                        formData.type === 'debit' && styles.typeButtonActive,
                      ]}
                      onPress={() => setFormData({ ...formData, type: 'debit' })}
                    >
                      <Text
                        style={[
                          styles.typeButtonText,
                          formData.type === 'debit' && styles.typeButtonTextActive,
                        ]}
                      >
                        Débito
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.inputLabel}>Número do cartão *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0000 0000 0000 0000"
                    value={formData.cardNumber}
                    onChangeText={(text) => {
                      const cleaned = text.replace(/\D/g, '');
                      const formatted = formatCardNumber(cleaned);
                      setFormData({ ...formData, cardNumber: formatted });
                    }}
                    keyboardType="numeric"
                    maxLength={19}
                  />
                </>
              )}

              <Text style={styles.inputLabel}>Nome do titular *</Text>
              <TextInput
                style={styles.input}
                placeholder="Como impresso no cartão"
                value={formData.holderName}
                onChangeText={(text) =>
                  setFormData({ ...formData, holderName: text.toUpperCase() })
                }
                autoCapitalize="characters"
              />

              {!editingMethod && (
                <>
                  <View style={styles.row}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                      <Text style={styles.inputLabel}>Validade *</Text>
                      <View style={styles.row}>
                        <TextInput
                          style={[styles.input, { flex: 1, marginRight: 8 }]}
                          placeholder="MM"
                          value={formData.expiryMonth}
                          onChangeText={(text) => {
                            const cleaned = text.replace(/\D/g, '');
                            if (cleaned.length <= 2) {
                              setFormData({ ...formData, expiryMonth: cleaned });
                            }
                          }}
                          keyboardType="numeric"
                          maxLength={2}
                        />
                        <TextInput
                          style={[styles.input, { flex: 1 }]}
                          placeholder="AA"
                          value={formData.expiryYear}
                          onChangeText={(text) => {
                            const cleaned = text.replace(/\D/g, '');
                            if (cleaned.length <= 2) {
                              setFormData({ ...formData, expiryYear: cleaned });
                            }
                          }}
                          keyboardType="numeric"
                          maxLength={2}
                        />
                      </View>
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={styles.inputLabel}>CVV *</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="000"
                        value={formData.cvv}
                        onChangeText={(text) => {
                          const cleaned = text.replace(/\D/g, '');
                          if (cleaned.length <= 4) {
                            setFormData({ ...formData, cvv: cleaned });
                          }
                        }}
                        keyboardType="numeric"
                        maxLength={4}
                        secureTextEntry
                      />
                    </View>
                  </View>
                </>
              )}

              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>
                  {editingMethod ? 'SALVAR ALTERAÇÕES' : 'ADICIONAR CARTÃO'}
                </Text>
              </TouchableOpacity>
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
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6b655c',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  methodCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f2e9dd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  methodName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1a1309',
    marginRight: 8,
  },
  methodDescription: {
    fontSize: 14,
    color: '#6b655c',
    marginTop: 4,
  },
  defaultBadge: {
    backgroundColor: '#d6a05b',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  defaultText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1a1309',
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1309',
    marginTop: 8,
    letterSpacing: 2,
  },
  cardHolder: {
    fontSize: 12,
    color: '#6b655c',
    marginTop: 4,
    textTransform: 'uppercase',
  },
  cardExpiry: {
    fontSize: 12,
    color: '#6b655c',
    marginTop: 2,
  },
  methodActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingTop: 12,
    marginTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#d8cdbf',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f2e9dd',
  },
  actionText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#6b655c',
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
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#d6a05b',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
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
    padding: 20,
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#d8cdbf',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  typeButtonActive: {
    borderColor: '#d6a05b',
    backgroundColor: '#d6a05b',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6b655c',
  },
  typeButtonTextActive: {
    color: '#1a1309',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1309',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1a1309',
    borderWidth: 1,
    borderColor: '#d8cdbf',
  },
  row: {
    flexDirection: 'row',
  },
  saveButton: {
    backgroundColor: '#d6a05b',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1a1309',
  },
});
