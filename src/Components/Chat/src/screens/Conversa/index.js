import React, { useState, useEffect, useRef, use } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import Pusher from 'pusher-js/react-native';
import colors from '../../../../../colors';
import Icon from "react-native-vector-icons/Feather";


export default function Conversa({route}) {

  const {idUserLogado, idEnviador, imgEnviador, nomeEnviador, arrobaEnviador, idChat} = route.params;
  const [ campoMensagem, setCampoMensagem] = useState('')
  const navigation = useNavigation();
  const [mensagens, setMensagens] = useState([])
  const flatListRef = useRef(null);
    const [modalFoto, setModalFoto] = useState(false)
  const [imagem, setImagem] = useState(null)


  useFocusEffect(() =>{

  })

    
  const abrirConversaInicio = async () =>{

      try {
      const resposta = await axios.get(`http://localhost:8000/api/cursei/chat/${idChat}`);
      setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: false });
    }, 300);
      setMensagens(resposta.data.chats); 
     
    } catch (error) {
      console.error("Erro ao buscar mensagens:", error);
    } 
  }


 useEffect(() => {
  const pusher = new Pusher('yls40qRApouvChytA220SnHKQViSXBCs', {
  cluster: 'mt1', 
  wsHost: '127.0.0.1', 
  wsPort: 6001,
  forceTLS: false,
  enabledTransports: ['ws'],
  authEndpoint: 'http://127.0.0.1:8000/broadcasting/auth', 
  auth: {
    headers: {
      Authorization: 'Bearer SEU_TOKEN_AQUI',
    },
  },
});
    const canal = pusher.subscribe(`chat_mensagem.${idChat}`); 

    canal.bind('nova_mensagem', (data) => {
      setMensagens((prev) => [...prev, data.mensagem]);
    });

    return () => {
      canal.unbind_all();
      canal.unsubscribe();
    };
  }, []);
useEffect(() => {
  abrirConversaInicio();
 
}, []);


  const enviarMensagem = async () =>{
    
    let mensagem = campoMensagem.trim()
       
    if (!mensagem) return;

    setCampoMensagem('')
    

    
    try {
    const resposta = await axios.post(`http://localhost:8000/api/cursei/chat/enviarMensagem/`, {
      idChat: idChat,
      conteudoMensagem: mensagem,
      idEnviador: idUserLogado,
    });

    

   

      setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: false });
    }, 150);
    }catch(erro){
      console.error("Erro ao enviar mensagem:", error);

    }

  }


  
 //Bliblioteca que puxa o gerenciador de arquivos padrão do android
  const abrirDocumentos = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!resultado.canceled) {
      setImagem(resultado.assets[0].uri);
            console.log(imagem)
      setModalFoto(true)

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

  const tirarFoto = async () =>  {
     const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!resultado.canceled) {
      setImagem(resultado.assets[0].uri);
      setModalFoto(true)

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

        
        </View>

        {/* Flatlist das mensagens */}
        <FlatList
          ref={flatListRef}
          data={mensagens}
          keyExtractor={(item) => item.id_mensagem?.toString() ?? Math.random().toString()}
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
            value={campoMensagem}
            onChangeText={setCampoMensagem}
          />

          <TouchableOpacity onPress={() => enviarMensagem()}>
            <Image source={require('../../img/enviar.png')} style={styles.iconSmall} />
          </TouchableOpacity>
        </View>
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={modalFoto}
                  // onRequestClose={fecharModal}
                  style={styles.containerModalFoto}
                >
                  <View style={styles.containerModalFoto}>
                    <View style={styles.boxModalFoto}>
                      <View style={styles.cabecalhoModalFoto}>
                        <TouchableOpacity onPress={() => setModalFoto(false)}>
                        <Icon name="x" size={22} color={colors.azul} />
                        </TouchableOpacity>
                        <Text style={{fontSize: 16, fontWeight: 500, color: colors.branco, paddingLeft: 7}}>Verifique Sua Imagem</Text>
                      </View>

                      <View style={styles.viewImgModalFoto}>
                        <View style={styles.fotoModalFoto}>
                          {imagem && (
                            <Image 
                              source={{uri: imagem}} 
                              style={styles.imgModalFoto}
                              resizeMode="contain"
                            />
                          )}
                        </View>
                      </View>
                      <View style={styles.boxMsgModalFoto}>
                         <View style={[styles.inputContainer, { width: '90%'}]}>
          

                      <TextInput
                        style={[styles.input]}
                        placeholder="Escreva sua Mensagem..."
                        placeholderTextColor="#A7A7A7"
                        value={campoMensagem}
                        onChangeText={setCampoMensagem}
                      />

          <TouchableOpacity onPress={() => enviarMensagem()}>
            <Image source={require('../../img/enviar.png')} style={styles.iconSmall} />
          </TouchableOpacity>
        </View>
                      </View>
                    </View>
                  </View>
                </Modal>

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
  containerModalFoto:{
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',

    backgroundColor:'transparent'
  },
  boxModalFoto:{
   width: '100%',
   flex: 1,
   backgroundColor: colors.branco,
   shadowColor: colors.preto,
   shadowOffset: {width: 0, height: 0},
   shadowOpacity: 0.5,
   shadowRadius: 5,
   backgroundColor: colors.preto,
   opacity: 0.93

  },
  cabecalhoModalFoto:{
    width: '100%',
    flexDirection: 'row',
    padding: 6
  },
  viewImgModalFoto:{
    height: '90%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fotoModalFoto:{
    width: '100%',
    height: '100%',
    
  },
  imgModalFoto:{
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  },
  boxMsgModalFoto:{
    position: 'absolute',
    bottom: 10,
    left: 5,
    width: '100%',
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputModalFoto:{
    width: '100%',
    shadowColor: colors.preto,
   shadowOffset: {width: 0, height: 0},
   shadowOpacity: 0.5,
   shadowRadius: 5,
   marginRight: 10
  },
  boxEnviar:{
    width: 45,
    height: 45,
    borderRadius: '50%',
    backgroundColor: colors.azul,
    justifyContent: 'center',
    alignItems: 'center'
    
  }
});
