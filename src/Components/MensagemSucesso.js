import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Modal from 'react-native-modal';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import host from '../global';
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
    setVisible(false); // Abre o de denúncia concluída
  };

  return (
    <>
      <Modal
        isVisible={visible}
        onBackdropPress={onClose}
        onBackButtonPress={onClose}
        animationIn="slideInLeft"
        animationOut="slidaeOutLeft"
        backdropTransitionInTiming={500}
        backdropTransitionOutTiming={500}
        animationInTiming={800}
        animationOutTiming={800}
      >
        <View style={styles.modal}>
          <View style={styles.modalTexto}>
          <Text style={styles.descItem}>
                <AntDesign name='checkcircle' size={80}  color={'#228B22'}/>
            </Text>

            <Text style={styles.texto}>Cadastro Realizado com Sucesso</Text>
           
          </View>

          
        </View>
      </Modal>

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
    fontWeight: '400'
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
