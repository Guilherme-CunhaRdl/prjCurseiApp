import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import Pusher from "pusher-js/react-native";
import colors from "../../../../../colors";
import Icon from "react-native-vector-icons/Feather";
import host from "../../../../../global";
import EnviarPostPv from '../../../../EnviarPostNv';  
import { useTema } from "../../../../../context/themeContext";
import useStyles from "./styles";
export default function Conversa({ route }) {
  const {tema } = useTema();
  const styles = useStyles()
  const {
    idUserLogado,
    idEnviador,
    imgEnviador,
    nomeEnviador,
    arrobaEnviador,
    idChat,
    isCanal,
    idMembro
  } = route.params;

  const [campoMensagem, setCampoMensagem] = useState("");
  const [campoMensagemImg, setCampoMensagemImg] = useState("");
  const navigation = useNavigation();
  const [mensagens, setMensagens] = useState([]);
  const flatListRef = useRef(null);
  const [modalFoto, setModalFoto] = useState(false);
  const [imagemMensagem, setImagemMensagem] = useState();
  const [postPv, setPostPv] = useState(false);
  const [estaInscrito, setEstaInscrito] = useState(idMembro === idUserLogado);

  const abrirConversaInicio = async () => {
    try {
      const resposta = await axios.get(
        `http://${host}:8000/api/cursei/chat/mensagens/${idChat}`
      );

      const respostaCanal = await axios.get(
        `http://${host}:8000/api/cursei/chat/mensagensCanal/${idEnviador}/${idChat}`
      )
      
      if (resposta.data.chats && resposta.data.chats.length > 0 && !isCanal) {
        await setMensagens(resposta.data.chats);
      } else if (respostaCanal.data.mensagensCanal && respostaCanal.data.mensagensCanal.length > 0 && isCanal) {
        await setMensagens(respostaCanal.data.mensagensCanal);
       
      }
    } catch (error) {
      console.error("Erro ao buscar mensagens:", error);
    }finally{
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
      }, 1000);
    }
  };

  useEffect(() => {
    const pusher = new Pusher("yls40qRApouvChytA220SnHKQViSXBCs", {
      cluster: "mt1",
      wsHost: `${host}`,
      wsPort: 6001,
      forceTLS: false,
      enabledTransports: ["ws"],
      authEndpoint: `http://${host}:8000/broadcasting/auth`,
      auth: {
        headers: {
          Authorization: "Bearer SEU_TOKEN_AQUI",
        },
      },
    });


    const messageChannel = isCanal 
      ? pusher.subscribe(`mensagem_canal.${idChat}`)
      : pusher.subscribe(`chat_mensagem.${idChat}`);

   

    const messageEvent = isCanal ? "enviar_msg_canal" : "nova_mensagem";
    messageChannel.bind(messageEvent, (data) => {
      setMensagens((prev) => [...prev, data.mensagem]);
      console.log(data.mensagem);
      
     
    });

   

    return () => {
      
      // Desconectar canais
      messageChannel.unbind_all();
      messageChannel.unsubscribe();
      pusher.disconnect();
    };
  }, [idChat, isCanal, idUserLogado, nomeEnviador]);

  useEffect(() => {
    abrirConversaInicio();
  }, []);


  const enviarMensagem = async () => {
      let mensagem = campoMensagem.trim();

      if (!mensagem) return;

    

      setCampoMensagem("");
      console.log(idChat)
      try {
        const resposta = await axios.post(
          `http://${host}:8000/api/cursei/chat/enviarMensagem/semImagem`,
          {
            idChat: idChat,
            conteudoMensagem: mensagem,
            idEnviador: idUserLogado,
            
          }
        );
        console.log(idUserLogado, idEnviador)
        
      } catch (erro) {
        console.log("Erro ao enviar mensagem:", erro);
      }finally{
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: false });
        }, 150);
      }
    };

  const enviarMensagemFoto = async () => {
    try {
      const formData = new FormData();

      formData.append('idChat', idChat.toString());
      formData.append('idEnviador', idUserLogado.toString());
      formData.append('statusMensagem', 'false');

      if (campoMensagemImg.trim()) {
        formData.append('conteudoMensagem', campoMensagemImg.trim());
      }

      if (imagemMensagem) {
        formData.append('imgMensagem', {
          uri: imagemMensagem,
          name: `image_${Date.now()}.jpg`,
          type: 'image/jpeg'
        });
      }

      let resposta = '';
      isCanal ?  resposta = await axios.post(
        `http://${host}:8000/api/cursei/chat/enviarMensagem/canal/comImagem`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          transformRequest: () => formData,
        }
      )
       : 
        resposta = await axios.post(
        `http://${host}:8000/api/cursei/chat/enviarMensagem/comImagem`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          transformRequest: () => formData,
        }
      );
      

      console.log("Mensagem enviada:", resposta.data);
      setCampoMensagemImg("");
      setModalFoto(false);

    } catch (error) {
      console.error("Erro detalhado:", {
        message: error.message,
        code: error.code,
        config: error.config,
        response: error.response?.data,
      });

      Alert.alert("Erro", error.response?.data?.message || "Falha ao enviar mensagem");
    } finally {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
      }, 150);
    }
  };


  //Bliblioteca que puxa o gerenciador de arquivos padrão do android
  const abrirDocumentos = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!resultado.canceled) {
      const uri = resultado.assets[0].uri;
      setImagemMensagem(uri);
      console.log("URI selecionada:", imagemMensagem);
      setModalFoto(true);
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
        Alert.alert("Permissão necessária");
      }
            setModalFoto(true);

    })();
  }, []);

  
  const tirarFotoParaEnvio = async () => {
        const permissao = await ImagePicker.requestCameraPermissionsAsync();
        if (!permissao.granted) {
          alert("Permissão para usar a câmera é necessária!");
          return;
        }
  
        const resultado = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          quality: 1,
        });
  
        if (!resultado.canceled) {
          setImagemMensagem(resultado.assets[0].uri);
          setModalFoto(true);

        }
        console.log(modalFoto)
      };

  console.log(idUserLogado)

  const enviarMensagemCanal = async () => {

    let mensagem = campoMensagem.trim();

      if (!mensagem) return;

      setCampoMensagem("");
      console.log(idChat)
      try {
        const resposta = await axios.post(
          `http://${host}:8000/api/cursei/chat/enviarMensagem/canal/semImagem`,
          {
            idChat: idChat,
            conteudoMensagem: mensagem,
            idEnviador: idUserLogado,
            
          }
        );
        console.log(resposta)
      
      } catch (erro) {
        console.error("Erro ao enviar mensagem:", error);
      }finally{
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: false });
        }, 150);
      }
    
  }



  const seguirDeseguirCanal = async (idCanal) => {
      

    try{
      if(estaInscrito){

      const url = `http://${host}:8000/api/cursei/chat/deixarSeguir/${idUserLogado}/${idCanal}`;
      const resposta = await axios.delete(url);
      console.log(resposta);
      
      
     
      }else{

        const url = `http://${host}:8000/api/cursei/chat/seguirCanal`;
        
        const data = {
          idUsuario: idUserLogado,
          idCanal: idCanal
        };
        
        
        
        const resposta = await axios.post(url, data);
        const dadosApi = resposta.data;
        console.log(resposta);

      }
          setEstaInscrito(!estaInscrito);
       }catch (error){
        console.log(error)
      }
    }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" backgroundColor="#fff" translucent={false} />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={require("../../img/voltar.png")}
              style={styles.iconSmall}
            />
          </TouchableOpacity>

          <View style={styles.headerInfo}>
            <TouchableOpacity style={{ width: '70%', flexDirection: 'row', alignItems: 'center' }} onPress={() => navigation.navigate('Perfil', {
              idUserPerfil: idEnviador,
              titulo: arrobaEnviador
            })}>
              <Image
                source={
                  imgEnviador === null
                    ? require("../../img/metalbat.jpg")
                    : 
                    isCanal ?
                    {
                      uri: `http://${host}:8000/img/chat/imgCanal/${imgEnviador}`
                    }
                    : {
                      uri: `http://${host}:8000/img/user/fotoPerfil/${imgEnviador}`,
                    }
                }
                style={styles.avatar}
              />
              <View style={styles.viewCabecalho}>
                <View style={{width: '100%'}}>
                <Text style={styles.nome}>{nomeEnviador} {idMembro}</Text>
                
                <Text style={styles.usuario}>@{arrobaEnviador} </Text>
                </View>
                </View>
                </TouchableOpacity>

                {isCanal && idEnviador != idUserLogado && (
                  
                <View style={styles.viewBotaoSeguir}>
                  <TouchableOpacity style={[
                    styles.botaoSeguir,
                    estaInscrito && { backgroundColor: 'gray' }, // Ex: muda cor se já inscrito
                  ]}
                  onPress={() => seguirDeseguirCanal(idChat)}>
                  <Text style={styles.textSeguir}>
                    {estaInscrito ? 'Inscrito' : 'Seguir'}
                  </Text>
                </TouchableOpacity>
                </View>
                )}
          </View>
        </View>

        {/* Flatlist das mensagens */}
        <FlatList
          ref={flatListRef}
          data={mensagens}
          keyExtractor={(item) =>
            item.id_mensagem?.toString() ?? Math.random().toString()
          }
          renderItem={({ item }) => (
            <View
              style={[
                item.id_enviador == idUserLogado
                  ? styles.mensagemEnviada
                  : styles.mensagemRecebida
              ]}
            >
              {item.foto_enviada ? (
                <>
                <Image
                  source={{
                    uri: `http://${host}:8000/img/chat/fotosChat/${item.foto_enviada}`,
                  }}
                  style={styles.imgMensagem}
                  resizeMode="cover"
                />
                {item.conteudo_mensagem && (
                <View style={styles.viewTextoMsg}>
                  <Text style={[
                    item.id_enviador == idUserLogado
                      ? styles.textoMsgEnviado
                      : styles.textoMsgRecebido
                  ]}>
                    {item.conteudo_mensagem}
                  </Text>
                  
                </View>
                )}
                </>
              ) : item.id_post ? (
                <>
                <Pressable  onPress={() => navigation.navigate('PostUnico', {
                    idPost: item.id_post,
                    titulo: item.arroba_user_postou
                  })}>
                <View style={styles.headerPost}>
                  <Image
                  source={{
                    uri: `http://${host}:8000/img/user/fotoPerfil/${item.img_user_postou}`,
                  }}
                  style={styles.imgPerfil}
                  resizeMode="cover"
                />
                  <Text style={{color: tema.nome === 'escuro' ? tema.texto : '#fff' }}>{item.nome_user_postou}</Text>
                </View>

                <Image
                  source={{
                    uri: `http://${host}:8000/img/user/imgPosts/${item.cont_post}`,
                  }}
                  style={styles.imgMensagem}
                  resizeMode="cover"
                />
                
                <View style={styles.footerPost}>
                  <Text style={{color: colors.branco, }}>{item.desc_post}</Text>
                </View>
                
                </Pressable>

                </>
              ) :
              
              (
                <View style={styles.viewTextoMsg}>
                  <Text style={[
                    item.id_enviador == idUserLogado
                      ? styles.textoMsgEnviado
                      : styles.textoMsgRecebido
                  ]}>
                    {item.conteudo_mensagem}
                  </Text>
                </View>
              )
              
              }

              
            </View>
          )}
          contentContainerStyle={styles.chatContent}
          style={{ flex: 1 }}
        />

      
        

        {isCanal && idEnviador != idUserLogado && (
          <View style={styles.inputContainer}>



            <Text
              style={styles.input}
            >Não pode enviar mensagens</Text>
            

          </View>
        )}
        {isCanal && idEnviador == idUserLogado && (
  <View style={styles.inputContainer}>
    {/* Ícones à esquerda */}
    <View style={styles.viewIcones}>
      <TouchableOpacity 
        onPress={() => tirarFotoParaEnvio()}
        style={styles.iconButton}
      >
        <Image
          source={require("../../img/Camera.png")}
          style={styles.iconSmall}
        />
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={abrirDocumentos}
        style={styles.iconButton}
      >
        <Image
          source={require("../../img/gallery.png")}
          style={styles.iconSmall}
        />
      </TouchableOpacity>
    </View>

    {/* Campo de texto central */}
    <View style={{width: '65%', alignItems: 'center'}}>
    <TextInput
      style={styles.input}
      placeholder="Escreva sua Mensagem..."
      placeholderTextColor="#A7A7A7"
      value={campoMensagem}
      onChangeText={(text) => {
        setCampoMensagem(text);
      }}
      
    />
    </View>
    {/* Ícone de enviar à direita */}
    <View style={styles.viewSendButton}>
    {campoMensagem.length > 0 ?( 
    <TouchableOpacity 
      onPress={!isCanal ? enviarMensagem : enviarMensagemCanal}
      style={styles.sendButton}
    >
  
        <Image
          source={require("../../img/enviar.png")}
          style={styles.iconSmall}
        />

    </TouchableOpacity>
            )
        :  
              (
                <EnviarPostPv />
              )
    }
    </View>
  </View>
)}


        {!isCanal && (
          <View style={styles.inputContainer}>
            <View style={styles.viewIcones}>
              <TouchableOpacity onPress={() => tirarFotoParaEnvio()}>
                <Image
                  source={require("../../img/Camera.png")}
                  style={styles.iconSmall}
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={abrirDocumentos}>
                <Image
                  source={require("../../img/gallery.png")}
                  style={styles.iconSmall}
                />
              </TouchableOpacity>
            </View>
            <View style={{width: '65%', alignItems: 'center',   }}>
              <TextInput
                style={styles.input}
                placeholder="Escreva sua Mensagem..."
                placeholderTextColor="#A7A7A7"
                value={campoMensagem}
                onChangeText={(text) => {
                  setCampoMensagem(text);
                }}
              />
            </View>
            <View style={styles.viewSendButton}>
    {campoMensagem.length > 0 ?( 
    <TouchableOpacity 
      onPress={!isCanal ? enviarMensagem : enviarMensagemCanal}
      style={styles.sendButton}
    >
  
        <Image
          source={require("../../img/enviar.png")}
          style={styles.iconSmall}
        />

    </TouchableOpacity>
            )
        :  
              (
                <EnviarPostPv />
              )
    }
    </View>
          </View>
        )}

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
                <TouchableOpacity onPress={() => setModalFoto(false) }>
                  <Icon name="x" size={22} color={colors.azul} />
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '500',
                    color: colors.branco,
                    paddingLeft: 7,
                  }}
                >
                  Verifique Sua Imagem
                </Text>
              </View>

              <View style={styles.viewImgModalFoto}>
                <View style={styles.fotoModalFoto}>
                  {imagemMensagem && (
                    <Image
                      source={{ uri: imagemMensagem }}
                      style={styles.imgModalFoto}
                      resizeMode="contain"
                    />

                  )}
                </View>
              </View>
              <View style={styles.boxMsgModalFoto}>
                <View style={[styles.inputContainerModal, { width: "90%", height: 45 }]}>
             
            <View style={{width: '70%', justifyContent: 'space-between', alignItems: 'center'}}>
              <TextInput
                style={styles.input}
                placeholder="Escreva sua Mensagem..."
                placeholderTextColor="#A7A7A7"
                value={campoMensagemImg}
                onChangeText={(text) => {
                  setCampoMensagemImg(text);
                }}
                
              />
            </View>
            <View style={{width: '10%', justifyContent: 'space-between', alignItems: 'center'}}>
              <TouchableOpacity onPress={() => enviarMensagemFoto()}>
                <Image
                  source={require("../../img/enviar.png")}
                  style={styles.iconSmall}
                />
              </TouchableOpacity>
            </View>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

