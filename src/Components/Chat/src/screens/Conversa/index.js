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
export default function Conversa({ route }) {
  const {
    idUserLogado,
    idEnviador,
    imgEnviador,
    nomeEnviador,
    arrobaEnviador,
    idChat,
    isCanal
  } = route.params;
  console.log(idEnviador, idUserLogado, idChat, isCanal)
  const [campoMensagem, setCampoMensagem] = useState("");
  const [campoMensagemImg, setCampoMensagemImg] = useState("");
  const navigation = useNavigation();
  const [mensagens, setMensagens] = useState([]);
  const flatListRef = useRef(null);
  const [modalFoto, setModalFoto] = useState(false);
  const [imagemMensagem, setImagemMensagem] = useState();

  const abrirConversaInicio = async () => {
    try {
      const resposta = await axios.get(
        `http://${host}:8000/api/cursei/chat/mensagens/${idChat}`
      );

      const respostaCanal = await axios.get(
        `http://${host}:8000/api/cursei/chat/mensagensCanal/${idEnviador}/${idChat}`
      )
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
      }, 300);
      if (resposta.data.chats && resposta.data.chats.length > 0 && !isCanal) {
        await setMensagens(resposta.data.chats);
      } else if (respostaCanal.data.mensagensCanal && respostaCanal.data.mensagensCanal.length > 0 && isCanal) {
        await setMensagens(respostaCanal.data.mensagensCanal);
        console.log(respostaCanal.data.mensagensCanal)
        console.log(idChat)
      }
    } catch (error) {
      console.error("Erro ao buscar mensagens:", error);
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
    console.log(idChat)
    const canal = pusher.subscribe(`chat_mensagem.${idChat}`);

    canal.bind("nova_mensagem", (data) => {
      setMensagens((prev) => [...prev, data.mensagem]);
      console.log(data.mensagem)
    });

    return () => {
      canal.unbind_all();
      canal.unsubscribe();
    };
  }, []);
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
        console.error("Erro ao enviar mensagem:", error);
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


      // Envio da requisição
      const resposta = await axios.post(
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
      console.log("URI selecionada:", imagemMensagem); // <-- use o valor diretamente
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
            <TouchableOpacity style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }} onPress={() => navigation.navigate('Perfil', {
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
                <View style={{width: '30%'}}>
                <Text style={styles.nome}>{nomeEnviador}</Text>
                
                <Text style={styles.usuario}>@{arrobaEnviador}</Text>
                </View>
                {isCanal && (

                <View style={styles.viewBotaoSeguir}>
                  <TouchableOpacity style={styles.botaoSeguir}>
                  <Text style={styles.textSeguir}>
                    Seguir
                  </Text>
                </TouchableOpacity>
                </View>
                )}
              </View>
            </TouchableOpacity>
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
                <Image
                  source={{
                    uri: `http://${host}:8000/img/chat/fotosChat/${item.foto_enviada}`,
                  }}
                  style={styles.imgMensagem}
                  resizeMode="cover"
                />
              ) : null}

              {item.conteudo_mensagem ? (
                <View style={styles.viewTextoMsg}>
                  <Text style={[
                    item.id_enviador == idUserLogado
                      ? styles.textoMsgEnviado
                      : styles.textoMsgRecebido
                  ]}>
                    {item.conteudo_mensagem}
                  </Text>
                </View>
              ) : null}
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
    <View style={styles.iconsLeft}>
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
    <TextInput
      style={styles.input}
      placeholder="Escreva sua Mensagem..."
      placeholderTextColor="#A7A7A7"
      value={campoMensagem}
      onChangeText={setCampoMensagem}
      multiline
    />

    {/* Ícone de enviar à direita */}
    <TouchableOpacity 
      onPress={!isCanal ? enviarMensagem : enviarMensagemCanal}
      style={styles.sendButton}
    >
      <Image
        source={require("../../img/enviar.png")}
        style={styles.iconSmall}
      />
    </TouchableOpacity>
  </View>
)}
        {!isCanal && (
          <View style={styles.inputContainer}>
            <View style={{flexDirection:'row', width: '15%', justifyContent: 'space-around', alignItems: 'center'}}>
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
            <View style={{width: '70%', justifyContent: 'space-between', alignItems: 'center'}}>
              <TextInput
                style={styles.input}
                placeholder="Escreva sua Mensagem..."
                placeholderTextColor="#A7A7A7"
                value={campoMensagem}
                onChangeText={setCampoMensagem}
              />
            </View>
            <View style={{width: '15%', justifyContent: 'space-between', alignItems: 'center'}}>
              <TouchableOpacity onPress={!isCanal ? () => enviarMensagem() : ''}>
                <Image
                  source={require("../../img/enviar.png")}
                  style={styles.iconSmall}
                />
              </TouchableOpacity>
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
                <TouchableOpacity onPress={!isCanal ? () => setModalFoto(false) : ''}>
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
             
            <View style={{width: '90%', justifyContent: 'space-between', alignItems: 'center'}}>
              <TextInput
                style={styles.input}
                placeholder="Escreva sua Mensagem..."
                placeholderTextColor="#A7A7A7"
                value={campoMensagemImg}
                onChangeText={setCampoMensagemImg}
              />
            </View>
            <View style={{width: '10%', justifyContent: 'space-between', alignItems: 'center'}}>
              <TouchableOpacity onPress={!isCanal ? () => enviarMensagemFoto() : ''}>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fff",
    elevation: 2,
  },
  headerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  viewCabecalho:{
    width: '100%',
    flexDirection: 'row'

  },
  nome: {
    fontWeight: "bold",
    fontSize: 14,
  },
  rowNomeSeguir:{
        flexDirection: 'row',
        width: '90%',
        alignItems: 'center',
         justifyContent: 'space-between'
      },
      viewBotaoSeguir:{
        width: '100%',
        paddingRight: 40,
        justifyContent: 'flex-end',
        alignItems: 'center'
      },
      botaoSeguir:{
        padding: 7,
        width: 80,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.azul,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: colors.azul
      },
      botaoSeguido:{
        padding: 7,
        width: 80,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.preto,
        flexDirection: 'row'
      },
      textSeguir:{
        color: colors.branco
      },
  usuario: {
    fontSize: 12,
    color: "#666",
  },
  iconSmall: {
    width: 22,
    height: 22,
    marginHorizontal: 6,
  },
  chatContent: {
    padding: 16,
  },
  mensagemRecebida: {
    alignSelf: "flex-start",
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    padding: 4,
    marginBottom: 10,
    maxWidth: "75%",
    shadowColor: colors.preto,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 2

  },
  mensagemEnviada: {
    alignSelf: "flex-end",
    backgroundColor: colors.msgEnviador,
    padding: 4,
    borderRadius: 8,
    marginBottom: 10,
    maxWidth: "75%",
  },
  viewTextoMsg: {
    padding: 3,
  },
  imgMensagem: {
    width: "100%",
    aspectRatio: 3 / 4,
    height: 300,
    borderRadius: 6,
    marginBottom: 3,
  },
  textoMsgEnviado: { color: colors.branco, fontSize: 14 },
  textoMsgRecebido: { color: colors.preto, fontSize: 14 },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#efefef",
    justifyContent: 'space-between',

    padding: 4,
    margin: 16,
    borderRadius: 16,
  },
  inputContainerModal: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between',
    backgroundColor: "#efefef",
    padding: 4,
    margin: 16,
    borderRadius: 16,
    width: '100%'
  },
  input: {
    fontSize: 14,
    paddingVertical: 4,
    paddingHorizontal: 8,
    color: "#000",
    width: '90%'
  },
  containerModalFoto: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-start",

    backgroundColor: "transparent",
  },
  boxModalFoto: {
    width: "100%",
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.950)',
    shadowColor: colors.preto,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    opacity: 1,

  },
  cabecalhoModalFoto: {
    width: "100%",
    flexDirection: "row",
    padding: 6,
  },
  viewImgModalFoto: {
    height: "90%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  fotoModalFoto: {
    width: "100%",
    height: "100%",
  },
  imgModalFoto: {
    width: "100%",
    height: "100%",
  },
  boxMsgModalFoto: {
    position: "absolute",
    bottom: 10,
    left: 5,
    width: "100%",
    height: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  inputModalFoto: {
    shadowColor: colors.preto,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    marginRight: 10,
  },
  boxEnviar: {
    width: 45,
    height: 45,
    borderRadius: "50%",
    backgroundColor: colors.azul,
    justifyContent: "center",
    alignItems: "center",
  },
  
});
