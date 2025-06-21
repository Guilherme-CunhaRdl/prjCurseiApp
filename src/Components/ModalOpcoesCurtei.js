import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';



export default function ModalOpcoesCurtei({ visible, onClose, onEditar, onExcluir }) {

    
  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity style={styles.overlay} onPress={onClose} activeOpacity={1}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.option} onPress={onEditar}>
            <Text style={styles.optionText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={onExcluir}>
            <Text style={[styles.optionText, { color: 'red' }]}>Excluir</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancel} onPress={onClose}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  option: {
    paddingVertical: 15,
  },
  optionText: {
    fontSize: 18,
    color: '#1F2937',
  },
  cancel: {
    paddingVertical: 15,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  cancelText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#6B7280',
  },
});
