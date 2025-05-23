import React, { useState, useEffect, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  Pressable,
  Modal,
  ScrollView,
} from "react-native";
import {
  Appbar,
  IconButton,
  Provider as PaperProvider,
} from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Pusher from "pusher-js/react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import colors from "../../../../../colors";

export default function Mensagens() {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState("todas");
  const [conversas, setConversas] = useState([]);
  const [chats, setChats] = useState([]);
  const [idChat,setIdChat] = useState()
  const [idUser, setIdUser] = useState(null);
  const [IsVisto, setIsVisto] = useState();
  const [resultadosUsuarios, setResultadosUsuarios] = useState([]);
  const [mostrarResultadosPesquisa, setMostrarResultadosPesquisa] = useState(false);
const [query, setQuery] = useState("");
  const [chatsPesquisados, setChatsPesquisados] = useState([]);



  const listarChats = async (userId) => {
    console.log(userId);

    try {
      const [resposta, respostaCanais, respostaInstituicao] = await Promise.all(
        [
          axios.get(
            `http://localhost:8000/api/cursei/chat/recebidor/${userId}/todas`
          ),
          axios.get(
            `http://localhost:8000/api/cursei/chat/selecionarCanal/pegarTodos/${userId}`
          ),
          axios.get(
            `http://localhost:8000/api/cursei/chat/recebidor/${userId}/instituicao`
          ),
        ]
      );

      const conversasUnicas = new Map();
     
      resposta.data.chats.forEach((chat) => {
        const key = `chat_${chat.id_chat}_${chat.id_mensagem}`;
        if (!conversasUnicas.has(key)) {
          conversasUnicas.set(key, { ...chat, tipo: "chat" });
        }
      });

      
      respostaCanais.data.canais.forEach((canal) => {
        const key = `canal_${canal.id_canal}`;
        if (!conversasUnicas.has(key)) {
          conversasUnicas.set(key, { ...canal, tipo: "canal" });
        }
      });
      console.log(respostaCanais)
      
      respostaInstituicao.data.instituicoes.forEach((instituicao) => {
        const key = `instituicao_${instituicao.id_instituicao}_${
          instituicao.id_mensagem_instituicao || ""
        }`;
        if (!conversasUnicas.has(key)) {
          conversasUnicas.set(key, { ...instituicao, tipo: "instituicao" });
        }
      });
      const conversasFinal =  Array.from(conversasUnicas.values());
      setConversas(conversasFinal);
      return conversasFinal;
    } catch (error) {
      console.error("Erro ao buscar mensagens:", error);
    }
  };

  useEffect(() => {
    const inicializar = async () => {
      const id = await AsyncStorage.getItem("idUser");
      setIdUser(id);
      if (id) {
        
        const chats = await listarChats(id);
        conectarCanal(chats);
      }
    };

    inicializar();
  }, []);


  const conectarCanal = async (chats) => {
    const pusher = new Pusher("yls40qRApouvChytA220SnHKQViSXBCs", {
      cluster: "mt1",
      wsHost: "127.0.0.1",
      wsPort: 6001,
      forceTLS: false,
      enabledTransports: ["ws"],
      authEndpoint: "http://127.0.0.1:8000/broadcasting/auth",
      auth: {
        headers: {
          Authorization: "Bearer SEU_TOKEN_AQUI",
        },
      },
    });
    console.log(chats)
      chats.forEach((chat) =>{
    const canal = pusher.subscribe(`trazer_chats.${chat.id_chat}`);

    canal.bind("chats", (data) => {
      const novaMensagem = data.msgs[0];
      console.log(data);

      setConversas((prevChats) => {
        const chatExistente = prevChats.find(
          (c) => c.id_chat === novaMensagem.id_chat
        );
        if (chatExistente) {
          return prevChats.map((chat) =>
            chat.id_chat === novaMensagem.id_chat
              ? {
                  ...chat,
                  ultima_mensagem: novaMensagem.ultima_mensagem,
                  foto_enviada: novaMensagem.foto_enviada,
                  status_mensagem: novaMensagem.status_mensagem,
                }
              : chat
          );
        } else {
          return [novaMensagem, ...prevChats];
        }
      });

      setChatsPesquisados((prevPesquisados) => {
        if (!prevPesquisados || prevPesquisados.length === 0) {
          return prevPesquisados;
        }
        const chatExistente = prevPesquisados.find(
          (c) => c.id_chat === novaMensagem.id_chat
        );
        if (chatExistente) {
          return prevPesquisados.map((chat) =>
            chat.id_chat === novaMensagem.id_chat
              ? {
                  ...chat,
                  ultima_mensagem: novaMensagem.ultima_mensagem,
                  foto_enviada: novaMensagem.foto_enviada,
                  status_mensagem: novaMensagem.status_mensagem,
                }
              : chat
          );
        } else {
           assinarCanal(novaMensagem.id_chat);
          return [novaMensagem, ...prevPesquisados];
        }
      });
      if (novaMensagem.status_chat === 1) {
        setIsVisto(true);
      } else {
        setIsVisto(false);
      }
    });
  })
   const assinarCanal = (id_chat) => {
  const canal = pusher.subscribe(`trazer_chats.${id_chat}`);
  canal.bind("chats");
};

// Quando iniciar a tela, assina todos os canais dos chats já existentes
chats.forEach((chat) => {
  assinarCanal(chat.id_chat);
}) 
  
};

  
  
  const procurarChat = async (userId) => {
    try {
      if (query.trim() === "") {
        setConversasFiltradas(conversas);
        return;
      }

      const response = await axios.get(
        `http://localhost:8000/api/cursei/chat/pesquisa/${query}/${userId}`
      );

      
      const resultadosComTipo = response.data.chats.map((chat) => ({
        ...chat,
        tipo: "chat",
      }));

      setConversasFiltradas(resultadosComTipo);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const pesquisarUsuarios = async (query, userId) => {
    if (query.trim() === "") {
      setResultadosUsuarios([]);
      setMostrarResultadosPesquisa(false);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8000/api/cursei/chat/pesquisa/${query}/${userId}`
      );
      setResultadosUsuarios(response.data.chats);
      setMostrarResultadosPesquisa(true);
    } catch (error) {
      console.error("Erro ao pesquisar usuários:", error);
      setResultadosUsuarios([]);
    }
  };

  useEffect(() => {
    if (query.length > 0 && idUser) {
      const contador = setTimeout(() => {
        procurarChat(idUser);
        pesquisarUsuarios(query, idUser);
      }, 500);

      return () => clearTimeout(contador);
    } else {
      setChatsPesquisados([]);
      setResultadosUsuarios([]);
      setMostrarResultadosPesquisa(false);
    }
  }, [query, idUser]);

  const conversasFiltradas = useMemo(() => {
    return conversas?.filter((item) => {
      if (selectedTab === "todas") return true;
      if (selectedTab === "canais") return item.tipo === "canal";
      if (selectedTab === "instituicoes") return item.tipo === "instituicao";
      return true;
    });
  }, [conversas, selectedTab]);

  const getImageSource = (item) => {
    if (item.img_enviador) {
      return {
        uri: `http://127.0.0.1:8000/img/user/fotoPerfil/${item.img_enviador}`,
      };
    } else if (item.img_canal) {
      return {
        uri: `http://127.0.0.1:8000/img/chat/imgCanal/${item.img_canal}`,
      };
    } else if (item.img_instituicao) {
      return {
        uri: `http://127.0.0.1:8000/img/instituicao/${item.img_instituicao}`,
      };
    } else {
      return require("../../img/metalbat.jpg");
    }
  };
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <View style={styles.container}>
          <Appbar.Header style={styles.Header}>
            <Appbar.Content
              title="Mensagens"
              titleStyle={{ color: "black", fontWeight: 600 }}
            />
            <IconButton
              icon={() => (
                <Image
                  source={require("../../img/adicionarIcon.png")}
                  style={{ height: 32, width: 32 }}
                  resizeMode="contain"
                />
              )}
              onPress={() =>
                navigation.navigate("AddConversa", { idUserLogado: idUser })
              }
            />
          </Appbar.Header>

          <View style={styles.customSearchbar}>
            <Image
              source={require("../../img/search.png")}
              style={styles.searchIcon}
            />
            {/*Barra de pesquisa que troquei pq o do Paper é chei de viadage pra personalizar*/}
            <TextInput
              placeholder="Buscar Conversas..."
              placeholderTextColor="#A7A7A7"
              value={query}
              onChangeText={setQuery}
              style={styles.customSearchInput}
              onFocus={() => query.length > 0 && setMostrarResultadosPesquisa(true)}
            />
          </View>

          <View style={{ marginTop: 32, marginBottom: 8 }}>
            {/* mesma coisa aqui, antes era o SegmentedButtons do Paper, mas a personalização é toda fudida, ai troquei*/}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 16,
                gap: 52,
                justifyContent: "center",
                flexGrow: 1,
                marginLeft: 10,
              }}
            >
              {[
                { label: "Todas", value: "todas" },
                { label: "Canais", value: "canais" },
                { label: "Instituições", value: "instituicoes" },
              ].map((tab) => {
                const isSelected = selectedTab === tab.value;

                return (
                  <Pressable
                    key={tab.value}
                    onPress={() => setSelectedTab(tab.value)}
                    style={[
                      {
                        paddingBottom: 8,
                        borderBottomWidth: 2,
                        borderBottomColor: isSelected
                          ? "#448fff"
                          : "transparent",
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color: isSelected ? "#448fff" : "#ACACAC",
                        fontWeight: isSelected ? 600 : "normal",
                        fontSize: 18,
                      }}
                    >
                      {tab.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
          {!mostrarResultadosPesquisa && (
            <FlatList
              data={conversasFiltradas}
              keyExtractor={(item) => {
                if (item.tipo === "chat")
                  return `chat_${item.id_chat}_${item.id_mensagem}`;
                if (item.tipo === "canal") return `canal_${item.id_canal}`;
                if (item.tipo === "instituicao")
                  return `instituicao_${item.id_instituicao}_${
                    item.id_mensagem_instituicao || ""
                  }`;
                return `item_${Math.random().toString(36).substr(2, 9)}`;
              }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    if (item.tipo === "chat") {
                      navigation.navigate("Conversa", {
                        idUserLogado: idUser,
                        idEnviador: item.id_enviador,
                        imgEnviador: item.img_enviador,
                        nomeEnviador: item.nome_enviador,
                        arrobaEnviador: item.arroba_enviador,
                        idChat: item.id_chat,
                        isCanal: false
                      });
                    } else if (item.tipo === "canal") {
                      navigation.navigate("Conversa", {
                        idUserLogado: idUser,
                        idEnviador: item.id_enviador,
                        imgEnviador: item.img_enviador,
                        nomeEnviador: item.nome_canal,
                        arrobaEnviador: item.arroba_enviador,
                        idChat: item.id_chat,
                        isCanal : true
                      });
                    } else if (item.tipo === "instituicao") {
                      navigation.navigate("Conversa", {
                        idUserLogado: idUser,
                        idEnviador: item.id_enviador,
                        imgEnviador: item.img_enviador,
                        nomeEnviador: item.nome_enviador,
                        arrobaEnviador: item.arroba_enviador,
                        idChat: item.id_chat,
                        isCanal: false

                      });
                    }
                  }}
                  rippleColor="rgba(0, 0, 0, .05)"
                >
                  <View style={styles.mensagemItem}>
                    <Image
                      source={getImageSource(item)}
                      style={styles.avatar}
                    />
                    <View style={styles.mensagemTexto}>
                      <Text style={styles.nome} numberOfLines={1}>
                        {item.nome_canal ||
                        item.nome_enviador ||
                          item.nome_instituicao}
                      </Text>
                      <Text
                        style={[
                          styles.ultimaMensagem,
                          item.status_mensagem === 0 && item.enviador !== idUser
                            ? { fontWeight: 500, color: "black" }
                            : { fontWeight: "normal" },
                        ]}
                        numberOfLines={1}
                      >
                        {item.foto_enviada ? (
                          <View style={styles.ultimaMensagemImg}>
                            <View style={styles.circuloImagem}>
                              <Ionicons
                                style={styles.imagemIcon}
                                name="image-outline"
                                color={colors.branco}
                              />
                            </View>
                            <Text>Imagem</Text>
                          </View>
                        ) : (
                          <Text>{item.ultima_mensagem}</Text>
                        )}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.listaMensagens}
            />
          )}
          {mostrarResultadosPesquisa && resultadosUsuarios.length > 0 && (
            <FlatList
              data={resultadosUsuarios}
              keyExtractor={(item) => {
                if (item.tipo === "chat")
                  return `chat_${item.id_chat}_${item.id_mensagem}`;
                if (item.tipo === "canal") return `canal_${item.id_canal}`;
                if (item.tipo === "instituicao")
                  return `instituicao_${item.id_instituicao}_${
                    item.id_mensagem_instituicao || ""
                  }`;
                return `item_${Math.random().toString(36).substr(2, 9)}`;
              }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    if (item.tipo === "chat") {
                      navigation.navigate("Conversa", {
                        idUserLogado: idUser,
                        idEnviador: item.id_enviador,
                        imgEnviador: item.img_enviador,
                        nomeEnviador: item.nome_enviador,
                        arrobaEnviador: item.arroba_enviador,
                        idChat: item.id_chat,
                      });
                    } else if (item.tipo === "canal") {
                      navigation.navigate("Conversa", {
                        idUserLogado: idUser,
                        idEnviador: item.id_enviador,
                        imgEnviador: item.img_enviador,
                        nomeEnviador: item.nome_enviador,
                        arrobaEnviador: item.arroba_enviador,
                        idChat: item.id_chat,
                      });
                    } else if (item.tipo === "instituicao") {
                      navigation.navigate("Conversa", {
                        idUserLogado: idUser,
                        idEnviador: item.id_enviador,
                        imgEnviador: item.img_enviador,
                        nomeEnviador: item.nome_enviador,
                        arrobaEnviador: item.arroba_enviador,
                        idChat: item.id_chat,
                      });
                    }
                  }}
                  rippleColor="rgba(0, 0, 0, .05)"
                >
                  <View style={styles.mensagemItem}>
                    <Image
                      source={getImageSource(item)}
                      style={styles.avatar}
                    />
                    <View style={styles.mensagemTexto}>
                      <Text style={styles.nome} numberOfLines={1}>
                        { item.nome_canal || 
                          item.nome_enviador ||  
                          item.nome_instituicao}
                      </Text>
                      <Text
                        style={[
                          styles.ultimaMensagem,
                          item.status_mensagem === 0 && item.enviador !== idUser
                            ? { fontWeight: 500, color: "black" }
                            : { fontWeight: "normal" },
                        ]}
                        numberOfLines={1}
                      >
                        {item.foto_enviada ? (
                          <View style={styles.ultimaMensagemImg}>
                            <View style={styles.circuloImagem}>
                              <Ionicons
                                style={styles.imagemIcon}
                                name="image-outline"
                                color={colors.branco}
                              />
                            </View>
                            <Text>Imagem</Text>
                          </View>
                        ) : (
                          <Text>{item.ultima_mensagem}</Text>
                        )}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.listaMensagens}
            />
          )}

          <StatusBar style="auto" />
        </View>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  Header: {
    backgroundColor: "#fff",
    elevation: 0,
  },

  tab: {
    backgroundColor: "transparent",
    borderBottomColor: "transparent",
    borderRadius: 0,
    borderWidth: 0,
  },
  selectedTab: {
    backgroundColor: "transparent",
    borderBottomWidth: 2,
    borderRadius: 0,
    borderWidth: 0,
  },
  mensagemItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 10,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: "#ccc",
  },
  mensagemTexto: {
    flex: 1,
  },
  nome: {
    fontSize: 16,
    fontWeight: 600,
    color: "#000",
  },

  ultimaMensagem: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  circuloImagem: {
    borderRadius: "50%",
    backgroundColor: colors.azul,
    justifyContent: "center",
    alignItems: "center",
    width: 22,
    height: 22,
    marginRight: 3,
  },
  ultimaMensagemImg: {
    alignItems: "center",
    flexDirection: "row",
  },
  imagemIcon: {
    fontSize: 15,
  },
  listaMensagens: {
    paddingTop: 8,
  },
  customSearchbar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFEFEF",
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 12,
    height: 48,
  },

  searchIcon: {
    width: 18,
    height: 18,
    tintColor: "#A7A7A7",
    marginRight: 8,
  },

  customSearchInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: 600,
    color: "#000",
    padding: 0,
    margin: 0,
  },
});
