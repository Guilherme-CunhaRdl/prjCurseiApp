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
import useStyles from './styles';

export default function Mensagens({ route }) {
  const styles = useStyles()
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
    try {
      window.pusherInstance = new Pusher("yls40qRApouvChytA220SnHKQViSXBCs", {
        cluster: "mt1",
        wsHost: `${host}`,
        wsPort: 6001,
        forceTLS: false,
        enabledTransports: ["ws"],

      });


      const ordenarConversas = (conversas) => {
        return [...conversas].sort((a, b) =>
          new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at)
        );
      };

      const transformarMensagem = (msg) => ({
        id_conversa: msg.id_chat,
        id_remetente: msg.id_enviador,
        ultima_mensagem: msg.ultima_mensagem,
        img_mensagem: msg.img_mensagem,
        status_mensagem: msg.status_mensagem,
        id_post: msg.id_post,

        updated_at: msg.created_at || new Date().toISOString()
      });

      novosChats.forEach((chat) => {
        let tipoChat = chat.tipo;
        const isCanal = tipoChat === 'canal';
        const isInstituicao = tipoChat === 'instituicao';
        const tipoEsperado = isCanal ? 'canal' : isInstituicao ? 'instituicao' : 'privado';
        console.log('tipo esperado', tipoEsperado)
        let eventoCanal = isCanal ? 'receber_mensagens_canais' : 'chats';
        let channelName = isCanal ? `view_canais.${chat.id_conversa}` : `trazer_chats.${chat.id_conversa}`;

        console.log('evento canal', eventoCanal)
        if (!window.pusherInstance.channels[channelName]) {
          const canal = window.pusherInstance.subscribe(channelName);

          canal.bind(eventoCanal, (data) => {
            console.log('data recebida do evento', data);
            if (!data?.msgs?.length) return;

            data.msgs.forEach((msg) => {
              const mensagemFormatada = transformarMensagem(msg);

              setConversas(prev => {
                const chatIndex = prev.findIndex(c =>
                  c.id_conversa === mensagemFormatada.id_conversa &&
                  (
                    tipoEsperado !== 'privado'
                      ? c.tipo === tipoEsperado
                      : true
                  )
                );

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
    } catch (error) {
      console.log('erro ao conectar canal', error)
    }
  };

const renderUltimaMensagem = (item) => {
  if (item.img_mensagem && item.img_mensagem.trim() !== "") {
    return (
      <View style={styles.ultimaMensagemImg}>
        <View style={[styles.circuloImagem, { backgroundColor: tema.azul }]}>
          <Ionicons
            style={styles.imagemIcon}
            name="image-outline"
            color={tema.textoBotao}
          />
        </View>
        <Text style={[styles.ultimaMensagem, { color: tema.descricao }]}>Imagem</Text>
      </View>
    );
  } else if (item.id_curtei && !item.ultima_mensagem) {
    return <Text style={[styles.ultimaMensagem, { color: tema.descricao }]}>Curtiu</Text>;
  } else if (item.id_post && !item.ultima_mensagem) {
    return <Text style={[styles.ultimaMensagem, { color: tema.descricao }]}>Post</Text>;
  } else if (item.tipo === "canal" && !item.ultima_mensagem) {
    return (
      <Text style={[styles.ultimaMensagem, { color: tema.descricao }]}>
        Não existe mensagens para este canal
      </Text>
    );
  } else {
    return (
      <Text style={[styles.ultimaMensagem, { color: tema.descricao }]}>
        {item.ultima_mensagem}
      </Text>
    );
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
                    idEnviador: item.tipo !== 'canal' ? Number(idUser) === item.idUser1 ? item.idUser2 : item.idUser1 : item.id_remetente,
                    imgEnviador: item.img,
                    nomeEnviador: item.nome,
                    arrobaEnviador: item.arroba,
                    idChat: item.id_conversa,
                    isCanal: item.tipo === "canal",
                    idMembro: item.id_membro,
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
                        {item.nome}

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
                    {renderUltimaMensagem(item)}

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
