import axios from 'axios';
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import host from '../../global';
import { useTema } from '../../context/themeContext';

const ModalBloquear = ({ visible, onClose,arroba,userPost }) => {
  async function bloquear() {
    const idUserSalvo = await AsyncStorage.getItem('idUser');
    bloqueio = new FormData();
    bloqueio.append('userPost',userPost);
    bloqueio.append('idUser',idUserSalvo);
    url = `http://${host}:8000/api/posts/interacoes/bloquear`;
    try{
      await axios.post(url,bloqueio, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onClose();
    }catch{
      console.log('erro ao bloquear usuario')
    }
    
  }
  const {tema} = useTema();
  return (
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
      <View style={[styles.modal, { backgroundColor: tema.modalFundo }]}>
        <View style={styles.modalTexto}>
          <Text style={[styles.texto, { color: tema.texto }]}>
            Tem certeza que deseja bloquear @{arroba}?
          </Text>
          <Text style={[styles.descItem, { color: tema.descricao }]}>
            Você não verá mais as publicações dele e ele não poderá ver as suas.
          </Text>
        </View>

        <View style={styles.modalBotoes}>
          <View style={styles.botoes}>
            <View
              style={{
                height: '100%',
                borderRightWidth: 1,
                borderColor: tema.cinza,
                width: '50%',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Pressable onPress={onClose}>
                <Text style={{ fontWeight: '700', color: tema.azul }}>Cancelar</Text>
              </Pressable>
            </View>
            <View
              style={{
                height: '100%',
                width: '50%',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Pressable onPress={bloquear}>
                <Text style={{ fontWeight: '600', color: tema.vermelho }}>Confirmar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: '80%',
    alignSelf: 'center',
    justifyContent: 'space-around',
    height: '20%',
  },
  modalTexto: {
    flex: 0.65,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '5%',
  },
  modalBotoes: {
    flex: 0.35,
  },
  texto: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  descItem: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
  },
  botoes: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#DBDBDB',
  },
});

export default ModalBloquear;
