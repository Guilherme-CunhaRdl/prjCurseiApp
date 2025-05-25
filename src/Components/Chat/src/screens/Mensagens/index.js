import React, { useState, useEffect, useMemo, } from "react";
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
  ActivityIndicator,
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
import host from "../../../../../global";

export default function Mensagens({ route }) {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState("todas");
  const [conversas, setConversas] = useState([]);
  const [idUser, setIdUser] = useState(null);
  const [IsVisto, setIsVisto] = useState();
  const [resultadosUsuarios, setResultadosUsuarios] = useState([]);
  const [mostrarResultadosPesquisa, setMostrarResultadosPesquisa] = useState(false);
  const [query, setQuery] = useState("");
  const [chatsPesquisados, setChatsPesquisados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (route.params?.novaConversa) {
      setConversas(prev => [route.params.novaConversa, ...prev]);
      conectarCanal([route.params.novaConversa]);
      // Remove o parâmetro para não adicionar novamente
      navigation.setParams({ novaConversa: undefined });
    }
  }, [route.params?.novaConversa]);

  useEffect(() => {
    const inicializar = async () => {
      const id = await AsyncStorage.getItem("idUser");
      setIdUser(id);
      if (id) {

        const chats = await listarChats(id);
        conectarCanal(chats);
        console.log(chats)
      }
    };

    inicializar();
  }, []);

  const listarChats = async (userId) => {
    console.log(idUser);

    try {
      const resposta = await axios.get(
        `http://${host}:8000/api/cursei/chat/recebidor/${userId}/todas/0`
      )
      console.log(resposta)
      setConversas(resposta.data.conversas)
      return resposta.data.conversas;

    } catch (error) {
      console.error("Erro ao buscar mensagens:", error);
      return "deu erro";
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 1500)

    }
  };




  const conectarCanal = async (novosChats) => {
    if (!window.pusherInstance) {
      window.pusherInstance = new Pusher("yls40qRApouvChytA220SnHKQViSXBCs", {
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
    }

    const ordenarConversas = (conversas) => {
      return [...conversas].sort((a, b) =>
        new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at)
      );
    };

    const transformarMensagem = (msg) => ({
      id_conversa: msg.id_chat,
      id_remetente: msg.id_enviador,
      nome: msg.nome_enviador,
      arroba: msg.arroba_enviador,
      img: msg.img_enviador,
      ultima_mensagem: msg.ultima_mensagem,
      foto_enviada: msg.foto_enviada,
      status_mensagem: msg.status_mensagem,
      updated_at: msg.created_at || new Date().toISOString()
    });

    novosChats.forEach((chat) => {
      if (!window.pusherInstance.channel(`trazer_chats.${chat.id_conversa}`)) {
        const canal = window.pusherInstance.subscribe(`trazer_chats.${chat.id_conversa}`);

        canal.bind("chats", (data) => {
          if (!data?.msgs?.length) return;

          data.msgs.forEach((msg) => {
            const mensagemFormatada = transformarMensagem(msg);

            setConversas(prev => {
              const chatIndex = prev.findIndex(c => c.id_conversa === mensagemFormatada.id_conversa);

              if (chatIndex !== -1) {
                const updated = [...prev];
                updated[chatIndex] = {
                  ...updated[chatIndex],
                  ...mensagemFormatada,
                  updated_at: mensagemFormatada.updated_at
                };
                return ordenarConversas(updated);
              }

              return prev;
            });
          });
        });
      }
    });
  };


  const procurarChat = async (userId) => {
    try {
      if (query.trim() === "") {
        setConversasFiltradas(conversas);
        return;
      }

      const response = await axios.get(
        `http://${host}:8000/api/cursei/chat/recebidor/${userId}/todas/${query}`
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
        `http://${host}:8000/api/cursei/chat/pesquisa/${query}/${userId}`
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

  const filtrarChats = (chats) => {
    const termo = query.toLowerCase();

    return chats.filter(chat => {
      const tipoMatch = selectedTab === "todas" || chat.tipo === selectedTab;
      console.log(chat.tipo, selectedTab, tipoMatch)

      const queryMatch = query === "" ||
        chat.nome?.toLowerCase().includes(termo) ||
        chat.ultima_mensagem?.toLowerCase().includes(termo);
      return tipoMatch && queryMatch;
    });
  };

  const conversasFiltradas = useMemo(() => {
    return filtrarChats(conversas);
  }, [conversas, selectedTab, query]);

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
                { label: "Canais", value: "canal" },
                { label: "Instituições", value: "instituicao" },
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

          <FlatList
            data={conversasFiltradas}
            keyExtractor={(item) => item.id_conversa.toString()}
            renderItem={({ item }) => (

              <TouchableOpacity

                onPress={() => {
                  if (item.tipo === "privada") {
                    navigation.navigate("Conversa", {
                      idUserLogado: idUser,
                      idEnviador: item.id_remetente,
                      imgEnviador: item.img,
                      nomeEnviador: item.nome,
                      arrobaEnviador: item.arroba,
                      idChat: item.id_conversa,
                      isCanal: false,
                    });
                  } else if (item.tipo === "canal") {
                    navigation.navigate("Conversa", {
                      idUserLogado: idUser,
                      idEnviador: item.id_remetente,
                      imgEnviador: item.img,
                      nomeEnviador: item.nome,
                      arrobaEnviador: item.arroba,
                      idChat: item.id_conversa,
                      isCanal: true,
                    });
                  } else if (item.tipo === "instituicao") {
                    navigation.navigate("Conversa", {
                      idUserLogado: idUser,
                      idEnviador: item.id_remetente,
                      imgEnviador: item.img,
                      nomeEnviador: item.nome,
                      arrobaEnviador: item.arroba,
                      idChat: item.id_conversa,
                      isCanal: false,
                    });
                  }
                }}
              >

                <View style={styles.mensagemItem}>
                  <Image source={{ uri: `http://${host}:8000/img/user/fotoPerfil/${item.img}` }} style={styles.avatar} />
                  <View style={styles.mensagemTexto}>
                    <Text style={styles.nome} numberOfLines={1}>
                      {item.nome}
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
            ListEmptyComponent={
              <View style={styles.listaVazia}>
                {loading ? (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#fff", position: 'fixed', zIndex: 99, width: '100%', height: '70%' }}>
                  <ActivityIndicator size="large" color="#3498db" />
                </View>
                ) : null}              </View>
            }
            contentContainerStyle={styles.listaMensagens}


          />


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
