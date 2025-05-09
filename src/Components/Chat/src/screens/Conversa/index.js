import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
export default function Conversa({route}) {

  const {idUserLogado, idEnviador, imgEnviador, nomeEnviador, arrobaEnviador, idChat} = route.params;
  const [mensagem, setMensagem] = useState('');
  const navigation = useNavigation();
  const [mensagens, setMensagens] = useState(null)
console.log('idChat:', idChat)
  // trazendo convesas do banco
  const listarConversa = async () =>{
    const id = await AsyncStorage.getItem('idUser')
    try {
      const resposta = await axios.get(`http://localhost:8000/api/cursei/chat/${idChat}`);
      setMensagens(resposta.data.chats); 
      console.log(resposta.data.chats);
      console.log(mensagens)
    } catch (error) {
      console.error("Erro ao buscar mensagens:", error);
    }
  }
//executando a query quando abrir a tela
  useEffect(() => {
    listarConversa();

  }, []);


  
 //Bliblioteca que puxa o gerenciador de arquivos padrão do android
  const abrirDocumentos = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
      });
    } catch (error) {
      console.error('Erro ao abrir documentos:', error);
    }
  };
  //parada para a camera funcionar
  useEffect(() => {
    (async () => {
      const { status: cameraStatus } =
        await ImagePicker.requestCameraPermissionsAsync();
      if (cameraStatus !== "granted") {
        Alert.alert(
          "Permissão necessária",
          "Precisamos da sua permissão para acessar a câmera."
        );
      }
      const { status: notificationStatus } =
        await Notifications.requestPermissionsAsync();
      if (notificationStatus !== "granted") {
        Alert.alert(
          "Permissão necessária"
        );
      }
    })();
  }, []);

  async function tirarFoto() {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" backgroundColor="#fff" translucent={false} />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={require('../../img/voltar.png')} style={styles.iconSmall} />
          </TouchableOpacity>

          <View style={styles.headerInfo}>
            <Image                     
            source={ imgEnviador === null ? require('../../img/metalbat.jpg') : {uri : `http://localhost:8000/img/user/fotoPerfil/${imgEnviador}`} }
            style={styles.avatar} />
            <View>
              <Text style={styles.nome}>{nomeEnviador}</Text>
              <Text style={styles.usuario}>@{arrobaEnviador}</Text>
            </View>
          </View>

          <TouchableOpacity onPress={() => {}}>
            <Image source={require('../../img/Phone.png')} style={styles.iconSmall} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {}}>
            <Image source={require('../../img/Video.png')} style={styles.iconSmall} />
          </TouchableOpacity>
        </View>

        {/* Flatlist das mensagens */}
        <FlatList
          data={mensagens}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[ item.id_enviador === idEnviador ? styles.mensagemRecebida : styles.mensagemEnviada ]}>
              <Text style={styles.textoMensagem}>{item.conteudo_mensagem}</Text>
            </View>
          )}
          contentContainerStyle={styles.chatContent}
        />

        {/* Input de enviar mensagem */}
        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={tirarFoto}>
            <Image source={require('../../img/Camera.png')} style={styles.iconSmall} />
          </TouchableOpacity>

          <TouchableOpacity onPress={abrirDocumentos}>
            <Image source={require('../../img/gallery.png')} style={styles.iconSmall} />
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Escreva sua Mensagem..."
            placeholderTextColor="#A7A7A7"
            value={mensagem}
            onChangeText={setMensagem}
          />

          <TouchableOpacity onPress={() => {}}>
            <Image source={require('../../img/enviar.png')} style={styles.iconSmall} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
    elevation: 2,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
  },
  avatar: { 
    width: 32, 
    height: 32, 
    borderRadius: 16,
    marginRight: 8 },
  nome: { 
  fontWeight: 'bold', 
  fontSize: 14 
},
  usuario: { 
    fontSize: 12,
     color: '#666'
   },
  iconSmall: { 
    width: 22, 
    height: 22, 
    marginHorizontal: 6 
  },
  chatContent: { 
    padding: 16 
  },
  mensagemRecebida: {
    alignSelf: 'flex-start',
    backgroundColor: '#f1f1f1',
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
    maxWidth: '75%',
  },
  mensagemEnviada: {
    alignSelf: 'flex-end',
    backgroundColor: '#f1f1f1',
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
    maxWidth: '75%',
  },
  recebida: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textoMensagem: { color: '#000', fontSize: 14 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#efefef',
    padding: 4,
    margin: 16,
    borderRadius: 16,
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 4,
    paddingHorizontal: 8,
    color: '#000',
  },
});
