import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator, FlatList, Image, TouchableOpacity, Pressable } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import Configuracoes from './Configurações/configuracoes';
import Comentario from './Comentario';
import Compartilhar from '../Components/Compartilhar';
import Icon from "react-native-vector-icons/Feather";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/pt-br';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalPostagem from "./ModalPostagem";
import colors from '../colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import host from '../global';

export default function Post({ idUser = null, idPostUnico, tipo,pesquisa}) {
  const navigation = useNavigation();
  const [perfilProprio, setPerfilProprio] = useState(false)
  const [loading, setLoading] = useState(false);

  const modalRef = useRef();
  const modalPostRef = useRef();
  const handleOpenModal = (id) => {
    if (modalRef.current) {
      modalRef.current.abrirModal(id);
    } else {
      console.log("modalRef ainda não está disponível.");
    }
  };
 function abrirPost(id) {
  navigation.navigate('PostUnico', { idPost: id });
}
  function fecharModalPost(id) {
    modalPostRef.current.fecharModalPost(id)
  }

  async function verificarLogin() {
    const idUserSalvo = await AsyncStorage.getItem('idUser');
    if (idUserSalvo) {
      let id = idUserSalvo
      return id
    } else {
      navigation.navigate('Login')
    }
  }

  const [mostrarCoracao, setMostrarCoracao] = useState({});

  const [posts, setPosts] = useState([]);
  const [verificarLoginUser, SetverificarLoginUser] = useState(false);
  const [teste, setteste] = useState(false);

  dayjs.extend(relativeTime);
  dayjs.locale('pt-br')
  useEffect(() => {
    const fetchPosts = async () => {

      setLoading(true)

      const idUserSalvo = await AsyncStorage.getItem('idUser');
      if (idUser) {
        if (idUser == idUserSalvo) {
          setPerfilProprio(true)
        }
        const id = idUser;
        if (tipo) {
          if (tipo == 'normais') {
            console.log("aa")
            url = `http://${host}:8000/api/posts/6/${id}/100/0/0`;
          } else {
            url = `http://${host}:8000/api/posts/5/${id}/100/0/0`;
          }
         
        } else {
          url = `http://${host}:8000/api/posts/2/${id}/100/0/0`;
        }
      } else {
        if (idUserSalvo) {
          SetverificarLoginUser(true)
          id = idUserSalvo;
          url = `http://${host}:8000/api/posts/1/${id}/30/0/0`;

        } else{
          id = 0,
          url = `http://${host}:8000/api/posts/0/${id}/50/0/0`
        }
      }
      if (idPostUnico) {
        url = `http://${host}:8000/api/posts/4/${idPostUnico}/1/0/0`
      }
      if(pesquisa){
         url = `http://${host}:8000/api/posts/3/0/50/0/${pesquisa}`
      }
      if(tipo && tipo == 'instituicao'){
        url = `http://${host}:8000/api/posts/7/${id}/50/0/0`;
      }
       if(tipo && tipo == 'maisCurtidos'){
        url = `http://${host}:8000/api/posts/8/${id}/5/0/0`;
      }
  
      const response = await axios.get(url);

      setPosts(response.data.data)
   
      setLoading(false)
    };

    fetchPosts();
    console.log(posts)
  }, []);
  const formatarTempoInsercao = (seconds) => {
    return dayjs().subtract(seconds, 'seconds').fromNow();
  };
  let lastTap = null;


  const [curtidos, setCurtidos] = useState({});
  async function curtirposts(idPost, curtida_banco) {
    const idUserSalvo = await verificarLogin()
    console.log(idPost, idUserSalvo)
    if (curtidos[idPost] === true || curtida_banco === 1) {
      url = `http://${host}:8000/api/posts/interacoes/descurtir`;
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
      url = `http://${host}:8000/api/posts/interacoes/curtir`;
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
    <View style={[styles.container]}>
      <FlatList
        data={posts}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id_post.toString()}
        contentContainerStyle={{ paddingBottom: 30 }}
        ListHeaderComponent={
          <>
            <StatusBar style="auto" />
            {loading && (
              <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                zIndex: 99,
                width: '100%',
                height: 100,
              }}>
                <ActivityIndicator size="large" color="#3498db" />
              </View>
            )}
          </>
        }
        renderItem={({ item }) => {
          async function verificarCurtida(idPost) {
            const resposta = await curtirposts(idPost, item.curtiu_post);
            if (resposta === 1) {
              item.curtiu_post = 0;
              item.curtidas -= 1;
            } else {
              item.curtidas += 1;
              setMostrarCoracao(prev => ({ ...prev, [idPost]: true }));
              setTimeout(() => {
                setMostrarCoracao(prev => ({ ...prev, [idPost]: false }));
              }, 500);
            }
          }

          function doiscliques(idPost) {
            const now = Date.now();
            const DOUBLE_PRESS_DELAY = 300;
            if (lastTap && (now - lastTap) < DOUBLE_PRESS_DELAY) {
              verificarCurtida(idPost);
            }
            lastTap = now;
          }

          const curtido = item.curtiu_post === 1 || curtidos[item.id_post] === true;

          return (
            <View style={styles.postContainer}>
              <View style={styles.postHeader}>
                <Pressable
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                  onPress={() => {
                    navigation.navigate('Perfil', {
                      idUserPerfil: item.id_user,
                      titulo: item.arroba_user
                    });
                  }}>
                  <Image
                    source={{ uri: `http://${host}:8000/img/user/fotoPerfil/${item.img_user}` }}
                    style={styles.fotoUser}
                  />
                  <View style={{ paddingLeft: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={styles.institutionText}>
                        {item.nome_user}
                        {item.instituicao == 1 && (
                          <Ionicons style={styles.instIcon} name="school-outline" />
                        )}
                      </Text>
                      <Text style={styles.horaPost}> · </Text>
                      <Text style={styles.horaPost}>
                        {formatarTempoInsercao(item.tempo_insercao)}
                      </Text>
                    </View>
                    <Text style={styles.arrobaUser}>@{item.arroba_user}</Text>
                  </View>
                </Pressable>

                {idUser ? (
                  perfilProprio ? (
                    <Configuracoes
                      arroba={item.arroba_user}
                      idPost={item.id_post}
                      userPost={item.id_user}
                      segueUsuario={item.segue_usuario}
                      tipo="postProprio"
                    />
                  ) : (
                    <Configuracoes
                      arroba={item.arroba_user}
                      idPost={item.id_post}
                      userPost={item.id_user}
                      segueUsuario={item.segue_usuario}
                      tipo="postPerfil"
                    />
                  )
                ) : (
                  <Configuracoes
                    arroba={item.arroba_user}
                    idPost={item.id_post}
                    userPost={item.id_user}
                    segueUsuario={item.segue_usuario}
                    tipo="post"
                  />
                )}
              </View>

              <View style={styles.containerConteudo}>
                <Text style={styles.postText}>{item.descricao_post}</Text>
                {item.conteudo_post && (
                  <Pressable
                    style={styles.postContent}
                    onPress={() => doiscliques(item.id_post)}>
                    <Image
                      style={{ width: '100%', height: '100%', borderRadius: 8 }}
                      source={{ uri: `http://${host}:8000/img/user/imgPosts/${item.conteudo_post}` }}
                    />
                  </Pressable>
                )}
              </View>

              {item.repost_id != null && (
                <Pressable
                  style={styles.containerRepost}
                  onPress={() => navigation.navigate('PostUnico', {
                    idPost: item.repost_id,
                    titulo: item.repost_arroba
                  })}>
                  <View style={styles.postHeader}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
                      <Image
                        source={{ uri: `http://${host}:8000/img/user/fotoPerfil/${item.repost_img}` }}
                        style={styles.fotoUserRepost}
                      />
                      <View style={{ paddingLeft: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Text style={styles.institutionTextRepost}>{item.repost_autor}</Text>
                          <Text style={styles.horaPost}> · </Text>
                          <Text style={styles.horaPost}>
                            {formatarTempoInsercao(item.tempo_repostado)}
                          </Text>
                        </View>
                        <Text style={styles.arrobaUser}>@{item.repost_arroba}</Text>
                      </View>
                    </View>
                  </View>
                  <Text style={styles.postTextRepost}>{item.repost_descricao}</Text>
                  {item.repost_conteudo && (
                    <View style={styles.postContentRepost}>
                      <Image
                        style={{ width: '100%', height: '100%', borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}
                        source={{ uri: `http://${host}:8000/img/user/imgPosts/${item.repost_conteudo}` }}
                      />
                    </View>
                  )}
                </Pressable>
              )}

              <View style={styles.postActions}>
                <TouchableOpacity style={styles.actionButton} onPress={() => verificarCurtida(item.id_post)}>
                  <MaterialIcons
                    name={curtido ? "favorite" : "favorite-border"}
                    size={22}
                    color={curtido ? "#ff0000" : "#666"}
                  />
                  <Text style={styles.QuantidadeAction}>{item.curtidas}</Text>
                </TouchableOpacity>

                {!idPostUnico && (
                  <View style={styles.actionButton}>
                    <Comentario idPost={item.id_post} />
                    <Text style={styles.QuantidadeAction}>   {item.comentarios}</Text>
                  </View>
                )}

                <TouchableOpacity style={styles.actionButton} onPress={() => handleOpenModal(item.id_post)}>
                  <Icon name="repeat" size={19} color="#666" />
                  <Text style={styles.QuantidadeAction}>{item.total_reposts}</Text>
                </TouchableOpacity>

                <View style={styles.containerShare}>
                  <Compartilhar />
                </View>

                <ModalPostagem ref={modalRef} idPostRepost={true} />
              </View>
            </View>
          );
        }}
      />
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    
    backgroundColor: '#fff',
    width: '100%',
    height:'auto',
    flexGrow: 1

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
    justifyContent: 'start',
    paddingHorizontal: 5,

    gap: 20

  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  QuantidadeAction: {
    fontSize: 13,
    fontWeight: 500,
    color: '#666'
  },
  postContent: {
    height: 280,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    marginBottom: 8,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center'
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
  institutionText: {
    fontWeight: 600,
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
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%'
  },
  containerRepost: {
    paddingTop: 10,
    marginTop: 5,
    borderColor: '#cfd9de',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
  },
  fotoUserRepost: {
    width: 30,
    height: 30,
    borderRadius: 25,
  },
  institutionTextRepost: {
    fontSize: 11,
    fontWeight: 600,
  },
  postContentRepost: {
    height: 250,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center'
  },
  postTextRepost: {
    fontSize: 14,
    marginBlock: 10,
    paddingInline: 10,

  },
  instIcon:{
    fontSize: 18,
    fontWeight: 700,
    color:colors.azul,
    marginLeft:8
},
});

