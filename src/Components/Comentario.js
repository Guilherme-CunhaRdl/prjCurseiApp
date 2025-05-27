
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform, Image, Pressable, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Feather";
import dayjs from 'dayjs';
import host from '../global';
import {useTema} from '../context/themeContext';
import { temaClaro } from '../themes';

export default function Comentario({ idPost }) {
  const {tema} = useTema();
  const navigation = useNavigation();
  const [modalVisivel, setModalVisivel] = useState(false);
  const [comentario, setComentario] = useState('');
  const refConteudoModal = useRef(null);
  const [loading, setLoading] = useState(true);
  const [curtidasEmProcesso, setCurtidasEmProcesso] = useState([]); // Array de IDs em processo

  async function buscarComentarios(idPost) {
    const idUserSalvo = await AsyncStorage.getItem('idUser');
    url = `http://${host}:8000/api/posts/interacoes/comentarios`;
    const post = {
      idPost: idPost,
      idUser: idUserSalvo
    }
    response = await axios.post(url, post)
    const resposta = response.data;

    return resposta;
  }
  const [comentarios, setComentarios] = useState([]);
  function carregarComentarios(comentariosAPI) {
    const listaComentarios = comentariosAPI.map(comentario => {
      const usuario = comentario.usuario || {};
      return {
        id: comentario.id,
        idUserComent: comentario.id_user,
        usuario: usuario.arroba_user || 'Usuário desconhecido',
        tempoCriacao: formatarTempoInsercao(comentario.tempo_insercao),
        texto: comentario.comentario || '',
        curtidas: comentario.total_curtidas,
        curtido: comentario.curtiu == 1 ? true : false,

        foto: usuario.img_user
          ? `http://${host}:8000/img/user/fotoPerfil/${usuario.img_user}`
          : 'https://via.placeholder.com/150', // imagem padrão
      };
    });

    setComentarios(listaComentarios);
    setLoading(false)

  }

  const formatarTempoInsercao = (seconds) => {
    return dayjs().subtract(seconds, 'seconds').fromNow();
  };

  const abrirModal = async () => {
    setModalVisivel(true);
    const comentarios = await buscarComentarios(idPost);
    carregarComentarios(comentarios);
  };

  const fecharModal = () => {
    refConteudoModal.current.slideOutDown(300).then(() => setModalVisivel(false));
    

  };

  const curtirComentario = async (id) => {

    if (curtidasEmProcesso.includes(id)) {
      return;
    }

    setCurtidasEmProcesso((prev) => [...prev, id]);
    const comentarioCurtido = comentarios.find((item) => item.id === id);
    const idUserSalvo = await AsyncStorage.getItem('idUser');

    const NovaCurtida = {
      idComentario: id,
      idUser: idUserSalvo,
      acao: comentarioCurtido.curtido ? 'descurtir' : 'curtir',
    };

    try {
      await axios.post(`http://${host}:8000/api/posts/interacoes/curtirComentario`, NovaCurtida);

      setComentarios((prevComentarios) =>
        prevComentarios.map((item) =>
          item.id === id
            ? {
              ...item,
              curtido: !comentarioCurtido.curtido,
              curtidas: comentarioCurtido.curtido
                ? item.curtidas - 1
                : item.curtidas + 1,
            }
            : item
        )
      );
    } catch (error) {
      console.error('Erro ao curtir/descurtir:', error);
    } finally {

      setCurtidasEmProcesso((prev) => prev.filter((itemId) => itemId !== id));
    }
  };

  const adicionarComentario = async () => {
    if (comentario.trim() === '') return;
    const idUserSalvo = await AsyncStorage.getItem('idUser');
    if (!idUserSalvo) {
      fecharModal();
      navigation.navigate('Login')
      return;
    } else {
      const Createcomentario = {
        idPost: idPost,
        idUser: idUserSalvo,
        comentario: comentario
      }
      const comentar = await axios.post(`http://${host}:8000/api/posts/interacoes/comentar`, Createcomentario)
      const novoComentario = {
        id: comentar.data.comentario.id,
        usuario: comentar.data.usuario[0].arroba_user,
        idUserComent: comentar.data.usuario[0].id,
        tempoCriacao: formatarTempoInsercao(0),
        texto: comentario,
        curtidas: 0,
        curtido: false,

        foto: `http://${host}:8000/img/user/fotoPerfil/${comentar.data.usuario[0].img_user}`
      };

      setComentarios([novoComentario, ...comentarios]);
      setComentario('');
    }
  };




  const ItemComentario = React.memo(({ usuario, tempoCriacao, texto, curtidas, curtido, foto, id, idUserComent }) => {


    useEffect(() => {

    },);

    return (
      <View style={styles.itemComentario}>
        <Pressable style={styles.cabecalhoComentario} onPress={() => {
          navigation.navigate('Perfil', {
            idUserPerfil: idUserComent,
            titulo: usuario
          }); fecharModal()
        }}>

          <Image source={{ uri: foto }} style={styles.fotoUsuario} />
          <View style={styles.infoUsuario}>
            <Text style={styles.nomeUsuario}>@{usuario}</Text>
            <Text style={styles.tempo}> • {tempoCriacao}</Text>
          </View>
        </Pressable>
        <Text style={styles.textoComentario}>{texto}</Text>
        <View style={styles.acoesComentario}>
          <Pressable
            style={styles.botaoCurtir}
            onPress={() => curtirComentario(id)}
          >
            <Ionicons
              name={curtido ? "heart" : "heart-outline"}
              size={14}
              color={curtido ? "#ff0000" : "#666"}
            />
            <Text style={[styles.contadorCurtidas, curtido && styles.curtido]}>
              {curtidas}
            </Text>
          </Pressable>

        </View>
      </View>
    );
  });
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{flexGrow:1,width:20}}
        onPress={abrirModal}
      >
        <Icon name="message-circle" size={20} color="#666" />


      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisivel}
        onRequestClose={fecharModal}
      >
        <View style={styles.fundoModal}>


          <KeyboardAvoidingView
            style={styles.containerTeclado}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adicione isso
          >
            <Animatable.View
              ref={refConteudoModal}
              animation="slideInUp"
              duration={300}
              style={[styles.conteudoModal ,{backgroundColor:tema.modalFundo}]}
            >


              <View style={styles.cabecalhoModal}>
                <TouchableOpacity
                  style={styles.botaoFechar}
                  onPress={fecharModal}
                >
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
                <Text style={[styles.tituloModal ,{color:tema.iconeInativo}]}>Comentários</Text>
                <View style={styles.espacadorCabecalho} />
              </View>

              {loading ? (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', zIndex: 99, width: '100%', height: '100%', backgroundColor: 'transparent' }}>
                <ActivityIndicator size="large" color="#3498db" />
              </View>
              ) : (!loading && comentarios?.length === 0 ? (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', zIndex: 99, width: '100%', height: '100%', backgroundColor: 'transparency' }}>
                <Text style={{ fontSize: 20, color: '#666', fontWeight: 600 }}>Ainda não há comentários</Text>
              </View>
              ) : <ScrollView style={styles.listaComentarios}>
                {comentarios.map((comentario) => (
                  <ItemComentario
                    key={comentario.id}
                    id={comentario.id}
                    usuario={comentario.usuario}
                    tempoCriacao={comentario.tempoCriacao} // Corrigido aqui
                    texto={comentario.texto}
                    curtidas={comentario.curtidas}
                    curtido={comentario.curtido}
                    foto={comentario.foto}
                    idUserComent={comentario.idUserComent}
                  />
                ))}

              </ScrollView>)
              }

              <View style={[styles.containerInput ,{backgroundColor:tema.modalFundo ,borderTopColor: tema.linha}]}>
                <TextInput
                  style={[styles.inputComentario ,{backgroundColor:tema.modalFundo}]}
                  placeholder="Escreva seu comentário..."
                  placeholderTextColor="#999"
                  value={comentario}
                  onChangeText={setComentario}
                  onSubmitEditing={adicionarComentario}
                  keyboardType='text'
                />

                <TouchableOpacity
                  style={styles.botaoEnviar}
                  onPress={adicionarComentario}
                >
                  <Ionicons name="send" size={20} color="#4a69bd" />
                </TouchableOpacity>

              </View>
            </Animatable.View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
  },


  curtido: {
    color: '#ff0000',
  },
  fundoModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  containerTeclado: {
    flex: 1,
    justifyContent: 'flex-end',
    
  },
  conteudoModal: {
    
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: "90%",
    maxHeight: "91%",
  },
  cabecalhoModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  espacadorCabecalho: {
    width: 24,
  },
  tituloModal: {
    fontSize: 18,
    fontWeight: 'bold',
    
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  botaoFechar: {
    zIndex: 1,
    padding: 4,
  },
  listaComentarios: {
    paddingHorizontal: 16,
  },
  itemComentario: {
    paddingVertical: 10,

  },
  cabecalhoComentario: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: -8,
  },
  fotoUsuario: {
    width: 35,
    height: 35,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#eee'
  },
  infoUsuario: {
    flexDirection: 'row',
    alignItems: 'baseline',

  },
  nomeUsuario: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#333',
  },
  tempo: {
    color: '#666',
    fontSize: 11,
  },
  textoComentario: {
    fontSize: 12,
    marginBottom: 5,
    color: '#444',
    marginLeft: 47 // alinhar com o texto
  },
  acoesComentario: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    marginLeft: 50, // alinhar com o texto
  },
  botaoCurtir: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  contadorCurtidas: {
    color: '#666',
    fontSize: 11,
    marginLeft: 4,
  },
  botaoResponder: {},
  textoResponder: {
    color: '#666',
    fontSize: 12,
  },
  containerInput: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
  },

  inputComentario: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 25,
    paddingVertical: 10,
    paddingRight: 40,
    fontSize: 15,
    backgroundColor: '#f9f9f9',
  },
  botaoEnviar: {
    position: 'absolute',
    right: 20,
    padding: 8,
  },
});

