import styles from "./styles";
import React, { useState, useEffect, } from "react";
import {
  Text,
  View,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  Pressable,
  Modal,
  ActivityIndicator,
  

} from "react-native";
import {
  Appbar,
  IconButton,
  Provider as PaperProvider,
  SegmentedButtons,

} from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {useTema} from '../../../../../context/themeContext'
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import host from "../../../../../global";



export default function AddConversa({ route }) {
  const navigation = useNavigation();
  const { idUserLogado } = route.params;
  const [seguidores, setSeguidores] = useState([]);
  const [loading, setLoading] = useState(true);
  const {tema} = useTema();
  const [conexoes, setConexoes] = useState([]);
  const [focoInput, setFocoInput] = useState(false);
  const [visibleCriar, setVisibleCriar] = useState(false);
  const [nomeCanal, setNomeCanal] = useState("");
  const [descricaoCanal, setDescricaoCanal] = useState("");
  const [imagemCanal, setImagemCanal] = useState(null);
  const [idInstituicao, setIdInstituicao] = useState();
  const [sugestoes, setSugestoes] = useState([]);
  const [isInstituicao, setIsInstituicao] = useState()
  const alterarFoco = (campo) => {
    setFocoInput(campo);
  };

  useEffect(() => {
    const selecionarDados = async () => {
      try {

        const resposta = await axios.get(
          `http://${host}:8000/api/cursei/chat/adicionarChat/${idUserLogado}`
        );
        const respostaConexoes = await axios.get(
          `http://${host}:8000/api/cursei/chat/adicionarChat/conexoes/${idUserLogado}`
        );
        const respostaSugestoes = await axios.get(
          `http://${host}:8000/api/cursei/chat/adicionarChat/sugestoes/${idUserLogado}`
        );
        const idInst = await AsyncStorage.getItem("idInstituicao");
        setIdInstituicao(idInst);
        console.log(resposta);
        console.log(idInst)
        setSeguidores(resposta.data.seguidores);
        setConexoes(respostaConexoes.data.conexoes);
        setSugestoes(respostaSugestoes.data.sugestoes)
        console.log(respostaConexoes)
      } catch (e) {
        console.log(e)
      } finally {
        setTimeout(() => {
          setLoading(false)
        }, 1500)
      }
    };
    selecionarDados();
  }, []);
  useEffect(() => {
    const verificarInstituicao = async () => {

      const idInstituicao = await AsyncStorage.getItem('idInstituicao');
      console.log('idInstituicao', idInstituicao)
      setIsInstituicao(idInstituicao)

    }
    verificarInstituicao()
  }, [])

  const irParaConversa = async (idSeguidor, idSeguido, isConexao) => {
    try {
      const resposta = await axios.get(
        `http://${host}:8000/api/cursei/chat/adicionarChat/${idUserLogado}/${idSeguidor}`
      );
      const chatExistente = isConexao
        ? conexoes
        : resposta.data.seguidor;
      const idChatExistente = chatExistente ? chatExistente.id_chat : null;
      const usuario = seguidores.find(
        (user) =>
          user.id_seguidor === idSeguidor && user.id_seguido === idSeguido
      );
      console.log(chatExistente)
      const dadosChat = {
        idUser1: idUserLogado,
        idUser2: idSeguidor,
      };

      let idChatFinal = idChatExistente;

      if (!idChatExistente) {
        const inserirDados = await axios.post(
          `http://${host}:8000/api/cursei/chat/adicionarChat/`,
          dadosChat
        );
        idChatFinal = inserirDados.data.id_chat;
      }
      console.log(idUserLogado);

      navigation.navigate("Conversa", {
        idUserLogado: idUserLogado,
        idEnviador: idSeguido,
        imgEnviador: chatExistente.img_seguidor,
        nomeEnviador: chatExistente.nome_seguidor,
        arrobaEnviador: chatExistente.arroba_seguidor,
        idChat: idChatFinal,
        isCanal: false
      });
    } catch (error) {
      console.log("Erro ao iniciar conversa:", error);
    }
  };


  const irParaConversaSugestoes = async (idUserSugerido, isConexao) => {
    try {
      const usuario = sugestoes.find(
        (user) =>
          user.id === idUserSugerido
      );

      console.log(usuario, 'usuario ID', usuario.id, 'usuairo sugerido', idUserSugerido)
      const dadosChat = {
        idUser1: idUserLogado,
        idUser2: idUserSugerido,
      };
      const idChatExistente = usuario.id_chat ? usuario.id_chat : null;

      let idChatFinal = idChatExistente;

      if (!idChatExistente) {
        const inserirDados = await axios.post(
          `http://${host}:8000/api/cursei/chat/adicionarChat/`,
          dadosChat
        );
        idChatFinal = inserirDados.data.id_chat;
      }
      console.log(idChatFinal);

      navigation.navigate("Conversa", {
        idUserLogado: idUserLogado,
        idEnviador: idUserLogado,
        imgEnviador: usuario.img_seguidor,
        nomeEnviador: usuario.nome_seguidor,
        arrobaEnviador: usuario.arroba_seguidor,
        idChat: idChatFinal,
        isCanal: false
      });
    } catch (error) {
      console.log("Erro ao iniciar conversa:", error);
    }
  };

  const modalCriacaoCanal = async () => {
    setVisibleCriar(true);
  };
  const criarCanal = async () => {
    const canal = new FormData();

    if (imagemCanal.startsWith("data:image")) {
      const resposta = await fetch(imagemCanal);
      const blob = await resposta.blob();

      const nomeArquivo = `image_${Date.now()}.jpg`;

      const arquivo = new File([blob], nomeArquivo, { type: blob.type });

      canal.append("imgCanal", arquivo);
    }

    const url = `http://${host}:8000/api/cursei/chat/criarCanal`;

    canal.append("nomeCanal", nomeCanal);
    canal.append("descricaoCanal", descricaoCanal);
    canal.append("userCriador", idUserLogado);
    try {
      const resposta = await axios.post(url, canal, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(resposta);
    } catch (e) {
      console.error(e);
    }
  };

    const selecionarFotoCanal = async () => {
      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

    if (!resultado.canceled) {
      const uri = resultado.assets[0].uri;
      setImagemCanal(uri);
    }
  };

  

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <View style={[styles.container, { backgroundColor: tema.fundo }]}>
          <Appbar.Header style={[styles.header, { backgroundColor: tema.fundo }]}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={require("../../img/voltar.png")}
                style={styles.iconSmall}
              />
            </TouchableOpacity>
            <Appbar.Content
              title="Nova Mensagem"
              titleStyle={{ color: tema.texto, fontWeight: "600", fontSize: 20 }}
            />
          </Appbar.Header>
  
          <View style={[styles.customSearchbar, { backgroundColor: tema.cinza }]}>
            <Image
              source={require("../../img/search.png")}
              style={styles.searchIcon}
            />
            <TextInput
              placeholder="Buscar Usuario..."
              placeholderTextColor={tema.descricao}
              onFocus={() => alterarFoco("buscar")}
              underlineColorAndroid="transparent"
              style={[
                styles.customSearchInput,
                { color: tema.texto },
                focoInput === "buscar" && {
                  borderWidth: 0,
                  borderColor: "transparent",
                },
              ]}
            />
          </View>
  
          {isInstituicao !== '0' && (
            <View>
              {loading && (
                <View style={{ flex: 1, paddingTop: 50, justifyContent: 'flex-start', alignItems: 'center', backgroundColor: tema.fundo, zIndex: 99, width: '100%', height: '100%' }}>
                  <ActivityIndicator size="large" color={tema.azul} />
                </View>
              )}
              <View style={styles.containerAddGrupo}>
                <TouchableOpacity
                  style={[styles.boxAddGrupo, { paddingTop: 7, backgroundColor: tema.fundo }]}
                  onPress={() => modalCriacaoCanal()}
                >
                  <View style={styles.conteudoIcone}>
                    <View style={[styles.boxIcone, { backgroundColor: tema.fundo }]}>
                      <Icon style={[styles.iconeAdd, { color: tema.icone }]} name="chat-plus-outline" />
                    </View>
                  </View>
                  <View style={styles.conteudoTexto}>
                    <Text style={{ fontWeight: "500", color: tema.texto }}>
                      Adicionar Novo Canal
                    </Text>
                    <Text style={{ fontSize: 12, color: tema.descricao, paddingRight: 30 }}>
                      Adicione uma nova conversa ao seu Bate Papo!
                      {isInstituicao}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
  
              <View style={styles.containerAddUsuario}>
                <View style={{ width: "100%", paddingLeft: 25 }}>
                  <Text style={{ fontWeight: "500", color: tema.texto }}>Seguidores</Text>
                </View>
                <FlatList
                  data={seguidores}
                  keyExtractor={(item) => item.id_seguidor}
                  style={styles.containerSeguidores}
                  renderItem={({ item }) => (
                    <View style={styles.flatlistSeguidores}>
                      <TouchableOpacity
                        onPress={() => irParaConversa(item.id_seguidor, item.id_seguido, false)}
                      >
                        <View style={[styles.boxAddUsuario, { backgroundColor: tema.fundo }]}>
                          <View style={[styles.conteudoIcone, { marginRight: 8 }]}>
                            <View style={styles.boxIcone}>
                              <Image
                                style={styles.imgUsuario}
                                source={{
                                  uri: `http://${host}:8000/img/user/fotoPerfil/${item.img_seguidor}`,
                                }}
                              />
                            </View>
                          </View>
                          <View style={styles.conteudoTexto}>
                            <Text style={{ fontWeight: "500", color: tema.texto }}>
                              {item.nome_seguidor}
                            </Text>
                            <Text style={{ fontSize: 12, color: tema.descricao }}>
                              @{item.arroba_seguidor}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}
                  ListEmptyComponent={
                    <View style={{ padding: 20, alignItems: 'center' }}>
                      <Text style={{ color: tema.descricao }}>Nenhum Seguidor encontrado.</Text>
                    </View>
                  }
                />
                <View style={{ width: "100%", paddingLeft: 25 }}>
                  <Text style={{ fontWeight: "500", color: tema.texto }}>Sugestões</Text>
                </View>
                <FlatList
                  data={sugestoes}
                  keyExtractor={(item) => item.id}
                  style={styles.containerSeguidores}
                  renderItem={({ item }) => (
                    <View style={styles.flatlistSeguidores}>
                      <TouchableOpacity onPress={() => irParaConversaSugestoes(item.id, false)}>
                        <View style={[styles.boxAddUsuario, { backgroundColor: tema.fundo}]}>
                          <View style={[styles.conteudoIcone, { marginRight: 8 }]}>
                            <View style={styles.boxIcone}>
                              <Image
                                style={styles.imgUsuario}
                                source={{
                                  uri: `http://${host}:8000/img/user/fotoPerfil/${item.img_seguidor}`,
                                }}
                              />
                            </View>
                          </View>
                          <View style={styles.conteudoTexto}>
                            <Text style={{ fontWeight: "500", color: tema.texto }}>
                              {item.nome_seguidor}
                            </Text>
                            <Text style={{ fontSize: 12, color: tema.descricao }}>
                              @{item.arroba_seguidor}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}
                  ListEmptyComponent={
                    <View style={{ padding: 20, alignItems: 'center' }}>
                      <Text style={{ color: tema.descricao }}>Nenhuma Sugestão Encontrada.</Text>
                    </View>
                  }
                />
              </View>
            </View>
          )}
  
          {isInstituicao === '0' && (
            <View>
              {loading && (
                <View style={{ flex: 1, paddingTop: 50, justifyContent: 'flex-start', alignItems: 'center', backgroundColor: tema.fundo, position: 'fixed', zIndex: 99, width: '100%', height: '100%' }}>
                  <ActivityIndicator size="large" color={tema.azul} />
                </View>
              )}
              <View style={styles.containerAddUsuario}>
                <View style={{ width: "100%", paddingLeft: 25 }}>
                  <Text style={{ fontWeight: "500", color: tema.texto }}>Conexões</Text>
                </View>
                <FlatList
                  data={conexoes}
                  keyExtractor={(item) => item.id_seguidor ? item.id_seguidor : item.id}
                  style={styles.containerSeguidores}
                  renderItem={({ item }) => (
                    <View style={styles.flatlistSeguidores}>
                      <TouchableOpacity onPress={() => irParaConversa(item.id_seguidor, item.id_seguido, true)}>
                        <View style={[styles.boxAddUsuario, { backgroundColor: tema.fundo }]}>
                          <View style={[styles.conteudoIcone, { marginRight: 8 }]}>
                            <View style={styles.boxIcone}>
                              <Image
                                style={styles.imgUsuario}
                                source={{
                                  uri: `http://${host}:8000/img/user/fotoPerfil/${item.img_seguidor}`,
                                }}
                              />
                            </View>
                          </View>
                          <View style={styles.conteudoTexto}>
                            <Text style={{ fontWeight: "500", color: tema.texto }}>
                              {item.nome_seguidor}
                            </Text>
                            <Text style={{ fontSize: 12, color: tema.descricao }}>
                              @{item.arroba_seguidor}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}
                  ListEmptyComponent={
                    <View style={{ padding: 20, height: 200, alignItems: 'center' }}>
                      <Text style={{ color: tema.descricao }}>Nenhuma Conexão Encontrada.</Text>
                    </View>
                  }
                />
                <View style={{ width: "100%", paddingLeft: 25 }}>
                  <Text style={{ fontWeight: "500", color: tema.texto }}>Sugestões</Text>
                </View>
                <FlatList
                  data={sugestoes}
                  keyExtractor={(item) => item.id}
                  style={styles.containerSeguidores}
                  renderItem={({ item }) => (
                    <View style={styles.flatlistSeguidores}>
                      <TouchableOpacity onPress={() => irParaConversaSugestoes(item.id, false)}>
                        <View style={[styles.boxAddUsuario, { backgroundColor: tema.fundo }]}>
                          <View style={[styles.conteudoIcone, { marginRight: 8 }]}>
                            <View style={styles.boxIcone}>
                              <Image
                                style={styles.imgUsuario}
                                source={{
                                  uri: `http://${host}:8000/img/user/fotoPerfil/${item.img_seguidor}`,
                                }}
                              />
                            </View>
                          </View>
                          <View style={styles.conteudoTexto}>
                            <Text style={{ fontWeight: "500", color: tema.texto }}>
                              {item.nome_seguidor}
                            </Text>
                            <Text style={{ fontSize: 12, color: tema.descricao }}>
                              @{item.arroba_seguidor}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}
                  ListEmptyComponent={
                    <View style={{ padding: 20, height: 200, alignItems: 'center' }}>
                      <Text style={{ color: tema.descricao }}>Nenhuma Sugestão Encontrada.</Text>
                    </View>
                  }
                />
              </View>
            </View>
          )}
        </View>
      </PaperProvider>
  
      <Modal style={styles.containerModal} visible={visibleCriar} animationType="slide">
        <View style={[styles.containerModal, { backgroundColor: tema.modalFundo }]}>
          <View style={[styles.headerModal, { backgroundColor: tema.barra }]}>
            <TouchableOpacity onPress={() => setVisibleCriar(false)}>
              <Image
                source={require("../../img/voltar.png")}
                style={styles.iconSmall}
              />
            </TouchableOpacity>
            <Text style={[styles.titPag, { color: tema.texto }]}>Novo Canal</Text>
          </View>
          <View style={styles.containerImgCanal}>
            <View style={styles.boxImgCanal}>
              <Pressable style={styles.viewFotoCanal} onPress={() => selecionarFotoCanal()}>
                <Image
                  style={styles.imgCanal}
                  resizeMode="cover"
                  source={
                    imagemCanal
                      ? { uri: imagemCanal }
                      : require("../../../../../../assets/jovem.jpeg")
                  }
                />
              </Pressable>
              <Text style={[styles.textMudarImg, { color: tema.azul }]}>Mudar Imagem</Text>
            </View>
          </View>
          <View style={styles.boxInputs}>
            <View style={styles.inputContainer}>
              <Ionicons style={[styles.inputIcon, { color: tema.icone }]} name="megaphone" />
              <TextInput
                style={[styles.input, { height: 30, color: tema.texto }]}
                placeholder="Digite o nome do Canal"
                placeholderTextColor={tema.descricao}
                value={nomeCanal}
                onChangeText={setNomeCanal}
                autoCapitalize="none"
              />
            </View>
            <View style={[styles.inputContainer, { alignItems: "flex-start", height: 80 }]}>
              <Ionicons style={[styles.inputIcon, { color: tema.icone }]} name="newspaper" />
              <TextInput
                style={[styles.input, { color: tema.texto }]}
                placeholder="Digite uma Descrição"
                placeholderTextColor={tema.descricao}
                value={descricaoCanal}
                onChangeText={setDescricaoCanal}
                multiline
                autoCapitalize="none"
              />
            </View>
            <TouchableOpacity
              style={[styles.botaoCriarCanal, { backgroundColor: tema.azul }]}
              onPress={() => criarCanal()}
            >
              <Text style={[styles.botaoCriarCanalText, { color: tema.textoBotao }]}>
                Criar Canal
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaProvider>
  );
                }  