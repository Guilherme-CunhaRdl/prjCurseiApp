// App.js
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

import { useTema, temaAtual } from '../../context/themeContext';
const DATA = [
  {
    id: Math.random().toString(36).substring(2, 27),
    photoURL: 'https://th.bing.com/th/id/OIP.YmtJRv73dOTsmE6c2alf9AHaHa?rs=1&pid=ImgDetMain',
    nome: "Bradesco",
  },
  {
    id: Math.random().toString(36).substring(2, 27),
    photoURL: etecLogo,
    nome: "Etec",
  },
  {
    id: Math.random().toString(36).substring(2, 27),
    photoURL: fabricaLogo,
    nome: "Cultura",
  },
  {
    id: Math.random().toString(36).substring(2, 27),
    photoURL: 'https://th.bing.com/th/id/OIP.5YdHzgQhfS1mFfUOpVXeUAHaHa?rs=1&pid=ImgDetMain',
    nome: "X",
  },
  {
    id: Math.random().toString(36).substring(2, 27),
    photoURL: 'https://akamai.sscdn.co/uploadfile/letras/fotos/c/a/5/2/ca52b9aff9234ab34a4f36fa8acdf91f.jpg',
    nome: "Plumas",
  },
];

export default function Home() {
  const { tema } = useTema();
  const [refreshing, setRefreshing] = useState(false); // Estado para o refresh


  const [focoIcone, setFocoIcone] = useState('posts')
  const alterarFoco = (icone) => setFocoIcone(icone)

  const navigation = useNavigation();

  async function verificarInteresses() {
    const idUserSalvo = await AsyncStorage.getItem('idUser');
    const Response = await axios.get(`http://${host}:8000/api/user/verificarInteresses/${idUserSalvo}`);
    if (!Response.data.resultado) {
      navigation.navigate('Interesse');
    }
  }

  useEffect(() => {
    verificarInteresses()
  }, []);

  const route = useRoute();
  const rotavalores = route.params;

  const [nome, setNome] = useState('');
  const [userImg, setUserImg] = useState('');
  const [user, setUser] = useState('');
  const [idUser, setIdUser] = useState();
  const [loading, setLoading] = useState(true);
  const [perfilProprio, setPerfilProprio] = useState(false)
  const [countNotificacoes, setCountNotificacoes] = useState(0);
  const [rodandoApp, setRodandoApp] = useState(false)

  async function carregarPerfil() {
    const idUserSalvo = await AsyncStorage.getItem('idUser');
    if (Platform.OS !== 'web') {
      setRodandoApp(true);
    }

    const idPerfil = rotavalores ? rotavalores.idUserPerfil : idUserSalvo;

    try {
      setIdUser(idPerfil);
      const resultados = await axios.get(`http://${host}:8000/api/cursei/user/${idPerfil}/0`);
      const data = resultados.data;

      setNome(data.User.nome_user);
      setUserImg(data.User.img_user);
      setUser(data.User.arroba_user);

      if (idUserSalvo == idPerfil) {
        setPerfilProprio(true);
      }

      const segue = await axios.get(`http://${host}:8000/api/cursei/user/verificarSeSegue/${idUserSalvo}/${idPerfil}`)
      if (segue.data.data) {
        Setsegue_usuario(true)
      }

      const notificacoes = await axios.get(`http://${host}:8000/api/cursei/user/notificacao/${idUserSalvo}/count`)
      setCountNotificacoes(notificacoes.data)
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
    } finally {
      setTimeout(() => setLoading(false), 1500);
    }
  }

  useEffect(() => {
    carregarPerfil()
  }, []);
  async function recarregarHome() {
    var temporario = focoIcone
    setRefreshing(true)
    alterarFoco('temporario')
    await carregarPerfil().finally(() => setRefreshing(false))
    alterarFoco(temporario)
    
  }

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
              <Pressable style={styles.notifyUser}
                onPress={() => navigation.navigate('Notificacoes')}>
                <Ionicons
                  style={styles.notifyIcon}
                  name="notifications-outline"
                  size={22}
                  color={tema.texto}
                />
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{countNotificacoes}</Text>
                </View>
              </Pressable>
              <View style={styles.logoCursei}>
                <Image
                  style={styles.curseiIcon}
                  source={tema.nome === 'claro' ? require("../../../assets/curseiLogo.png") : require("../../../assets/curseiLogoBlackMode.png")}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Storys */}
        <View style={styles.storysContainer}>
          <FlatList
            horizontal={true}
            data={DATA}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={
              <View style={styles.storys}>
                <Pressable style={styles.circuloStorys} onPress={() => navigation.navigate('CriarCurteis')}>
                  <Image style={styles.imgLogo} source={adicionarLogo} />
                </Pressable>
                <Text style={{ color: tema.texto, textAlign: 'center' }}>Seu Story</Text>
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.storys}>
                <Pressable style={styles.circuloStorys} onPress={() => navigation.navigate('Story')}>
                  <Image style={styles.imgLogo} source={item.photoURL} />
                </Pressable>
                <Text style={{ color: tema.texto, textAlign: 'center' }}>{item.nome}</Text>
              </View>
            )}
            contentContainerStyle={styles.flatListContent}
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
            <Post key="post-0" />
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
      <ModalPostagem tipo='post' />
    </SafeAreaView>
  );
}
