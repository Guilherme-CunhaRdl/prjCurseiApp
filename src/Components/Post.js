import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator, FlatList, Image, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import Configuracoes from './Configurações/configuracoes';
import Comentario from './Comentario';
import Compartilhar from '../Components/Compartilhar';
import Icon from "react-native-vector-icons/Feather";
import Ionicons from 'react-native-vector-icons/Ionicons';

import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/pt-br';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Post({ idUser = null }) {
  const [mostrarCoracao, setMostrarCoracao] = useState({});

  const [posts, setPosts] = useState();
  dayjs.extend(relativeTime);
  dayjs.locale('pt-br')
  useEffect(() => {
    const fetchPosts = async () => {

      const idUserSalvo = await AsyncStorage.getItem('idUser');

      if (idUser) {
        url = `http://localhost:8000/api/cursei/posts/user/${idUserSalvo}`;
      } else {
        url = `http://localhost:8000/api/posts/0/10/100/0/0`;
      }
      const response = await axios.get(url);
      console.log(response.data.data)
      setPosts(response.data.data)
    };

    fetchPosts();
  }, []);
  const formatarTempoInsercao = (seconds) => {
    return dayjs().subtract(seconds, 'seconds').fromNow(); // Exibe o tempo como "há 2 horas", "há 1 dia", etc.
  };
  let lastTap = null;


  const [curtidos, setCurtidos] = useState({});
  async function curtirposts(idPost, curtida_banco) {
    const idUserSalvo = await AsyncStorage.getItem('idUser');
    console.log(idPost, idUserSalvo)
    if (curtidos[idPost] === true || curtida_banco === 1) {
      url = `http://127.0.0.1:8000/api/posts/interacoes/descurtir`;
      const curtida = new FormData();
      curtida.append('idUser', idUserSalvo);
      curtida.append('idPost', idPost)
      await axios.post(url, curtida, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setCurtidos(prev => ({ ...prev, [idPost]: false }));
      return 1;
    } else {
      url = `http://127.0.0.1:8000/api/posts/interacoes/curtir`;
      const curtida = new FormData();
      curtida.append('idUser', idUserSalvo);
      curtida.append('idPost', idPost)
      await axios.post(url, curtida, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setCurtidos(prev => ({ ...prev, [idPost]: true }));
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <FlatList
        data={posts}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id_post.toString()}
        renderItem={({ item }) => {
          async function verificarCurtida(idPost) {
            const resposta = await curtirposts(idPost, item.curtiu_post);
            if (resposta === 1) {
              item.curtiu_post = 0;
            }else{
              setMostrarCoracao(prev => ({ ...prev, [idPost]: true }));

              // Oculta o coração após 800ms
              setTimeout(() => {
                setMostrarCoracao(prev => ({ ...prev, [idPost]: false }));
              }, 500);
            }
          }
          function doiscliques(idPost) {
            const now = Date.now();
            const DOUBLE_PRESS_DELAY = 300; // milissegundos

            if (lastTap && (now - lastTap) < DOUBLE_PRESS_DELAY) {
              verificarCurtida(idPost); // Executa a função no segundo clique rápido
             
            }

            lastTap = now;
          }

          const curtido = item.curtiu_post === 1 || curtidos[item.id_post] === true;
          return (
            <View style={styles.postContainer}>
              <View style={styles.postHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image
                    source={{ uri: `http://localhost:8000/img/user/fotoPerfil/${item.img_user}` }}
                    style={styles.fotoUser}
                  />
                  <View style={{ paddingLeft: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={styles.institutionText}>
                        {item.nome_user}
                      </Text>
                      <Text style={styles.horaPost}>
                        ·
                      </Text>
                      <Text style={styles.horaPost}>
                        {formatarTempoInsercao(item.tempo_insercao)}
                      </Text>
                    </View>
                    <Text style={styles.arrobaUser}>
                      @{item.arroba_user}
                    </Text>
                  </View>
                </View>

                <Configuracoes />
              </View>
              <View style={styles.containerConteudo}>
                <Text style={styles.postText}>
                  {item.descricao_post}
                </Text>
                <TouchableOpacity style={styles.postContent} onPress={() => doiscliques(item.id_post)}>
                  <Image style={{ width: '100%', height: '100%', borderRadius: 8 }} source={{ uri: `http://localhost:8000/img/user/imgPosts/${item.conteudo_post}` }} />

                  {mostrarCoracao[item.id_post] && (
                    <View style={styles.coracaoOverlay}>
                      <Image
                        source={require('../../assets/coracaoGif.gif')}
                        style={{ width: 200, height: 200,}}
                      />
                    </View>
                  )}
                </TouchableOpacity>
              </View>
              <View style={styles.postActions}>
                <TouchableOpacity style={styles.actionButton} onPress={() => verificarCurtida(item.id_post)}>
                  <Ionicons
                    name={curtido ? "heart" : "heart-outline"}
                    size={20}
                    color={curtido ? "#ff0000" : "#666"}
                  />

                </TouchableOpacity>

                <View style={styles.containerComents}>
                  <Comentario idPost={item.id_post} />
                </View>

                <TouchableOpacity style={styles.actionButton}>
                  <Icon name="repeat" size={20} color="#666" />
                </TouchableOpacity>

                <View style={styles.containerShare}>
                  <Compartilhar />
                </View>

                <TouchableOpacity style={styles.actionButton}>
                  <Icon name="download" size={20} color="#666" />
                </TouchableOpacity>
              </View>
            </View>
          )
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',

  },
  postContainer: {
    marginBottom: 30,
  },
  postText: {
    fontSize: 14,
    marginBottom: 5,
  },
  tituloPost: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postContent: {
    height: 210,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    marginBottom: 8,
    position: 'relative',
    justifyContent:'center',
    alignItems:'center'
  },
  containerConf: {
    alignSelf: 'center',
    paddingLeft: 5,
  },
  fotoUser: {
    width: 40,
    height: 40,
    borderRadius: 25,
  },
  arrobaUser: {
    fontSize: 12,
    color: '#666',
  },
  horaPost: {
    fontSize: 10,
    color: '#666',
    paddingLeft: 10,
    alignSelf: 'center',
  },
  containerConteudo: {
    paddingTop: 5,
  },
  coracaoOverlay: {
    position: 'absolute',
    top: '0%',
    left: '0%',
    zIndex: 1,
    opacity: 1,
    alignItems:'center',
    justifyContent:'center',
    width:'100%',
    height:'100%'
  },
});