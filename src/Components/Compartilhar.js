import React, { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, Share, Alert, Modal, StyleSheet, Text, View, FlatList, Image, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
import host from '../global';
import colors from '../colors';
import { ActivityIndicator, TextInput } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTema } from '../context/themeContext';
//conteudo seria o post
export default function Compartilhar({ conteudo, chats, imgPost, idPost, idUserLogado }) {
  const modalRef = useRef(null);
  const [visivel, setVisivel] = React.useState(false);
  const [chatsSelecionados, setChatsSelecionados] = useState([]);
  const [campoMsg, setCampoMsg] = useState('');
  const {tema} = useTema();
  const [carregamento, setCarregamento] = useState(false);
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
        message: `"${conteudo}"\n\nVeja este post que vi no CURSEI!!!!`,
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

  const abrirModal = () => {
    setVisivel(true);
    console.log(chatsSelecionados)
  }
  const fecharModal = () => {
    modalRef.current?.fadeOutDown(300).then(() => setVisivel(false));
  };

const selecionarCompartilhamento = (item, tipo) => {
  const index = chatsSelecionados.findIndex(chat => chat.id === item && chat.tipo === tipo);

  if (index !== -1) {
    const novaLista = [...chatsSelecionados];
    novaLista.splice(index, 1);
    setChatsSelecionados(novaLista);
  } else {
    setChatsSelecionados([...chatsSelecionados, { id: item, tipo: tipo }]);
  }
};



 const enviarPost = async () => {
  const mensagem = campoMsg.trim();
  const id = await AsyncStorage.getItem('idUser');
  if (chatsSelecionados.length === 0) return;

  try {
    setCarregamento(true);
    console.log(chatsSelecionados)

    await Promise.all(
      chatsSelecionados.map(async (chat) => {
        await axios.post(`http://${host}:8000/api/cursei/chat/enviarMensagem/semImagem`, {
          idChat: chat.id,
          conteudoMensagem: mensagem,
          idEnviador: id,
          idPost: idPost
        });
      })
    );
     if (mensagem.length > 0) {
    await Promise.all(
      chatsSelecionados.map(async(chat)=>{
       
          await axios.post(`http://${host}:8000/api/cursei/chat/enviarMensagem/semImagem`, {
            idChat: chat.id,
            conteudoMensagem: mensagem,
            idEnviador: id,
            idPost: null
          });
          
        })
      )
    }
    setCampoMsg('');
    setChatsSelecionados([]);
    setCarregamento(false);
    fecharModal();

    Alert.alert('Sucesso', 'Post enviado com sucesso!');

  } catch (error) {
    setCarregamento(false);
    console.error("Erro ao enviar mensagens:", error);
    Alert.alert('Erro', 'Falha ao enviar o post');
  }
};



return (
  <>
    {/* Ícone no post */}
    <TouchableOpacity
      onPress={abrirModal}
      style={styles.icone}
      activeOpacity={0.7}
    >
      <Ionicons name="arrow-redo-outline" size={20} color={tema.iconeInativo} />
    </TouchableOpacity>

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
            <Text style={[styles.titulo, { color: tema.texto }]}>Compartilhar</Text>
          </View>
          {chats.length > 0 && (
          <View>
            <View style={styles.containerChat}>
              <FlatList 
                horizontal={true}
                data={chats}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.tipo === 'canal' ? `canal_${item.id_conversa.toString()}` : `outra_${item.id_conversa.toString()}`}
                renderItem={({item}) => (
                  <>
                    <TouchableOpacity
                      style={[
                        styles.boxChat, 
                        chatsSelecionados.some(chat => chat.id === item.id_conversa && chat.tipo === item.tipo) && styles.boxSelecionado
                      ]}
                      onPress={() => selecionarCompartilhamento(item.id_conversa, item.tipo)}
                    >
                      <View style={styles.boxImagem}>
                        <View style={styles.circuloImagem}>
                          <Image 
                            style={styles.imagemChat}
                            resizeMode={'cover'}
                            source={item.tipo === 'canal' ?
                              { uri: `http://${host}:8000/img/chat/imgCanal/${item.img}` } :
                              { uri: `http://${host}:8000/img/user/fotoPerfil/${item.img}` }
                            }
                          />
                        </View>
                      </View>
                      <View style={{ width: '100%' }}>
                        <Text style={{
                          textAlign: 'center',
                          color:
                          chatsSelecionados.some(chat => chat.id === item.id_conversa && chat.tipo === item.tipo) ? tema.textoBotao : tema.texto

                        }}>
                          {item.nome}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </>
                )}
              />
            </View>
          </View>
          )}

          {!chatsSelecionados[0] ? (
            <View style={styles.opcoes}>
              {opcoes.map((opcao, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.opcao}
                  onPress={() => compartilhar(opcao.nome)}
                >
                  <View style={[
                    styles.iconeOpcao,
                    { backgroundColor: opcao.cor + '15' }
                  ]}>
                    <Ionicons name={opcao.icone} size={24} color={opcao.cor} />
                  </View>
                  <View style={styles.textos}>
                    <Text style={{ color: tema.texto }}>{opcao.nome}</Text>
                    <Text style={{ color: tema.descricao }}>{opcao.descricao}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={tema.iconeInativo} />
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.containerEnviarMsg}>
              <View style={styles.boxInputImg}>
                <TextInput
                  style={[
                    styles.input,
                    { color: tema.texto, backgroundColor: tema.modalFundo }
                  ]}
                  placeholder="Escreva sua Mensagem..."
                  placeholderTextColor={tema.descricao}
                  value={campoMsg}
                  onChangeText={(text) => setCampoMsg(text)}
                />
                <Image
                  style={styles.imagemPostPreview}
                  source={{ uri: `http://${host}:8000/img/user/imgPosts/${imgPost}` }}
                />
              </View>
              <View>
                <Pressable style={[
                  styles.botaoEnviar,
                  { backgroundColor: tema.azul }
                ]} onPress={!carregamento && enviarPost}>
                  {carregamento ?(
                    <ActivityIndicator 
                      size={20}
                      color={tema.nome === 'escuro' ? tema.texto : '#fff'}
                    />
                  ) 
                  : 
                  <Text style={{ fontWeight: '700', fontSize: 17, color: tema.textoBotao }}>Enviar</Text>

}
                </Pressable>
              </View>
            </View>
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
  }

});