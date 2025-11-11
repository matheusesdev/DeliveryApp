// Tela de gerenciamento de endereços: adicionar, editar, remover
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
import { useAddress } from '../context/AddressContext';

export default function AddressesScreen({ navigation }) {
  const { addresses, addAddress, updateAddress, removeAddress, setDefaultAddress } = useAddress();
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  
  // Estado do formulário
  const [formData, setFormData] = useState({
    label: '',
    street: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const openAddModal = () => {
    setEditingAddress(null);
    setFormData({
      label: '',
      street: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: '',
    });
    setShowModal(true);
  };

  const openEditModal = (address) => {
    setEditingAddress(address);
    setFormData({
      label: address.label,
      street: address.street,
      complement: address.complement,
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
    });
    setShowModal(true);
  };

  const handleSave = () => {
    // Validação básica
    if (!formData.label.trim() || !formData.street.trim() || !formData.city.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha pelo menos: rótulo, rua e cidade');
      return;
    }

    if (editingAddress) {
      // Atualizar endereço existente
      updateAddress(editingAddress.id, formData);
      Alert.alert('Sucesso', 'Endereço atualizado!');
    } else {
      // Adicionar novo endereço
      addAddress(formData);
      Alert.alert('Sucesso', 'Endereço adicionado!');
    }

    setShowModal(false);
  };

  const handleDelete = (id, label) => {
    Alert.alert(
      'Remover endereço',
      `Deseja remover o endereço "${label}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => {
            removeAddress(id);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {addresses.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="location-outline" size={64} color="#d6a05b" />
            <Text style={styles.emptyTitle}>Nenhum endereço cadastrado</Text>
            <Text style={styles.emptySubtitle}>
              Adicione um endereço para facilitar suas entregas
            </Text>
          </View>
        ) : (
          addresses.map((address) => (
            <View key={address.id} style={styles.addressCard}>
              <View style={styles.addressHeader}>
                <View style={{ flex: 1 }}>
                  <View style={styles.labelRow}>
                    <Text style={styles.addressLabel}>{address.label}</Text>
                    {address.isDefault && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultText}>PADRÃO</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.addressText}>
                    {address.street}
                    {address.complement ? `, ${address.complement}` : ''}
                  </Text>
                  <Text style={styles.addressText}>
                    {address.neighborhood} - {address.city}/{address.state}
                  </Text>
                  <Text style={styles.addressText}>CEP: {address.zipCode}</Text>
                </View>
              </View>

              <View style={styles.addressActions}>
                {!address.isDefault && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => setDefaultAddress(address.id)}
                  >
                    <Ionicons name="star-outline" size={20} color="#d6a05b" />
                    <Text style={styles.actionText}>Definir como padrão</Text>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => openEditModal(address)}
                >
                  <Ionicons name="pencil-outline" size={20} color="#6b655c" />
                  <Text style={styles.actionText}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleDelete(address.id, address.label)}
                >
                  <Ionicons name="trash-outline" size={20} color="#b84c4c" />
                  <Text style={[styles.actionText, { color: '#b84c4c' }]}>Remover</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
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
                {editingAddress ? 'Editar endereço' : 'Novo endereço'}
              </Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={28} color="#1a1309" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.inputLabel}>Rótulo *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Casa, Trabalho, Apartamento..."
                value={formData.label}
                onChangeText={(text) => setFormData({ ...formData, label: text })}
              />

              <Text style={styles.inputLabel}>CEP</Text>
              <TextInput
                style={styles.input}
                placeholder="00000-000"
                value={formData.zipCode}
                onChangeText={(text) => setFormData({ ...formData, zipCode: text })}
                keyboardType="numeric"
              />

              <Text style={styles.inputLabel}>Rua/Avenida *</Text>
              <TextInput
                style={styles.input}
                placeholder="Rua das Flores, 123"
                value={formData.street}
                onChangeText={(text) => setFormData({ ...formData, street: text })}
              />

              <Text style={styles.inputLabel}>Complemento</Text>
              <TextInput
                style={styles.input}
                placeholder="Apto, Bloco, Sala..."
                value={formData.complement}
                onChangeText={(text) => setFormData({ ...formData, complement: text })}
              />

              <Text style={styles.inputLabel}>Bairro</Text>
              <TextInput
                style={styles.input}
                placeholder="Centro"
                value={formData.neighborhood}
                onChangeText={(text) => setFormData({ ...formData, neighborhood: text })}
              />

              <View style={styles.row}>
                <View style={{ flex: 2, marginRight: 8 }}>
                  <Text style={styles.inputLabel}>Cidade *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="São Paulo"
                    value={formData.city}
                    onChangeText={(text) => setFormData({ ...formData, city: text })}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Estado</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="SP"
                    value={formData.state}
                    onChangeText={(text) => setFormData({ ...formData, state: text.toUpperCase() })}
                    maxLength={2}
                  />
                </View>
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>
                  {editingAddress ? 'SALVAR ALTERAÇÕES' : 'ADICIONAR ENDEREÇO'}
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
  addressCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  addressHeader: {
    marginBottom: 12,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1a1309',
    marginRight: 8,
  },
  defaultBadge: {
    backgroundColor: '#d6a05b',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1a1309',
  },
  addressText: {
    fontSize: 14,
    color: '#6b655c',
    lineHeight: 20,
  },
  addressActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingTop: 12,
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
