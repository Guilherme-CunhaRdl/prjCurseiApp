import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from "@react-navigation/native";
import host from '../../global';
import { useTema } from '../../context/themeContext';
const DenunciaConcluida = ({ visible, onClose,idPost,motivo,userPost }) => {
  const navigation = useNavigation();

  async function novaDenuncia(idPost) {
   
    const idUserSalvo = await AsyncStorage.getItem('idUser');
    if (!idUserSalvo) {
      navigation.navigate('Login')
    }
  
    const url = `http://${host}:8000/api/posts/interacoes/denunciar`;
    denuncia = new  FormData();
    denuncia.append('idPost',idPost)
    denuncia.append('idUser',idUserSalvo)
    denuncia.append('motivo',motivo)
    denuncia.append('denunciado',userPost)

    try{
      axios.post(url,denuncia, {
        headers: { 
          'Content-Type': 'multipart/form-data',
        },
      })
      console.log(url,denuncia)
    }catch(error){
      console.log(error,)
    }
    onClose()
  }
  const {tema} = useTema();
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={() => novaDenuncia(idPost)}
      onBackButtonPress={onClose}
      backdropOpacity={0}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={500}
      animationOutTiming={500}
      style={{ margin: 0, justifyContent: 'flex-end' }}
    >
      <View style={[styles.modal, { backgroundColor: tema.modalFundo }]}>
        <View style={styles.modalTexto}>
          <Text style={[styles.texto, { color: tema.texto }]}>
            Denúncia enviada com sucesso
          </Text>
          <Pressable onPress={onClose}>
            <Text style={[styles.texto, { color: tema.azul }]}>Desfazer</Text>
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
    fontWeight: 'bold',
  },
});

export default DenunciaConcluida;
