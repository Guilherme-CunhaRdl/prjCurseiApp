import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  RefreshControl
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
import { useTema } from '../../../../../context/themeContext'

export default function Mensagens({ route }) {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState("todas");
  const [conversas, setConversas] = useState([]);
  const [idUser, setIdUser] = useState(null);
  const [mostrarResultadosPesquisa, setMostrarResultadosPesquisa] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // Estado para o refresh
  const { tema } = useTema();

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
  try{

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
    ultima_mensagem: msg.ultima_mensagem,
    img_mensagem: msg.img_mensagem,
    status_mensagem: msg.status_mensagem,
    updated_at: msg.created_at || new Date().toISOString()
  });

  novosChats.forEach(chat => {
    if (window.pusherInstance.channel(`trazer_chats.${chat.id_conversa}`)) {
      window.pusherInstance.unsubscribe(`trazer_chats.${chat.id_conversa}`);
    }
  });

  novosChats.forEach((chat) => {
    const canal = window.pusherInstance.subscribe(`trazer_chats.${chat.id_conversa}`);
    console.log(`Inscrito no canal trazer_chats.${chat.id_conversa}`);

    canal.bind("chats", (data) => {
      if (!data?.msgs?.length) return;

      setConversas(prev => {
        const novasConversas = [...prev];
        let precisaOrdenar = false;

        data.msgs.forEach((msg) => {
          const mensagemFormatada = transformarMensagem(msg);
          const chatIndex = novasConversas.findIndex(
            c => c.id_conversa === mensagemFormatada.id_conversa
          );

          if (chatIndex !== -1) {
            novasConversas[chatIndex] = {
              ...novasConversas[chatIndex],
              ultima_mensagem: mensagemFormatada.ultima_mensagem,
              img_mensagem: mensagemFormatada.img_mensagem,
              status_mensagem: mensagemFormatada.status_mensagem,
              updated_at: mensagemFormatada.updated_at
            };
            precisaOrdenar = true;
          } else {
            novasConversas.push({
              id_conversa: mensagemFormatada.id_conversa,
              id_remetente: msg.id_enviador,
              nome: msg.nome_enviador,
              arroba: msg.arroba_enviador,
              img: msg.img_enviador,
              tipo: msg.tipo,
              ...mensagemFormatada
            });
            precisaOrdenar = true;
          }
        });

        return precisaOrdenar ? ordenarConversas(novasConversas) : novasConversas;
      });
    });
  });
}
catch(erro){
  console.log(erro)
}
};



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
    console.log("Filtrando conversas:", conversas, selectedTab, query);

    return filtrarChats(conversas);
  }, [conversas, selectedTab, query]);

  const recarregarChats = useCallback(() => {
    const pegarInfos = async () => {
      const id = await AsyncStorage.getItem('idUser')
      console.log(id)
      setRefreshing(true);
      listarChats(id).finally(() => setRefreshing(false));
    }

    pegarInfos()

  }, []);
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <View style={[styles.container, { backgroundColor: tema.fundo }]}>
          <Appbar.Header style={[styles.Header, { backgroundColor: tema.fundo }]}>
            <Appbar.Content
              title="Mensagens"
              titleStyle={{ color: tema.texto, fontWeight: "600" }}
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

          <View style={[styles.customSearchbar, { backgroundColor: tema.cinza }]}>
            <Image
              source={require("../../img/search.png")}
              style={styles.searchIcon}
            />
            <TextInput
              placeholder="Buscar Conversas..."
              placeholderTextColor={tema.descricao}
              value={query}
              onChangeText={setQuery}
              style={[styles.customSearchInput, { color: tema.texto }]}
              onFocus={() => query.length > 0 && setMostrarResultadosPesquisa(true)}
            />
          </View>

          <View style={{ marginTop: 32, marginBottom: 8 }}>
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
                    style={{
                      paddingBottom: 8,
                      borderBottomWidth: 2,
                      borderBottomColor: isSelected
                        ? tema.azul
                        : "transparent",
                    }}
                  >
                    <Text
                      style={{
                        color: isSelected ? tema.azul : tema.descricao,
                        fontWeight: isSelected ? "600" : "normal",
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
            keyExtractor={(item) => item.tipo === 'canal' ? `canal_${item.id_conversa.toString()}` : `outra_${item.id_conversa.toString()}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  const navData = {
                    idUserLogado: idUser,
                    idEnviador: item.id_remetente,
                    imgEnviador: item.img,
                    nomeEnviador: item.nome,
                    arrobaEnviador: item.arroba,
                    idChat: item.id_conversa,
                    isCanal: item.tipo === "canal",
                  };
                  navigation.navigate("Conversa", navData);
                }}
              >
                <View style={styles.mensagemItem}>
                  <Image
                    source={item.tipo === 'canal' ?
                      { uri: `http://${host}:8000/img/chat/imgCanal/${item.img}` }
                      : { uri: `http://${host}:8000/img/user/fotoPerfil/${item.img}` }


                    }
                    style={styles.avatar}
                  />
                  <View style={styles.mensagemTexto}>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={[styles.nome, { color: tema.texto, paddingRight: 10 }]} numberOfLines={1}>
                        {item.nome} {item.id_conversa}
                      </Text>
                      {item.tipo === 'instituicao' && (
                        <Ionicons name="school-outline"
                          style={styles.opcaoIcon}
                          size={22}
                          color={colors.azul}
                        />
                      )}
                      {item.tipo === 'canal' && (
                        <Ionicons name="megaphone-outline"
                          style={styles.opcaoIcon}
                          size={22}
                          color={colors.azul}
                        />
                      )}
                    </View>
                    {item.img_mensagem ? (
                      <View style={styles.ultimaMensagemImg}>
                        <View
                          style={[
                            styles.circuloImagem,
                            { backgroundColor: tema.azul },
                          ]}
                        >
                          <Ionicons
                            style={styles.imagemIcon}
                            name="image-outline"
                            color={tema.textoBotao}
                          />
                        </View>
                        <Text style={[styles.ultimaMensagem, { color: tema.descricao }]}>
                          Imagem
                        </Text>
                      </View>
                    ) : item.id_post ?  (
                      <>
                        {item.tipo === 'canal' && !item.ultima_mensagem ? (
                          <>
                            <Text
                              style={[styles.ultimaMensagem, { color: tema.descricao }]}
                              numberOfLines={1}
                            >
                              Não existe mesagens para ete canal
                            </Text>
                          </>
                        ) : (
                          <Text
                            style={[styles.ultimaMensagem, { color: tema.descricao }]}
                            numberOfLines={1}
                          >
                            Post
                          </Text>
                        )}

                      </>
                    ) :
                    (
                      <>
                        {item.tipo === 'canal' && !item.ultima_mensagem ? (
                          <>
                            <Text
                              style={[styles.ultimaMensagem, { color: tema.descricao }]}
                              numberOfLines={1}
                            >
                              Não existe mesagens para ete canal
                            </Text>
                          </>
                        ) : (
                          <Text
                            style={[styles.ultimaMensagem, { color: tema.descricao }]}
                            numberOfLines={1}
                          >
                            {item.ultima_mensagem}
                          </Text>
                        )}

                      </>
                    ) }
                  </View>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              loading ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: tema.fundo,
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <ActivityIndicator size="large" color={tema.azul} />
                </View>
              ) : (
                <View style={styles.listaVazia}>
                  <Text style={{ color: '#A7A7A7', textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>
                    Nenhuma conversa encontrada
                  </Text>
                </View>
              )
            }
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={recarregarChats}
                colors={[tema.azul]}
                tintColor={tema.azul}
              />
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
    fontSize: 13,
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
