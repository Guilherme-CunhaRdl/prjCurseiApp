import styles from "./styles";
import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Modal,
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
import colors from "../../../../../colors";
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AddConversa({ route }) {
  const navigation = useNavigation();
  const { idUserLogado } = route.params;
  const [seguidores, setSeguidores] = useState([]);

  const [conexoes, setConexoes] = useState([]);
  const [focoInput, setFocoInput] = useState(false);
  const [visibleCriar, setVisibleCriar] = useState(false);
  const [nomeCanal, setNomeCanal] = useState("");
  const [descricaoCanal, setDescricaoCanal] = useState("");
  const [imagemCanal, setImagemCanal] = useState(null);
  const [idInstituicao, setIdInstituicao] = useState();
  const [sugestoes, setSugestoes] = useState([]);
  const alterarFoco = (campo) => {
    setFocoInput(campo);
  };

  useEffect(() => {
    const selecionarDados = async () => {
      const resposta = await axios.get(
        `http://localhost:8000/api/cursei/chat/adicionarChat/${idUserLogado}`
      );
      const respostaConexoes = await axios.get(
        `http://localhost:8000/api/cursei/chat/adicionarChat/conexoes/${idUserLogado}`
      );
      const respostaSugestoes = await axios.get(
        `http://localhost:8000/api/cursei/chat/adicionarChat/sugestoes/${idUserLogado}`
      );
      const idInst = await AsyncStorage.getItem("idInstituicao");

      setIdInstituicao(idInst);
      console.log(resposta);
      setSeguidores(resposta.data.seguidores);
      setConexoes(respostaConexoes.data.conexoes);
      setSugestoes(respostaSugestoes.data.sugestoes)
      console.log(respostaSugestoes)

    };

    selecionarDados();
  }, []);

  const irParaConversa = async (idSeguidor, idSeguido, isConexao) => {
    try {
      const resposta = await axios.get(
        `http://localhost:8000/api/cursei/chat/adicionarChat/${idUserLogado}/${idSeguidor}`
      );
      const respostaConexoes = await axios.get(
        `http://localhost:8000/api/cursei/chat/adicionarChat/conexoes/${idUserLogado}`
      );
      const respostaSugestoes = await axios.get(
        `http://localhost:8000/api/cursei/chat/adicionarChat/sugestoes/${idUserLogado}`
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
        idUser1: idSeguido,
        idUser2: idSeguidor,
      };

      let idChatFinal = idChatExistente;

      if (!idChatExistente) {
        const inserirDados = await axios.post(
          `http://localhost:8000/api/cursei/chat/adicionarChat/`,
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
        isCanal:false
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
      console.log(usuario)
      const dadosChat = {
        idUser1: idUserLogado,
        idUser2: idUserSugerido,
      };
      const idChatExistente = usuario ? usuario.id_chat : null;

      let idChatFinal = idChatExistente;

      if (!usuario.id_chat) {
        const inserirDados = await axios.post(
          `http://localhost:8000/api/cursei/chat/adicionarChat/`,
          dadosChat
        );
        idChatFinal = inserirDados.data.id_chat;
      }
      console.log(idUserLogado);

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

    const url = `http://127.0.0.1:8000/api/cursei/chat/criarCanal`;

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
        <View style={styles.container}>
          <Appbar.Header style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={require("../../img/voltar.png")}
                style={styles.iconSmall}
              />
            </TouchableOpacity>
            <Appbar.Content
              title="Nova Mensagem"
              titleStyle={{ color: "black", fontWeight: 600, fontSize: 20 }}
            />
          </Appbar.Header>

          <View style={styles.customSearchbar}>
            <Image
              source={require("../../img/search.png")}
              style={styles.searchIcon}
            />
            {/*Barra de pesquisa que troquei pq o do Paper é chei de viadage pra personalizar*/}
            <TextInput
              placeholder="Buscar Usuario..."
              placeholderTextColor="#A7A7A7"
              onFocus={() => alterarFoco("buscar")}
              underlineColorAndroid="transparent"
              style={[
                styles.customSearchInput,
                focoInput === "buscar" && {
                  borderWidth: 0,
                  borderColor: "transparent",
                },
              ]}
            />
          </View>
          {idUserLogado == idInstituicao && (
            <ScrollView>
              <View style={styles.containerAddGrupo}>
                <View style={styles.boxAddGrupo}>
                  <View style={styles.conteudoIcone}>
                    <View style={styles.boxIcone}>
                      <Icon style={styles.iconeAdd} name="chat-plus-outline" />
                    </View>
                  </View>
                  <View style={styles.conteudoTexto}>
                    <TouchableOpacity
                      style={{ paddingTop: 7 }}
                      onPress={() => modalCriacaoCanal()}
                    >
                      <Text style={{ fontWeight: 500 }}>
                        Adicionar Novo Canal
                      </Text>
                    </TouchableOpacity>
                    <View>
                      <Text
                        style={{
                          fontSize: 12,
                          color: colors.cinza,
                          paddingRight: 30,
                        }}
                      >
                        Adicione uma nova conversa ao seu Bate Papo!
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.containerAddUsuario}>
                <View style={{ width: "100%", paddingLeft: 25 }}>
                  <Text style={{ fontWeight: 500 }}>Seguidores</Text>
                </View>
                <FlatList
                  data={seguidores}
                  keyExtractor={(item) => item.id_seguidor}
                  style={styles.containerSeguidores}
                  renderItem={({ item }) => (
                    <View style={styles.flatlistSeguidores}>
                      <TouchableOpacity
                        onPress={() =>
                          irParaConversa(
                            item.id_seguidor,
                            item.id_seguido,
                            false
                          )
                        }
                      >
                        <View style={styles.boxAddUsuario}>
                          <View
                            style={[styles.conteudoIcone, { marginRight: 8 }]}
                          >
                            <View style={styles.boxIcone}>
                              <Image
                                style={styles.imgUsuario}
                                source={{
                                  uri: `http://localhost:8000/img/user/fotoPerfil/${item.img_seguidor}`,
                                }}
                              />
                            </View>
                          </View>
                          <View style={styles.conteudoTexto}>
                            <View style={{ paddingTop: 7 }}>
                              <Text style={{ fontWeight: 500 }}>
                                {item.nome_seguidor}
                              </Text>
                            </View>
                            <View>
                              <Text
                                style={{ fontSize: 12, color: colors.cinza }}
                              >
                                @{item.arroba_seguidor}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}
                />

                <View style={styles.containerAddUsuario}>
                <View style={{ width: "100%", paddingLeft: 25 }}>
                  <Text style={{ fontWeight: 500 }}>Sugestões</Text>
                </View>
                <FlatList
                  data={sugestoes}
                  keyExtractor={(item) => item.id_seguidor ? item.id_seguidor : item.id}
                  style={styles.containerSeguidores}
                  renderItem={({ item }) => (
                    <View style={styles.flatlistSeguidores}>
                      <TouchableOpacity
                        onPress={() =>
                          irParaConversaSugestoes(
                            item.id,
                            false
                          )
                        }
                      >
                        <View style={styles.boxAddUsuario}>
                          <View
                            style={[styles.conteudoIcone, { marginRight: 8 }]}
                          >
                            <View style={styles.boxIcone}>
                              <Image
                                style={styles.imgUsuario}
                                source={{
                                  uri: `http://localhost:8000/img/user/fotoPerfil/${item.img_seguidor}`,
                                }}
                              />
                            </View>
                          </View>
                          <View style={styles.conteudoTexto}>
                            <View style={{ paddingTop: 7 }}>
                              <Text style={{ fontWeight: 500 }}>
                                {item.nome_seguidor}
                              </Text>
                            </View>
                            <View>
                              <Text
                                style={{ fontSize: 12, color: colors.cinza }}
                              >
                                @{item.arroba_seguidor}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}
                />
                </View>
              </View>
            </ScrollView>
          )}
          {idUserLogado != idInstituicao && (
            <View>
              <View style={styles.containerAddUsuario}>
                <View style={{ width: "100%", paddingLeft: 25 }}>
                  <Text style={{ fontWeight: 500 }}>Conexões</Text>
                </View>
                <FlatList
                  data={conexoes}
                  keyExtractor={(item) => item.id_seguidor ? item.id_seguidor : item.id}
                  style={styles.containerSeguidores}
                  renderItem={({ item }) => (
                    <View style={styles.flatlistSeguidores}>
                      <TouchableOpacity
                        onPress={() =>
                          irParaConversaSugestoes(
                            item.id,
                            false
                            
                          )
                        }
                      >
                        <View style={styles.boxAddUsuario}>
                          <View
                            style={[styles.conteudoIcone, { marginRight: 8 }]}
                          >
                            <View style={styles.boxIcone}>
                              <Image
                                style={styles.imgUsuario}
                                source={{
                                  uri: `http://localhost:8000/img/user/fotoPerfil/${item.img_seguidor}`,
                                }}
                              />
                            </View>
                          </View>
                          <View style={styles.conteudoTexto}>
                            <View style={{ paddingTop: 7 }}>
                              <Text style={{ fontWeight: 500 }}>
                                {item.nome_seguidor}
                              </Text>
                            </View>
                            <View>
                              <Text
                                style={{ fontSize: 12, color: colors.cinza }}
                              >
                                @{item.arroba_seguidor}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}
                />

                 <View style={{ width: "100%", paddingLeft: 25 }}>
                  <Text style={{ fontWeight: 500 }}>Sugestões</Text>
                </View>
                <FlatList
                  data={sugestoes}
                  keyExtractor={(item) => item.id_seguidor}
                  style={styles.containerSeguidores}
                  renderItem={({ item }) => (
                    <View style={styles.flatlistSeguidores}>
                      <TouchableOpacity
                        onPress={() =>
                          irParaConversa(
                            item.id_seguidor,
                            item.id_seguido,
                            
                          )
                        }
                      >
                        <View style={styles.boxAddUsuario}>
                          <View
                            style={[styles.conteudoIcone, { marginRight: 8 }]}
                          >
                            <View style={styles.boxIcone}>
                              <Image
                                style={styles.imgUsuario}
                                source={{
                                  uri: `http://localhost:8000/img/user/fotoPerfil/${item.img_seguidor}`,
                                }}
                              />
                            </View>
                          </View>
                          <View style={styles.conteudoTexto}>
                            <View style={{ paddingTop: 7 }}>
                              <Text style={{ fontWeight: 500 }}>
                                {item.nome_seguidor}
                              </Text>
                            </View>
                            <View>
                              <Text
                                style={{ fontSize: 12, color: colors.cinza }}
                              >
                                @{item.arroba_seguidor}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}
                />
              </View>
            </View>
          )}
        </View>
      </PaperProvider>
      <Modal
        style={styles.containerModal}
        visible={visibleCriar}
        animationType="slide"
      >
        <View style={styles.containerModal}>
          <View style={styles.headerModal}>
            <TouchableOpacity onPress={() => setVisibleCriar(false)}>
              <Image
                source={require("../../img/voltar.png")}
                style={styles.iconSmall}
              />
            </TouchableOpacity>
            <Text style={styles.titPag}>Novo Canal</Text>
          </View>
          <View style={styles.containerImgCanal}>
            <View style={styles.boxImgCanal}>
              <Pressable
                style={styles.viewFotoCanal}
                onPress={() => selecionarFotoCanal()}
              >
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
              <View>
                <Text style={styles.textMudarImg}>Mudar Imagem</Text>
              </View>
            </View>
          </View>
          <View style={styles.boxInputs}>
            <View
              style={[
                styles.inputContainer,
              ]}
            >
              <Ionicons style={styles.inputIcon} name="megaphone" />
              <TextInput
                style={[styles.input, { height: 30 }]}
                placeholder="Digite o nome do Canal"
                value={nomeCanal}
                onChangeText={(texto) => {
                  setNomeCanal(texto);
                }}
                autoCapitalize="none"
              />
            </View>
            <View
              style={[
                styles.inputContainer,
                { alignItems: "flex-start", height: 80 },
              ]}
            >
              <Ionicons style={styles.inputIcon} name="newspaper" />
              <TextInput
                style={[styles.input]}
                placeholder="Digite uma Descrição"
                value={descricaoCanal}
                multiline
                onChangeText={(texto) => {
                  setDescricaoCanal(texto);
                }}
                autoCapitalize="none"
              />
            </View>
            <TouchableOpacity
              style={styles.botaoCriarCanal}
              onPress={() => criarCanal()}
            >
              <Text style={styles.botaoCriarCanalText}>Criar Canal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaProvider>
  );
}
