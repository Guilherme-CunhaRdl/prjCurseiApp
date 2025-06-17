import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Pressable,
  RefreshControl
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from "./styles";
import etecLogo from "../../../assets/etecLogo.jpg";
import { FlatList } from "react-native";
import adicionarLogo from "../../../assets/adicionarLogo.png";
import fabricaLogo from "../../../assets/fabricaLogo.jpeg";
import Post from "../../Components/Post";
import ModalPostagem from "../../Components/ModalPostagem";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import ModalPosts from "../PostUnico"
import Notificacoes from "../../Components/Chat/src/screens/Notificacoes";
import host from "../../global";
import { Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Video } from 'expo-av';
import { useTema, temaAtual } from '../../context/themeContext';

const Avatar = ({ uri, name, size = 60, style }) => {
  const [error, setError] = useState(false);
  
  if (error || !uri) {
    return (
      <View style={[{
        width: size,
        height: size,
        borderRadius: size/2,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center'
      }, style]}>
        <Text style={{color: '#666', fontWeight: 'bold'}}>
          {name ? name.charAt(0).toUpperCase() : '?'}
        </Text>
      </View>
    );
  }
  
  return (
    <Image
      source={{uri}}
      style={[{
        width: size,
        height: size,
        borderRadius: size/2,
      }, style]}
      onError={() => setError(true)}
    />
  );
};

export default function Home() {
  const { tema } = useTema();
  const [refreshing, setRefreshing] = useState(false);
  const [focoIcone, setFocoIcone] = useState('posts');
  const alterarFoco = (icone) => setFocoIcone(icone);
  const navigation = useNavigation();
  const route = useRoute();
  
  // State variables
  const [instituicao, setInstituicao] = useState('');
  const [nome, setNome] = useState('');
  const [userImg, setUserImg] = useState('');
  const [user, setUser] = useState('');
  const [idUser, setIdUser] = useState();
  const [loading, setLoading] = useState(true);
  const [perfilProprio, setPerfilProprio] = useState(false);
  const [countNotificacoes, setCountNotificacoes] = useState(0);
  const [rodandoApp, setRodandoApp] = useState(false);
  const [stories, setStories] = useState([]);
  const [loadingStories, setLoadingStories] = useState(true);
  const [chats, setChats] = useState([])
  async function verificarInteresses() {
    try {
      const idUserSalvo = await AsyncStorage.getItem('idUser');
      const Response = await axios.get(`http://${host}:8000/api/user/verificarInteresses/${idUserSalvo}`);
      if (!Response.data.resultado) {
        navigation.navigate('Interesse');
      }
      const a = await AsyncStorage.getItem('idInstituicao');
      console.log(a);
    } catch (error) {
      console.error('Erro ao verificar interesses:', error);
    }
  }

  async function carregarStories() {
    try {
      setLoadingStories(true);
      const response = await axios.get(`http://${host}:8000/api/stories`);
      
      const storiesAgrupados = response.data.data.reduce((acc, story) => {
        const userIndex = acc.findIndex(u => u.user.id === story.user.id);
        
        if (userIndex >= 0) {
          acc[userIndex].stories.push({
            id: story.id,
            url: story.url,
            type: story.tipo_midia,
            createdAt: story.data_inicio,
            viewed: false
          });
        } else {
          acc.push({
            user: {
              id: story.user.id,
              name: story.user.nome,

              avatar: story.user.foto || `https://ui-avatars.com/api/?name=${encodeURIComponent(story.user.nome)}&background=random`
            },
            stories: [{
              id: story.id,
              url: story.url,
              type: story.tipo_midia,
              createdAt: story.data_inicio,
              viewed: false
            }]
          });
        }
        return acc;
      }, []);
      
      setStories(storiesAgrupados);
    } catch (error) {
      console.error('Erro ao carregar stories:', error);
    } finally {
      setLoadingStories(false);
    }
  }

  async function carregarPerfil() {
    const idUserSalvo = await AsyncStorage.getItem('idUser');
    if (Platform.OS !== 'web') {
      setRodandoApp(true);
    }

    const idPerfil = route.params ? route.params.idUserPerfil : idUserSalvo;

    try {
      setIdUser(idPerfil);
      const resultados = await axios.get(`http://${host}:8000/api/cursei/user/${idPerfil}/0`);
      const data = resultados.data;
      setInstituicao(data.User.instituicao);
      setNome(data.User.nome_user);
      setUserImg(data.User.img_user);
      setUser(data.User.arroba_user);

      if (idUserSalvo == idPerfil) {
        setPerfilProprio(true);
      }

      const segue = await axios.get(`http://${host}:8000/api/cursei/user/verificarSeSegue/${idUserSalvo}/${idPerfil}`);
      if (segue.data.data) {
    
      }

      const notificacoes = await axios.get(`http://${host}:8000/api/cursei/user/notificacao/${idUserSalvo}/count`);
      setCountNotificacoes(notificacoes.data);
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
    } finally {
      setTimeout(() => setLoading(false), 1500);
    }
  }

   useEffect(() => {
    
    let id = null;    
    console.log(id)
     const trazerChats = async (userId) => {
      id = await AsyncStorage.getItem('idUser')
  try {
    console.log(userId)
        const resposta = await axios.get(
          `http://${host}:8000/api/cursei/chat/recebidor/${id}/todas/0`
        )
        console.log(resposta)
        setChats(resposta.data.conversas)
        return resposta.data.conversas;
  
      } catch (error) {
        console.error("Erro ao buscar mensagens:", error);
        return "deu erro";
      } 
  
      
    }
      trazerChats(id)
  
    } , []);
  
   

  async function recarregarHome() {
    const temporario = focoIcone;
    setRefreshing(true);
    alterarFoco('temporario');
    await Promise.all([carregarPerfil(), carregarStories()]).finally(() => {
      setRefreshing(false);
      alterarFoco(temporario);
    });
  }

  useEffect(() => {
    verificarInteresses();
    carregarPerfil();
    carregarStories();
  }, []);

  const conteudo = (
    <View style={[styles.ContainerCont, { backgroundColor: tema.fundo }]}>
      {/* Header */}
      <View style={[styles.Header, { backgroundColor: tema.fundo }]}>
        <View style={styles.userContainer}>
          <View style={styles.infoUser}>
            <View style={{ flexDirection: 'row' }}>
              <View style={styles.msgUser}>
                <Text style={[styles.textUser, { color: tema.texto }]}>Olá, {nome}!</Text>
                <Text style={[styles.textInicio, { color: tema.subTexto }]}>Bem Vindo de volta</Text>
              </View>
            </View>

            <View style={styles.notifyContainer}>
              <Pressable 
                style={styles.notifyUser}
                onPress={() => navigation.navigate('Notificacoes')}
              >
                <Ionicons
                  style={styles.notifyIcon}
                  name="notifications-outline"
                  size={22}
                  color={tema.texto}
                />
                {countNotificacoes > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{countNotificacoes}</Text>
                  </View>
                )}
              </Pressable>
              <View style={styles.logoCursei}>
                <Image
                  style={styles.curseiIcon}
                  source={tema.nome === 'claro' 
                    ? require("../../../assets/curseiLogo.png") 
                    : require("../../../assets/curseiLogoBlackMode.png")}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Storys */}
        <View style={styles.storysContainer}>
          <FlatList
            horizontal
            data={stories}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.user.id.toString()}
            ListHeaderComponent={
              instituicao === 1 && (
                <View style={styles.storyContainer}>
                  <Pressable onPress={() => navigation.navigate('CriarStorys')}>
                    <View style={[styles.storyCircle, {borderColor: tema.iconeAtivo}]}>
                      <Image 
                        source={adicionarLogo} 
                        style={styles.addIcon}
                      />
                    </View>
                    <Text style={[styles.storyText, {color: tema.texto}]}>Seu Story</Text>
                  </Pressable>
                </View>
              )
            }
            renderItem={({item}) => {
              const hasUnseenStories = item.stories.some(s => !s.viewed);
              
              return (
                <View style={styles.storyContainer}>
                  <Pressable onPress={() => navigation.navigate('Story', {
                    storiesData: stories,
                    initialUserIndex: stories.findIndex(u => u.user.id === item.user.id)
                  })}>
                    <View style={[styles.storyCircle, {
                      borderColor: hasUnseenStories ? tema.iconeAtivo : '#ccc'
                    }]}>
                  <Avatar
                    uri={item.user.avatar} 
                    name={item.user.name}
                    size={60}
                    style={styles.storyImage}
                  />
                      {hasUnseenStories && <View style={styles.unseenBadge} />}
                    </View>
                    <Text 
                      style={[styles.storyText, {color: tema.texto}]}
                      numberOfLines={1}
                    >
                      {item.user.name}
                    </Text>
                  </Pressable>
                </View>
              );
            }}
            ListEmptyComponent={
              !loadingStories && (
                <Text style={{color: tema.texto, paddingHorizontal: 20}}>
                  Nenhum story disponível
                </Text>
              )
            }
            contentContainerStyle={styles.storiesListContent}
          />
        </View>
      </View>

      {/* Barra de opções */}
      <View style={[styles.barraContainer, { borderBottomColor: tema.barra }]}>
        <Pressable
          onPress={() => alterarFoco('posts')}
          style={[
            styles.opcao,
            focoIcone === 'posts' ? styles.opcaoAtiva : styles.opcaoInativa,
          ]}
        >
          <Ionicons
            name="grid-outline"
            style={styles.opcaoIcon}
            size={22}
            color={focoIcone === 'posts' ? tema.iconeAtivo : tema.iconeInativo}
          />
        </Pressable>

        <Pressable
          onPress={() => alterarFoco('instituicao')}
          style={[
            styles.opcao,
            focoIcone === 'instituicao' ? styles.opcaoAtiva : styles.opcaoInativa,
          ]}
        >
          <Ionicons
            name="school-outline"
            style={styles.opcaoIcon}
            size={22}
            color={focoIcone === 'instituicao' ? tema.iconeAtivo : tema.iconeInativo}
          />
        </Pressable>
      </View>

      {/* Feed */}
      <View style={styles.feedContainer}>
        <View style={styles.postContainer}>
          {focoIcone === 'posts' ? (
            <Post key="post-0" conversas={chats} />
          ) : focoIcone === 'instituicao' ? (
            <Post key="post-1" tipo="instituicao" />
          ) : null}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: tema.fundo }]}>
      {rodandoApp ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={recarregarHome}
              colors={["#3498db"]}
              tintColor="#3498db"
            />
          }
        >
          {conteudo}
        </ScrollView>
      ) : conteudo}

      {/* Botão de postar */}
      <ModalPostagem tipo='post'  />
    </SafeAreaView>
  );
}


