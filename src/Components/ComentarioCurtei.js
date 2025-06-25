import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform, Image, Pressable, ActivityIndicator, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Feather";
import dayjs from 'dayjs';
import host from '../global';
import { useTema } from '../context/themeContext';

export default function ComentarioCurtei({ idCurtei, isVisible, onClose }) {
  const { tema } = useTema();
  const navigation = useNavigation();
  const [modalVisivel, setModalVisivel] = useState(false);
  const [comentario, setComentario] = useState('');
  const refConteudoModal = useRef(null);
  const [loading, setLoading] = useState(true);
  const [curtidasEmProcesso, setCurtidasEmProcesso] = useState([]);
  const [comentarios, setComentarios] = useState([]);

  useEffect(() => {
    if (isVisible) {
      setModalVisivel(true);
      carregarComentariosHandler();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  async function buscarComentarios(idCurtei) {
    try {
      const idUserSalvo = await AsyncStorage.getItem('idUser');
      const url = `http://${host}:8000/api/curtei/comentarios`;
      const response = await axios.post(url, {
        id_curtei: idCurtei,
        id_user: idUserSalvo
      });
      if (response.data && Array.isArray(response.data.comentarios)) {
        return response.data.comentarios;
      }
      return [];
    } catch (error) {
      console.error('Erro ao buscar comentários:', error);
      return [];
    }
  }

  const carregarComentariosHandler = async () => {
    try {
      setLoading(true);
      const comentariosAPI = await buscarComentarios(idCurtei);
      carregarComentarios(comentariosAPI);
    } catch (error) {
      console.error('Erro ao carregar comentários:', error);
      setLoading(false);
    }
  };

  function carregarComentarios(comentariosAPI) {
    const listaComentarios = comentariosAPI.map(comentario => {
      const usuario = comentario.usuario || {};
      return {
        id: comentario.id,
        idUserComent: comentario.id_user,
        usuario: usuario.arroba_user || 'Usuário desconhecido',
        tempoCriacao: formatarTempoInsercao(comentario.created_at),
        texto: comentario.comentario || '',
        curtidas: comentario.curtidas_count || 0,
        curtido: comentario.curtiu || false,
        foto: usuario.img_user
          ? `http://${host}:8000/img/user/fotoPerfil/${usuario.img_user}`
          : 'https://via.placeholder.com/150',
      };
    });

    setComentarios(listaComentarios);
    setLoading(false);
  }

  const formatarTempoInsercao = (dateString) => {
    return dayjs(dateString).fromNow();
  };

  const fecharModal = () => {
    refConteudoModal.current.slideOutDown(300).then(() => {
      onClose();
    });
  };

  const curtirComentario = async (id) => {
    if (curtidasEmProcesso.includes(id)) return;

    setCurtidasEmProcesso(prev => [...prev, id]);
    const comentarioCurtido = comentarios.find(item => item.id === id);
    const idUserSalvo = await AsyncStorage.getItem('idUser');

    try {
      const response = await axios.post(`http://${host}:8000/api/curtei/comentarios/curtir`, {
        id_comentario: id,
        id_user: idUserSalvo,
        acao: comentarioCurtido.curtido ? 'descurtir' : 'curtir'
      });

      setComentarios(prevComentarios =>
        prevComentarios.map(item =>
          item.id === id
            ? {
                ...item,
                curtido: !comentarioCurtido.curtido,
                curtidas: response.data.curtidas_count
              }
            : item
        )
      );
    } catch (error) {
      console.error('Erro ao curtir comentário:', error);
    } finally {
      setCurtidasEmProcesso(prev => prev.filter(itemId => itemId !== id));
    }
  };

  const adicionarComentario = async () => {
    if (!comentario.trim()) return;

    const tempId = `temp-${Date.now()}`;
    const idUser = await AsyncStorage.getItem('idUser');

    if (!idUser) {
      navigation.navigate('Login');
      return;
    }

    const novoComentario = {
      id: tempId,
      idUserComent: idUser,
      usuario: "Você",
      tempoCriacao: "agora mesmo",
      texto: comentario,
      curtidas: 0,
      curtido: false,
      foto: 'https://via.placeholder.com/150',
      isTemp: true
    };

    setComentarios(prev => [novoComentario, ...prev]);
    setComentario('');

    try {
      const response = await axios.post(`http://${host}:8000/api/curtei/comentarios/adicionar`, {
        id_curtei: idCurtei,
        id_user: idUser,
        comentario: comentario.trim()
      });

      if (!response.data || !response.data.data) {
        throw new Error('Resposta da API inválida');
      }

      const comentarioReal = {
        id: response.data.data.id.toString(),
        idUserComent: idUser,
        usuario: response.data.data.usuario?.arroba_user || 'usuário',
        tempoCriacao: formatarTempoInsercao(response.data.data.created_at),
        texto: response.data.data.comentario,
        curtidas: 0,
        curtido: false,
        foto: response.data.data.usuario?.img_user
          ? `http://${host}:8000/img/user/fotoPerfil/${response.data.data.usuario.img_user}`
          : 'https://via.placeholder.com/150',
        isTemp: false
      };

      setComentarios(prev =>
        prev.map(com => com.id === tempId ? comentarioReal : com)
      );
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
      setComentarios(prev => prev.filter(com => com.id !== tempId));
      setComentario(comentario);

      Alert.alert('Erro', error.response?.data?.message || error.message || 'Falha ao enviar comentário');
    }
  };

  const ItemComentario = React.memo(({ usuario, tempoCriacao, texto, curtidas, curtido, foto, id, isTemp }) => (
    <View style={styles.itemComentario}>
      <Pressable style={styles.cabecalhoComentario}>
        <Image source={{ uri: foto }} style={styles.fotoUsuario} />
        <View style={styles.infoUsuario}>
          <Text style={styles.nomeUsuario}>@{usuario}</Text>
          {!isTemp && <Text style={styles.tempo}> • {tempoCriacao}</Text>}
          {isTemp && <ActivityIndicator size="small" color="#999" style={{ marginLeft: 5 }} />}
        </View>
      </Pressable>

      <Text style={styles.textoComentario}>{texto}</Text>

      {!isTemp && (
        <View style={styles.acoesComentario}>
          <Pressable
            style={styles.botaoCurtir}
            onPress={() => curtirComentario(id)}
            disabled={curtidasEmProcesso.includes(id)}
          >
            {curtidasEmProcesso.includes(id) ? (
              <ActivityIndicator size="small" color="#ff0000" />
            ) : (
              <>
                <Ionicons
                  name={curtido ? "heart" : "heart-outline"}
                  size={14}
                  color={curtido ? "#ff0000" : "#666"}
                />
                <Text style={[styles.contadorCurtidas, curtido && styles.curtido]}>
                  {curtidas}
                </Text>
              </>
            )}
          </Pressable>
        </View>
      )}
    </View>
  ));

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={fecharModal}
    >
      <View style={styles.fundoModal}>
        <KeyboardAvoidingView
          style={styles.containerTeclado}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <Animatable.View
            ref={refConteudoModal}
            animation={modalVisivel ? "slideInUp" : undefined}
            duration={300}
            style={[styles.conteudoModal, { backgroundColor: tema.modalFundo }]}
          >
            <View style={styles.cabecalhoModal}>
              <TouchableOpacity style={styles.botaoFechar} onPress={fecharModal}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
              <Text style={[styles.tituloModal, { color: tema.iconeInativo }]}>Comentários</Text>
              <View style={styles.espacadorCabecalho} />
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3498db" />
              </View>
            ) : comentarios.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Ainda não há comentários</Text>
              </View>
            ) : (
              <ScrollView style={styles.listaComentarios}>
                {comentarios.map((comentario) => (
                  <ItemComentario key={comentario.id} {...comentario} />
                ))}
              </ScrollView>
            )}

            <View style={[styles.containerInput, { backgroundColor: tema.modalFundo, borderTopColor: tema.linha }]}>
              <TextInput
                style={[styles.inputComentario, { backgroundColor: tema.modalFundo }]}
                placeholder="Escreva seu comentário..."
                placeholderTextColor="#999"
                value={comentario}
                onChangeText={setComentario}
                onSubmitEditing={adicionarComentario}
                keyboardType='text'
              />
              <TouchableOpacity style={styles.botaoEnviar} onPress={adicionarComentario}>
                <Ionicons name="send" size={20} color="#4a69bd" />
              </TouchableOpacity>
            </View>
          </Animatable.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
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
    marginLeft: 47
  },
  acoesComentario: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    marginLeft: 50,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent'
  },
  emptyText: {
    fontSize: 20,
    color: '#666',
    fontWeight: '600'
  }
});