import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import host from '../../global';
import { useTema } from '../../context/themeContext';
const NaoInteressado = ({ visible, onClose,arroba,idPost }) => {
  async function naointeressar() {
    const idUserSalvo = await AsyncStorage.getItem('idUser');
    data = new FormData();
    data.append('idUser',idUserSalvo)
    data.append('idPost',idPost)
    
    const url = `http://${host}:8000/api/posts/interacoes/naointeressado`;
    try{
      axios.post(url,data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
    })
      onClose()
    }catch{
      console.log("erro ao não interessar o post")
    }

  }
  const {tema} = useTema();
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={naointeressar}
      onBackButtonPress={onClose}
      backdropOpacity={0}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={500}
      animationOutTiming={500}
      style={{ margin: 0, justifyContent: 'flex-end' }}
    >
      <View style={[styles.modal, { backgroundColor: tema.azul }]}>
        <View style={styles.modalTexto}>
          <Text style={[styles.texto, { color: "#fff" }]}>
            @{arroba} não será mais recomendado.
          </Text>
          <Pressable onPress={onClose}>
            <Text style={[styles.textoDestacado, { color: "#fff" }]}>
              Desfazer
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  modal: {
    backgroundColor: '#448FFF',
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    height: 40,
  },
  modalTexto: {
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  texto: {
    fontSize: 16,
    textAlign: 'center',
    color: 'white',
  },
  textoDestacado: {
    fontSize: 16,
    textAlign: 'center',
    color: 'white',
    fontWeight: 'normal',
  },
});

export default NaoInteressado;
