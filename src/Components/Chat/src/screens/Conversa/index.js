import React, { useState, useEffect, useRef, use } from 'react';
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
import axios from 'axios';
import Pusher from 'pusher-js/react-native';


export default function Conversa({route}) {

  const {idUserLogado, idEnviador, imgEnviador, nomeEnviador, arrobaEnviador, idChat} = route.params;
  const [ campoMensagem, setCampoMensagem] = useState('')
  const navigation = useNavigation();
  const [mensagens, setMensagens] = useState([])
  const flatListRef = useRef(null);
  const isEnviando = useRef(false);


    
  const abrirConversaInicio = async () =>{

      try {
      const resposta = await axios.get(`http://localhost:8000/api/cursei/chat/${idChat}`);
      setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: false });
    }, 300);
      setMensagens(resposta.data.chats); 
      console.log(resposta.data.chats);
      console.log(mensagens)
     
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
      console.log('Nova mensagem recebida', data);
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
    // isEnviando.current = true;
    //   console.log(isEnviando)

    
    try {
    const resposta = await axios.post('http://localhost:8000/api/cursei/chat/enviarMensagem', {
      idChat: idChat,
      conteudoMensagem: mensagem,
      idEnviador: idUserLogado
    });

    

    // canal.bind('nova_mensagem', (data) => {
    //       console.log('Nova mensagem recebida', data);
    //       setMensagens((prev) => [...prev, data]);
    //     });

      setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: false });
    }, 100);
    }catch(erro){
      console.error("Erro ao enviar mensagem:", error);

    }finally{
      isEnviando.current = false
    }

  }


  
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
