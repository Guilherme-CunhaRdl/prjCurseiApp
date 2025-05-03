import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from "@react-navigation/native";

const DenunciaConcluida = ({ visible, onClose,idPost,motivo,userPost }) => {
  const navigation = useNavigation();

  async function novaDenuncia(idPost) {
   
    const idUserSalvo = await AsyncStorage.getItem('idUser');
    if (!idUserSalvo) {
      navigation.navigate('Login')
    }
  
    const url = 'http://localhost:8000/api/posts/interacoes/denunciar';
    denuncia = new  FormData();
    denuncia.append('idPost',idPost)
    denuncia.append('idUser',idUserSalvo)
    denuncia.append('motivo',motivo)
    denuncia.append('denunciado',userPost)
    axios.post(url,denuncia)
    onClose()
  }
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
      <View style={styles.modal}>
        <View style={styles.modalTexto}>
          <Text style={styles.texto}>Denúncia enviada com sucesso</Text>
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
    fontWeight: 'bold',
  },
});

export default DenunciaConcluida;
