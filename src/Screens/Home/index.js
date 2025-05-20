// App.js
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Pressable,
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
  const navigation = useNavigation();
  async function verificarInteresses() {
    const idUserSalvo = await AsyncStorage.getItem('idUser');
    Response = await axios.get(`http://localhost:8000/api/user/verificarInteresses/${idUserSalvo}`)
    if (!Response.data.resultado) {
      navigation.navigate('Interesse')
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
  const [countNotificacoes ,setCountNotificacoes]= useState(0);
  async function carregarPerfil() {
    const idUserSalvo = await AsyncStorage.getItem('idUser');

    if (rotavalores) {
      var idPerfil = rotavalores.idUserPerfil;
    } else {
      var idPerfil = idUserSalvo
    }
    try {

      setIdUser(idPerfil);
      const resultados = await axios.get(`http://localhost:8000/api/cursei/user/${idPerfil}`);
      var data = resultados.data;

      setNome(data.User.nome_user);
      setUserImg(data.User.img_user);
      setUser(data.User.arroba_user);

      if (idUserSalvo == idPerfil) {
        setPerfilProprio(true);
      }
      var segue = await axios.get(`http://localhost:8000/api/cursei/user/verificarSeSegue/${idUserSalvo}/${idPerfil}`)
      if (segue.data.data) {
        Setsegue_usuario(true)
      }
      const notificacoes = await axios.get(`http://localhost:8000/api/cursei/user/notificacao/${idUserSalvo}/count`)
      setCountNotificacoes(notificacoes.data)
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1500)
    }
  }
  useEffect(() => {
    carregarPerfil()
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Feed Content */}
      <View style={styles.ContainerCont}>
        {/*Header*/}
        <View style={styles.Header}>
          {/*View informações user*/}
          <View style={styles.userContainer}>

            <View style={styles.infoUser}>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={styles.imgContainer} onPress={() => navigation.navigate('user')}>
                  <Image
                    style={styles.userImg}
                    source={userImg !== null ? { uri: `http://localhost:8000/img/user/fotoPerfil/${userImg}` } : require('../../../assets/userDeslogado.png')}
                  />
                </TouchableOpacity>
                <View style={styles.msgUser}>
                  <Text style={styles.textUser}>{nome}!</Text>
                  <Text style={styles.textInicio}>@{user}</Text>
                </View>
              </View>


              <View style={styles.notifyContainer}>
                <Pressable style={styles.notifyUser}
                  onPress={() => navigation.navigate('Notificacoes')}>
                  <Ionicons
                    style={styles.notifyIcon}
                    name="notifications-outline"
                  ></Ionicons>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{countNotificacoes}</Text>
                  </View>
                </Pressable>
                <View style={styles.logoCursei}>
                  <Image
                    style={styles.curseiIcon}
                    source={require("../../../assets/curseiLogo.png")}
                  />
                </View>
              </View>
            </View>

          </View>
          {/*View Storys*/}
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
                  <View>
                    <Text style={styles.nomeStorys}>Seu Story</Text>
                  </View>
                </View>
              }
              renderItem={({ item }) => (
                <View style={styles.storys}>
                  <Pressable style={styles.circuloStorys}>
                    <Image style={styles.imgLogo} source={item.photoURL} />
                  </Pressable>
                  <View>
                    <Text style={styles.nomeStorys}>{item.nome}</Text>
                  </View>
                </View>
              )}
              contentContainerStyle={styles.flatListContent}
            />
          </View>
        </View>
        <View style={styles.feedContainer}>
          {/*Posts*/}
          <View style={styles.postContainer}>
            <Post />
          </View>
        </View>
      </View>
      {/* Send Button */}
      <ModalPostagem tipo='post' />
    


    </SafeAreaView>


  );
}