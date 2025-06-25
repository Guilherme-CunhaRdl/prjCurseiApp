import React, { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, Share, Alert, Modal, StyleSheet, Text, View, FlatList, Image, Pressable, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
import host from '../global';
import colors from '../colors';
import { TextInput } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTema } from '../context/themeContext';
//conteudo seria o post
export default function EnviarPostPv({idUserLogado, idChat}) {
  const modalRef = useRef(null);
  const [visivel, setVisivel] = React.useState(false);
  const [postsSelecionados, setPostsSelecionados] = useState([]);
  const [campoMsg, setCampoMsg] = useState('');
  const [posts, setPosts] = useState([]);
  const {tema} = useTema();
 
  

  const abrirModal = () => setVisivel(true);

  const fecharModal = () => {
    modalRef.current?.fadeOutDown(300).then(() => setVisivel(false));
  };

  const selecionarCompartilhamento = (item) => {
    if(postsSelecionados.includes(item)){
      setPostsSelecionados(postsSelecionados.filter(i => i !== item))
    }else{
      setPostsSelecionados([...postsSelecionados, item])
    }
  }
      console.log(postsSelecionados)

 const enviarPost = async () => {
  const id = await AsyncStorage.getItem('idUser');
  console.log('idLogado', id)
  if (postsSelecionados.length === 0) return;
  

  try {
    const dados = await Promise.all(
      postsSelecionados.map(async (post) => {
        console.log({
  idChat,
  conteudoMensagem: null,
  idEnviador: id,
  idPost: post
});
        await axios.post(`http://${host}:8000/api/cursei/chat/enviarMensagem/semImagem`, {
          idChat: idChat,
          conteudoMensagem: null,
          idEnviador: id,
          idPost: post
        });
      })
    );
    console.log(dados)

    setCampoMsg('');
    setPostsSelecionados([]);
    fecharModal();

    Alert.alert('Sucesso', 'Post enviado com sucesso!');

  } catch (error) {
    console.error("Erro ao enviar mensagens:", error);
    Alert.alert('Erro', 'Falha ao enviar o post');
  }
};

 const carregarPosts = async () => {
    const url = `http://${host}:8000/api/posts/6/${idUserLogado}/100/0/${idUserLogado}`;

    const resposta = await axios.get(url);
    setPosts(resposta.data.data)
    console.log(resposta)

  }

  useEffect(()=> {
    carregarPosts()
  },[]);

return (
  <>
   <Pressable style={styles.circuloPost} onPress={abrirModal}>
        <Image source={require("../../assets/LogoBranca.png")} style={styles.iconSmall} />
    </Pressable>

    {/* Modal */}
    <Modal
      transparent
      visible={visivel}
      onRequestClose={fecharModal}
    >
      <View style={styles.fundoModal}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={fecharModal}
        />

        <Animatable.View
          ref={modalRef}
          animation="fadeInUp"
          duration={300}
          style={[styles.modal, { backgroundColor: tema.modalFundo }]}
        >
          <View style={styles.cabecalho}>
            <TouchableOpacity onPress={fecharModal} style={styles.botaoFechar}>
              <Ionicons name="close" size={24} color={tema.iconeInativo} />
            </TouchableOpacity>
            <Text style={[styles.titulo, { color: tema.texto }]}>Compartilhar post</Text>
          </View>

          
            <ScrollView contentContainerStyle={styles.containerChat}>
  {posts.map((item, index) => (
    <View key={item.id_post} style={styles.boxPost}>
      <TouchableOpacity style={[styles.botaoPost, postsSelecionados.includes(item.id_post) && {backgroundColor: tema.azul}]} onPress={() => selecionarCompartilhamento(item.id_post)}>
        {postsSelecionados.includes(item.id_post) && (
          <Ionicons name='checkmark' size={20} color="#fff" />
        )}
        
      </TouchableOpacity>
      <View style={styles.containerImgPost}>
        <Image
          style={styles.imagemPost}
          source={{ uri: `http://${host}:8000/img/user/imgPosts/${item.conteudo_post}` }}
        />
      </View>
      <Text>{item.id_post}</Text>
    </View>
  ))}

</ScrollView>
  {postsSelecionados.length > 0 && (
    <>
    <Pressable onPress={() => enviarPost()}>
      <Text>Enviar</Text>
    </Pressable>
    </>
  )}

              </Animatable.View>
              </View>
    </Modal>
  </>
);
}

const styles = StyleSheet.create({
  fundoModal: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  modal: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFF4',
  },
  botaoFechar: {
    marginRight: 16,
  },
  titulo: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    flex: 1,
    textAlign: 'center',
    marginRight: 24,
  },
  opcoes: {
    marginVertical: 12,
  },
  opcao: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 4,
  },
  iconeOpcao: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textos: {
    flex: 1,
  },
  nome: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  descricao: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2,
  },
containerChat: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  padding: 10,
},


  boxSelecionado:{
    width : 100,
    height: '100%',
   marginInline: 3,
   padding: 10,
   backgroundColor: colors.azul,
   borderRadius: 10
  },
  boxImagem:{
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    height: '70%'
  },
  circuloImagem:{
    borderRadius: 100,
    width: 80,
    height: 80
  },
  imagemChat:{
    height: '100%',
    width: '100%',
    borderRadius: 100,
    
  },
  containerEnviarMsg:{
    paddingBlock: 10,
    width: '100%'
  },
  boxInputImg:{
    padding: 10,
    height: 80,
    alignItems: 'center',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
   input: {
    fontSize: 14,
    paddingVertical: 4,
    paddingHorizontal: 8,
    color: "#000",
    width: '70%',
    borderWidth: 0
  },
  imagemPostPreview:{
    borderRadius: 10,
    height: 75,
    width: 75
  },
  botaoEnviar:{
    width: '100%',
    padding: 10,
    backgroundColor: colors.azul,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 15
  },
  circuloPost:{
    width: 45,
    height: 45,
    borderRadius: 100,
    backgroundColor: colors.azul,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconSmall:{
    width: 20,
    height: 20
  },
 boxPost: {
  width: '48%',         
  aspectRatio: 1,        
  marginBottom: 15,
  backgroundColor: '#eee',
  borderRadius: 8,
  overflow: 'hidden',
  position: 'relative',
},
botaoPost: {
  width: 24,
  height: 24,
  justifyContent: 'center',
  alignItems: 'center',
  position: 'absolute',
  top: 8,
  right: 8,
  backgroundColor: 'red',
  borderRadius: 12,
  zIndex: 1,
},
containerImgPost: {
  flex: 1,
},
imagemPost: {
  width: '100%',
  height: '100%',
  resizeMode: 'cover',
},


});