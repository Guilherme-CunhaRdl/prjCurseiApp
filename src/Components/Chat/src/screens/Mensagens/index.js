import React, { useState, useEffect, useRef } from "react";
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
  SegmentedButtons,
} from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Pusher from "pusher-js/react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from "../../../../../colors";

export default function Mensagens() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const onChangeSearch = (query) => setSearchQuery(query);
  const [selectedTab, setSelectedTab] = useState("todas");
  const [conversas, setConversas] = useState([])
  const [chats, setChats] = useState([]);
  const [canais, setCanais] = useState([])
  const [instituicoes, setInstituicoes] = useState([])
  const [idUser, setIdUser] = useState(null)
  const [IsVisto, setIsVisto] = useState()
  
  const listarChats = async (userId) => {
    console.log(userId)

    try {
      const resposta = await axios.get(
        `http://localhost:8000/api/cursei/chat/recebidor/${userId}/todas`
      );
       const respostaCanais = await axios.get(
      `http://localhost:8000/api/cursei/chat/selecionarCanal/pegarTodos`
      )
      const respostaInstituicao = await axios.get(
        `http://localhost:8000/api/cursei/chat/recebidor/${userId}/instituicao`
      );
      

        const novasConversas = [
          ...resposta.data.chats.map(chat => ({ ...chat, tipo: 'chat' })),
          ...respostaCanais.data.canais.map(canal => ({ ...canal, tipo: 'canal' })),
          ...respostaInstituicao.data.instituicoes.map(instituicao => ({ ...instituicao, tipo: 'instituicao' })),
        ];
        setConversas(novasConversas);
        setCanais(respostaCanais.data.canais);
        setInstituicoes(respostaInstituicao.data.instituicoes)
      console.log(respostaCanais.data.canais);
      console.log(userId);
    } catch (error) {
      console.error("Erro ao buscar mensagens:", error);
    }
   
    
  };

  useEffect(() => {
    const inicializar = async () => {
      const id = await AsyncStorage.getItem("idUser");
      setIdUser(id)
      if(id){
        await listarChats(id);
        conectarCanal(id)
      }
    }

    inicializar()
    
  }, []);
 
  const conectarCanal = async (userId) => {
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
    const canal = pusher.subscribe(`trazer_chats`);

    canal.bind("chats", (data) => {
      const novaMensagem = data.msgs[0];
      console.log(data)

  setChats((prevChats) => {
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
      return [novaMensagem, ...prevPesquisados];
    }
  });
  if (novaMensagem.status_chat === 1) {
    setIsVisto(true);
  } else {
    setIsVisto(false);
  }
    });
}

useEffect(() =>{
  console.log(idUser)
},[idUser])
  
    const [query, setQuery] = useState('');
    const [chatsPesquisados, setChatsPesquisados] = useState([]);
    
    const procurarChat = async (userId) => {
        try {
              const response = await axios.get(`http://localhost:8000/api/cursei/chat/pesquisa/${query}/${userId}`);            
              setChatsPesquisados(response.data.chats);
              console.log(response)
        } catch (error) {
            console.error('Search error:', error);
        }
    };
useEffect(() => {
        if (query.length > 0) {
            const contador = setTimeout(() => {
              procurarChat(idUser);
              console.log(query, idUser)
              console.log(chatsPesquisados)

            }, 500);
            
            return () => clearTimeout(contador);
        } else {
            setChatsPesquisados([]);
        }
    }, [query]);
const filtrarMensagem = (mensagem) => {
  const chat = chats?.id_chat;
  if (!chat) return false;

  if (tipoChat === 'canal') {
    return chat.canal_id === chatId;
  }

  if (tipoChat === 'privado') {
    return (
      (chat.user1_id === idUser && chat.user2_id === userRecId) ||
      (chat.user1_id === userRecId && chat.user1_id === idUser)
    );
  }

  if (tipoChat === 'instituicao') {
    return chat.instituicao_id === chatId;
  }

  return false;
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

        <FlatList
  data={conversas?.filter((item) => {
    // Filtro baseado na tab selecionada
    if (selectedTab === "todas") return true;
    if (selectedTab === "canais") return item.tipo === 'canal';
    if (selectedTab === "instituicoes") return item.tipo === 'instituicao';
    return true;
  })}
  keyExtractor={(item, index) => {
    if (item.tipo === 'chat') return item.id_mensagem ? item.id_mensagem.toString() : index.toString();
    if (item.tipo === 'canal') return `canal_${item.id_canal}`; 
    if (item.tipo === 'instituicao') return item.id_mensagem_instituicao ? item.id_mensagem_instituicao.toString() : index.toString(); 
    return index.toString();
  }}
  renderItem={({ item }) => {
    // Renderização comum para todos os tipos
    return (
      <TouchableOpacity
        onPress={() => {
          // Navegação diferente para cada tipo
          if (item.tipo === 'chat') {
            navigation.navigate("Conversa", {
              idUserLogado: idUser,
              idEnviador: item.id_enviador,
              imgEnviador: item.img_enviador,
              nomeEnviador: item.nome_enviador,
              arrobaEnviador: item.arroba_enviador,
              idChat: item.id_chat,
            });
          } else if (item.tipo === 'canal') {
            navigation.navigate("CanalConversa", {
              idUserLogado: idUser,
              idCanal: item.id_canal,
              nomeCanal: item.nome_canal,
              imgCanal: item.img_canal,
            });
          } else if (item.tipo === 'instituicao') {
            navigation.navigate("InstituicaoConversa", {
              idUserLogado: idUser,
              idInstituicao: item.id_instituicao,
              nomeInstituicao: item.nome_instituicao,
              imgInstituicao: item.img_instituicao,
            });
          }
        }}
        rippleColor="rgba(0, 0, 0, .05)"
      >
        <View style={styles.mensagemItem}>
          <Image
            source={
              item.img_enviador || item.img_canal || item.img_instituicao
                ? { uri: `http://localhost:8000/img/user/fotoPerfil/${item.img_enviador || item.img_canal || item.img_instituicao}` }
                : require("../../img/metalbat.jpg")
            }
            style={styles.avatar}
          />
          <View style={styles.mensagemTexto}>
            <Text style={styles.nome} numberOfLines={1}>
              {item.nome_enviador || item.nome_canal || item.nome_instituicao}
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
                    <Ionicons style={styles.imagemIcon} name="image-outline" color={colors.branco} />
                  </View>
                  <Text>Imagem </Text>
                </View>
              ) : (
                <Text>{item.ultima_mensagem}</Text>
              )}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }}
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
  circuloImagem:{
    borderRadius: '50%',
    backgroundColor: colors.azul,
    justifyContent: 'center',
    alignItems: "center",
    width: 22,
    height: 22,
    marginRight: 3
  },
  ultimaMensagemImg:{
    alignItems: 'center',
    flexDirection: 'row'
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
