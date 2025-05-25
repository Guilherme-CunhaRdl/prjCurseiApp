import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from "@react-navigation/native";
import host from '../../global';

const Seguindo = ({ visible, onClose,arroba,userPost}) => {
  async function seguir() {
   
    const idUserSalvo = await AsyncStorage.getItem('idUser');
    if (!idUserSalvo) {
      navigation.navigate('Login')
    }
  
    const url = `http://${host}:8000/api/posts/interacoes/seguir`;
    const seguidores = new  FormData();
    seguidores.append('idUser',idUserSalvo)
    seguidores.append('userPost',userPost)
    axios.post(url,seguidores, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
    })
    onClose()
  }
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={() => seguir()}
      onBackButtonPress={onClose}
      backdropOpacity={0}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={500}
      animationOutTiming={500}
      style={{ margin: 0, justifyContent: 'flex-end' }}
    >
      <View style={styles.modal}>
        <View style={styles.modalTexto}>
          <Text style={styles.texto}>Agora você está seguindo @{arroba}</Text>
          <Pressable onPress={onClose}>
            <Text style={styles.texto}>Desfazer</Text>
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
    fontWeight:'bold'
  },
});

export default Seguindo;
