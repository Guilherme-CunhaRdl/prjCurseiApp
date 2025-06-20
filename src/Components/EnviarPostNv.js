import React, { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, Share, Alert, Modal, StyleSheet, Text, View, FlatList, Image, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
import host from '../global';
import colors from '../colors';
import { TextInput } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTema } from '../context/themeContext';
//conteudo seria o post
export default function EnviarPostPv() {
  const modalRef = useRef(null);
  const [visivel, setVisivel] = React.useState(false);
  const [chatsSelecionados, setChatsSelecionados] = useState([]);
  const [campoMsg, setCampoMsg] = useState('');
  const {tema} = useTema();
  const opcoes = [

    {
      nome: 'WhatsApp',
      icone: 'logo-whatsapp',
      cor: '#25D366',
      descricao: 'Enviar para contatos'
    },
    {
      nome: 'Copiar link',
      icone: 'link-outline',
      cor: '#8E8E93',
      descricao: 'Link para este post'
    },
    {
      nome: 'Outros apps',
      icone: 'ellipsis-horizontal',
      cor: '#8E8E93',
      descricao: 'Mais opções'
    },
  ];

 

  const compartilhar = async (opcao) => {
    try {
      const config = {
        message: `""\n\nVeja este post que vi no CURSEI!!!!`,
        title: 'Compartilhar post'
      };

      if (opcao === 'Copiar link') {
        Alert.alert('Link copiado!');
        return;
      }


      await Share.share(config);

    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível compartilhar');
    } finally {
      fecharModal();
    }
  };

  const abrirModal = () => setVisivel(true);

  const fecharModal = () => {
    modalRef.current?.fadeOutDown(300).then(() => setVisivel(false));
  };

  const selecionarCompartilhamento = (item) => {
    if(chatsSelecionados.includes(item)){
      setChatsSelecionados(chatsSelecionados.filter(i => i !== item))
    }else{
      setChatsSelecionados([...chatsSelecionados, item])
    }
  }

 const enviarPost = async () => {
  const mensagem = campoMsg.trim();
  const id = await AsyncStorage.getItem('idUser');
console.log('idLogado', id)
  if (chatsSelecionados.length === 0) return;

  try {
    await Promise.all(
      chatsSelecionados.map(async (idChat) => {
        await axios.post(`http://${host}:8000/api/cursei/chat/enviarMensagem/semImagem`, {
          idChat: idChat,
          conteudoMensagem: mensagem,
          idEnviador: id,
          idPost: idPost
        });
      })
    );

    setCampoMsg('');
    setChatsSelecionados([]);
    fecharModal();

    Alert.alert('Sucesso', 'Post enviado com sucesso!');

  } catch (error) {
    console.error("Erro ao enviar mensagens:", error);
    Alert.alert('Erro', 'Falha ao enviar o post');
  }
};

// useEffect(() => {
//   const pegarPosts = async () => {
//     const id = await AsyncStorage.getItem('idUser');

//   const resposta = await axios.get(`http://${host}:8000/api/cursei/chat/getChats/${id}`);
//   console.log(resposta.data);
// }

// }, []);

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

          
            <View style={styles.containerChat}>
              </View>
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
  containerChat:{
    height: 150,
    width: '100%',
    padding: 10,
    // borderBottomWidth: 1,
    // borderBottomColor: '000'
  },
  boxChat:{
    width : 100,
    height: '100%',
   marginInline: 3,
   padding: 10
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
  }

});