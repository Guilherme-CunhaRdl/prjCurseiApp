
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform, Image, ActivityIndicator, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from "react-native-vector-icons/Feather";
import Post from '../../Components/Post';
import colors from '../../colors';
import dayjs from 'dayjs';
import host from '../../global';
export default function PostUnico() {
  const route = useRoute();
  const rotavalores = route.params;
  const navigation = useNavigation();
  const [comentario, setComentario] = useState('');
  const [idPost, setIdPost] = useState(rotavalores.idPost);
  const [loading, setLoading] = useState(false);
  const [curtidasEmProcesso, setCurtidasEmProcesso] = useState([]); // Array de IDs em processo

  async function carregarPost(id) {
    setLoading(true)
    await buscarComentarios(id)
    setLoading(false)

  }

  useEffect(() => {
    carregarPost(rotavalores.idPost);

  }, []);

  async function buscarComentarios(idPost) {
    const idUserSalvo = await AsyncStorage.getItem('idUser');
    url = `http://${host}:8000/api/posts/interacoes/comentarios`;
    const post = {
      idPost: idPost,
      idUser: idUserSalvo
    }
    response = await axios.post(url, post)
    const resposta = response.data;

    carregarComentarios(resposta)
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

      navigation.navigate('Login')
    } else {
      const Createcomentario = {
        idPost: idPost,
        idUser: idUserSalvo,
        comentario: comentario
      }
      
      const comentar = await axios.post(`http://${host}:8000/api/posts/interacoes/comentar`,Createcomentario
        , {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
    
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

  useEffect(() => {

  }, []);
  const ItemComentario = React.memo(({ usuario, tempoCriacao, texto, curtidas, curtido, foto, id, idUserComent }) => {



    return (
      <View style={styles.itemComentario}>
        <Pressable style={styles.cabecalhoComentario} onPress={() => {
          navigation.navigate('Perfil', {
            idUserPerfil: idUserComent,
            titulo: usuario
          })
        }}>
          <Image source={{ uri: foto }} style={styles.fotoUsuario} />
          <View style={styles.infoUsuario}>
            <Text style={styles.nomeUsuario}>@{usuario}</Text>
            <Text style={styles.tempo}> • {tempoCriacao}</Text>
          </View>
        </Pressable>
        <Text style={styles.textoComentario}>{texto}</Text>
        <View style={styles.acoesComentario}>
          <TouchableOpacity
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
          </TouchableOpacity>

        </View>
      </View>
    );
  });
  return (
    <View style={styles.container}>

      <ScrollView style={styles.containerModal}>

        {loading ? (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#fff", position: 'fixed', zIndex: 99, width: '100%', height: '100%' }}>
          <ActivityIndicator size="large" color="#3498db" />
        </View>
        ) : null}

        <View style={styles.post}>

          <Post idPostUnico={idPost} />
        </View>
        <ScrollView style={styles.listaComentarios}>
          <Text style={styles.tituloComentarios}>Comentarios ({comentarios.length})</Text>
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
        </ScrollView>
      </ScrollView>


      <View style={styles.containerInput}>
        <TextInput
          style={styles.inputComentario}
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

    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  modalTelaCheia: {
    flex: 1,
    zIndex: 99,
    width: '100%'
  },
  containerModal: {
    backgroundColor: colors.branco
  },
  cabecalho: {
    flexDirection: "row",
    justifyContent: "start",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    gap: 20,
    borderBottomColor: "#eee",
  },
  titulo: {
    fontWeight: "bold",
    fontSize: 15,
  },
  post: {

    paddingInline: 15,
    paddingTop: 20
  },

  itemComentario: {
    paddingVertical: 10,

  },
  listaComentarios: {
    paddingHorizontal: 16,
  },
  cabecalhoComentario: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: -8,
  },
  fotoUsuario: {
    width: 45,
    height: 45,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#eee'
  },
  infoUsuario: {
    flexDirection: 'row',
    alignItems: 'baseline',

  },
  nomeUsuario: {
    fontWeight: 'bold',
    fontSize: 14,
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
    borderTopColor: '#eee',
    backgroundColor: '#fff',
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
  tituloComentarios: {
    fontSize: 15,
    fontWeight: 500,
    color: '#666',
    marginBottom: 15
  },
});

