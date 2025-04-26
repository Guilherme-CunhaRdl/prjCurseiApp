import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Modal from 'react-native-modal';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import DenunciaConcluida from './denunciaConcluida';

const motivosDenuncia = [
  { value: '1', label: 'Conteúdo ofensivo', icon: 'warning' },
  { value: '2', label: 'Spam ou conteúdo enganoso', icon: 'disconnect' },
  { value: '3', label: 'Assédio ou bullying', icon: 'closecircleo' },
  { value: '4', label: 'Incitação ao ódio', icon: 'exclamationcircleo' },
  { value: '5', label: 'Violação de direitos autorais', icon: 'copyright' },
];

const ModalReportar = ({ visible, onClose }) => {
  const [motivo, setMotivo] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const selectedItem = motivosDenuncia.find(item => item.value === motivo);

  const handleConfirmar = () => {
    onClose(); // Fecha o modal atual
    setShowConfirmModal(true); // Abre o de denúncia concluída
  };

  return (
    <>
      <Modal
        isVisible={visible}
        onBackdropPress={onClose}
        onBackButtonPress={onClose}
        animationIn="slideInLeft"
        animationOut="slideOutLeft"
        backdropTransitionInTiming={500}
        backdropTransitionOutTiming={500}
        animationInTiming={800}
        animationOutTiming={800}
      >
        <View style={styles.modal}>
          <View style={styles.modalTexto}>
            <Text style={styles.texto}>Qual o motivo da denúncia?</Text>
            <Text style={styles.descItem}>
              Após denunciar, @nome não verá mais suas publicações.
            </Text>
          </View>

          <View style={styles.dropdownWrapper}>
            <Dropdown
              style={styles.dropdown}
              selectedTextStyle={styles.selectedTextStyle}
              placeholderStyle={styles.placeholderStyle}
              iconStyle={styles.iconStyle}
              maxHeight={200}
              value={motivo}
              data={motivosDenuncia}
              valueField="value"
              labelField="label"
              placeholder="Selecione o motivo"
              onChange={e => setMotivo(e.value)}
              renderItem={(item) => (
                <View style={styles.item}>
                  <AntDesign name={item.icon} size={20} color="#333" style={styles.iconItem} />
                  <Text style={styles.itemText}>{item.label}</Text>
                </View>
              )}
              renderLeftIcon={() =>
                selectedItem ? (
                  <AntDesign name={selectedItem.icon} size={20} color="#333" style={styles.selectedIcon} />
                ) : null
              }
            />
          </View>

          <View style={styles.modalBotoes}>
            <View style={styles.botoes}>
              <View style={styles.botaoContainer}>
                <Pressable onPress={onClose}>
                  <Text style={styles.cancelar}>Cancelar</Text>
                </Pressable>
              </View>
              <View style={[styles.botaoContainer, { borderRightWidth: 0 }]}>
                <Pressable onPress={handleConfirmar}>
                  <Text style={styles.confirmar}>Confirmar</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Denúncia Concluída */}
      <DenunciaConcluida visible={showConfirmModal} onClose={() => setShowConfirmModal(false)} />
    </>
  );
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: '85%',
    alignSelf: 'center',
  },
  modalTexto: {
    padding: 20,
    paddingBottom: 10,
  },
  texto: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center',
    fontWeight: '500',
  },
  descItem: {
    fontSize: 13,
    textAlign: 'center',
    color: '#555',
  },
  dropdownWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  dropdown: {
    width: '90%',
    height: 50,
    paddingHorizontal: 12,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  placeholderStyle: {
    fontSize: 15,
    color: '#999',
  },
  selectedTextStyle: {
    fontSize: 15,
    marginLeft: 8,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  selectedIcon: {
    marginRight: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  iconItem: {
    marginRight: 10,
  },
  itemText: {
    fontSize: 15,
    color: '#333',
  },
  modalBotoes: {
    borderTopWidth: 1,
    borderTopColor: '#DBDBDB',
  },
  botoes: {
    flexDirection: 'row',
    height: 50,
  },
  botaoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderColor: '#DBDBDB',
  },
  cancelar: {
    fontWeight: '700',
    color: '#448FFF',
  },
  confirmar: {
    fontWeight: '600',
    color: 'red',
  },
});

export default ModalReportar;
