
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Feather";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import colors  from '../colors';
import * as ImagePicker from 'expo-image-picker';

export default function ModalPostagem() {

  const navigation = useNavigation();
  const [modalVisivel, setModalVisivel] = useState(false);
  const [imagem, setImagem] = useState(null);
  const [imgUser, SetImgUser] = useState('');
  const [arroba, SetArrobaUser] = useState('');
  const [descPost, setDescPost] = useState('');

  const abrirGaleria = async () => {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      alert('É necessário permissão para acessar a galeria!');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!resultado.canceled) {
      setImagem(resultado.assets[0].uri);
    }
  };

  const tirarFoto = async () => {
    const permissao = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissao.granted) {
      alert('Permissão para usar a câmera é necessária!');
      return;
    }

    const resultado = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!resultado.canceled) {
      setImagem(resultado.assets[0].uri);
    }
  };

  const abrirModal = async () => {
    setModalVisivel(true);
  };

  const fecharModal = () => {
    setModalVisivel(false);
  };

   async function postar() {
    const novoPost = new FormData();
    if (imagem.startsWith("data:image")) {
      // Converter Base64 para Blob
      const response = await fetch(imagem);
      const blob = await response.blob();
      // Gerar um nome único para o arquivo
      const filename = `image_${Date.now()}.jpg`;
      // Criar um arquivo a partir do Blob
      const file = new File([blob], filename, { type: blob.type });
      // Adicionar o arquivo ao FormData
      novoPost.append("img", file);
    } else {
      // Se não for Base64, assumir que é uma URI local
      const localUri = imagem;
      const filename = localUri.split("/").pop(); // Extrair o nome do arquivo da URI
      const match = /\.(\w+)$/.exec(filename); // Extrair o tipo da imagem
      const type = match ? `image/${match[1]}` : "image/jpeg"; // Definir o tipo, fallback para "image/jpeg"
    
      // Criar o objeto de arquivo com a URI local
      const file = {
        uri: localUri,
        type: type,
        name: filename,
      };
    
      // Adicionar o arquivo ao FormData
      novoPost.append("img", file);
    }

    novoPost.append("descricaoPost",descPost)
    const idUser =await AsyncStorage.getItem('idUser')
    url = 'http://localhost:8000/api/cursei/posts/'+idUser;
    try{
      const response = await axios.post(url, novoPost, {
        headers: { 
          'Content-Type': 'multipart/form-data',
        },
      });
      fecharModal();
    }catch{
      console.log('erro ao fazer a postagem')
    }
   }
  useEffect(() => {
    const carregarUsuario = async () => {
      const imgUser1 = await AsyncStorage.getItem('imgUser');
      SetImgUser(imgUser1)
      const arroba = await AsyncStorage.getItem('arrobaUser');
      SetArrobaUser(arroba)
    };

    carregarUsuario();
  }, []);

  


  const usuario = {
    foto: `http://localhost:8000/img/user/fotoPerfil/${imgUser}`, 
    username: arroba || 'você'
  };
  

  return (
    <View>
      <TouchableOpacity style={estilos.sendButton}   onPress={abrirModal}>
        <Icon name="send" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <Modal style={estilos.modalTelaCheia}
        animationType="slide"
        transparent={true}
        visible={modalVisivel}
        onRequestClose={fecharModal}
      >
            <View style={estilos.modalTelaCheia}>

        {/* Cabeçalho */}
        <View style={estilos.cabecalho}>
          <TouchableOpacity onPress={fecharModal}>
            <Icon name="x" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={estilos.titulo}>Novo Post</Text>
          <TouchableOpacity onPress={postar}>
            <Text style={[estilos.botaoPublicar]}>Publicar</Text>
          </TouchableOpacity>
        </View>

        {/* Corpo */}
        <ScrollView style={estilos.corpo}>
          <View style={estilos.usuario}>
            <Image
              source={{ uri: usuario.foto }}
              style={estilos.avatar}
            />
            <Text style={estilos.nomeUsuario}>@{usuario.username}</Text>
          </View>

          <TextInput
            placeholder="Digite o que aconteceu hoje..."
            multiline
            style={estilos.campoTexto}
            textAlignVertical="top"
            onChangeText={text => setDescPost(text)}
          />

          {/* Exemplo com imagem estática */}
          <Image
            source={{ uri: imagem }}
            style={estilos.imagemPreview}
            resizeMode="cover"
          />
        </ScrollView>

        {/* Rodapé */}
        <View style={estilos.rodape}>
          <TouchableOpacity style={estilos.botaoAcao} onPress={abrirGaleria} >
            <Icon name="image" size={20} color="#1E90FF" />
            <Text>Galeria</Text>
          </TouchableOpacity>

          <TouchableOpacity style={estilos.botaoAcao} onPress={tirarFoto}>
            <Icon name="camera" size={20} color="#1E90FF" />
            <Text>Foto</Text>
          </TouchableOpacity>
        </View>
        </View>
      </Modal>
    </View>
  );
};

const estilos = StyleSheet.create({

  modalTelaCheia: {
    flex: 1,
    backgroundColor: colors.branco,
    zIndex:99
  },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    
  },
  titulo: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  botaoPublicar: {
    color: '#1E90FF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  corpo: {
    flex: 1,
    paddingHorizontal: 16,
  },
  usuario: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  nomeUsuario: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  campoTexto: {
    fontSize: 16,
    padding: 0,
    margin: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    marginBottom: 16,
    minHeight: 100,
    // outline: 'none',
  },
  imagemPreview: {
    width: '100%',
    height: 300,
    marginBottom: 16,
    borderRadius: 8,
  },
  rodape: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  botaoAcao: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
  },
  sendButton: {
    position: 'fixed',
    right: 20,
    bottom: 70,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});
