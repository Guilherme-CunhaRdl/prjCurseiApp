
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Feather";
import Post from './Post';
import colors from '../colors';

export default function ModalPosts() {

 async function buscarComentarios(idPost) {
    url = 'http://localhost:8000/api/posts/interacoes/comentarios';
    const post ={
     idPost: idPost
    }
    response = await axios.post(url,post)
    const resposta = response.data;
    carregarComentarios(resposta)
    return resposta;
  }
   const [comentarios, setComentarios] = useState([]);
    function carregarComentarios(comentariosAPI) {
      const listaComentarios = comentariosAPI.map(comentario => {
        const usuario = comentario.usuario || {};
        return {
          id: comentario.id,
          usuario: usuario.arroba_user || 'Usuário desconhecido',
          tempoCriacao: new Date(Date.now() - 3600000),
          texto: comentario.comentario || '',
          curtidas: 0,
          curtido: false,
          foto: usuario.img_user
            ? `http://localhost:8000/img/user/fotoPerfil/${usuario.img_user}`
            : 'https://via.placeholder.com/150', // imagem padrão
        };
      });
    
      setComentarios(listaComentarios);
    }
    buscarComentarios(77)
 
  
  function formatarTempo(dataCriacao) {


    const agora = new Date();
    const diferenca = agora - dataCriacao;
    const minutos = Math.floor(diferenca / 60000);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);

    if (minutos < 1) return "Agora";
    if (minutos < 60) return `${minutos}min`;
    if (horas < 24) return `${horas}h`;
    if (dias < 7) return `${dias}d`;

    return dataCriacao.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'short'
    });
  }
  const ItemComentario = React.memo(({ usuario, tempoCriacao, texto, curtidas, curtido, foto, id }) => {
    const [tempoFormatado, setTempoFormatado] = useState(formatarTempo(tempoCriacao));

    useEffect(() => {
      const interval = setInterval(() => {
        setTempoFormatado(formatarTempo(tempoCriacao));
      }, 60000); // atualiza a cada 1 min

      return () => clearInterval(interval);
    }, [tempoCriacao]);

    return (
      <View style={styles.itemComentario}>
        <View style={styles.cabecalhoComentario}>
          <Image source={{ uri: foto }} style={styles.fotoUsuario} />
          <View style={styles.infoUsuario}>
            <Text style={styles.nomeUsuario}>@{usuario}</Text>
            <Text style={styles.tempo}> • {tempoFormatado}</Text>
          </View>
        </View>
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
      <Modal
          style={styles.modalTelaCheia}
          animationType="slide"
          transparent={true}
          visible={true}
          
        >
        <ScrollView style={styles.containerModal}>
          <View style={styles.cabecalho}>
                        <TouchableOpacity onPress>
                          <Icon name="x" size={24} color="#000" />
                        </TouchableOpacity>
                        <Text style={styles.titulo}>Post de @viado</Text>
    
                      </View>
        <View style={styles.post}>
          <Post idPostUnico={77} />
          </View>  
          <ScrollView style={styles.listaComentarios}>
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
                            />
                          ))}
                        </ScrollView>
        </ScrollView>


           <View style={styles.containerInput}>
                          <TextInput
                            style={styles.inputComentario}
                            placeholder="Escreva seu comentário..."
                            placeholderTextColor="#999"
                            // value={comentario}
                            // onChangeText={setComentario}
                            // onSubmitEditing={adicionarComentario}
                          />
          
                          <TouchableOpacity
                            style={styles.botaoEnviar}
                            
                          >
                            <Ionicons name="send" size={20} color="#4a69bd" />
                          </TouchableOpacity>
          
                        </View>
        </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTelaCheia: {
    flex: 1,
    
    zIndex: 99,
  },
  containerModal:{
    backgroundColor:colors.branco
  },
    cabecalho: {
    flexDirection: "row",
    justifyContent: "start",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    gap:20,
    borderBottomColor: "#eee",
  },
  titulo: {
    fontWeight: "bold",
    fontSize: 15,
  },
  post:{
   
    padding:15
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
    width: 35,
    height: 35,
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
});


