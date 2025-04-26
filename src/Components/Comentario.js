
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';


export default function Comentario() {


  const [modalVisivel, setModalVisivel] = useState(false);
  const [comentario, setComentario] = useState('');
  const refConteudoModal = useRef(null);
  const [comentarios, setComentarios] = useState([
    {
      id: '1',
      usuario: 'EL CHAVO DEL OCHO',
      tempoCriacao: new Date(Date.now() - 3600000),
      texto: 'Seria melhor ter ido ver o filme do pelé!',
      curtidas: 1,
      foto: 'https://th.bing.com/th/id/R.7dc73e032ee7e2354ebe86e579e44264?rik=fLQ5zfemTUwwvg&riu=http%3a%2f%2frafabarbosa.com%2fwp-content%2fuploads%2f2011%2f07%2fchaves22.jpg&ehk=uFTisNnaZM7DbdjTCdvH685iMGLNp4QpfUJFMP6WaWU%3d&risl=&pid=ImgRaw&r=0' // placeholder de foto
    },
    {
      id: '2',
      usuario: 'CHAPOLIN COLORADO',
      tempoCriacao: new Date(Date.now() - 2700000),
      texto: 'Não contavam com minha astúcia!',
      curtidas: 3,
      foto: 'https://th.bing.com/th/id/OIP.uAgPko09GoWKTvzmPcHcgwHaEc?rs=1&pid=ImgDetMain' // placeholder de foto
    },
    {
      id: '3',
      usuario: 'EL CHAVO DEL OCHO',
      tempoCriacao: new Date(Date.now() - 5500000),
      texto: 'Seria melhor ter ido ver o filme do pelé!',
      curtidas: 1,
      foto: 'https://th.bing.com/th/id/R.7dc73e032ee7e2354ebe86e579e44264?rik=fLQ5zfemTUwwvg&riu=http%3a%2f%2frafabarbosa.com%2fwp-content%2fuploads%2f2011%2f07%2fchaves22.jpg&ehk=uFTisNnaZM7DbdjTCdvH685iMGLNp4QpfUJFMP6WaWU%3d&risl=&pid=ImgRaw&r=0' // placeholder de foto
    },
    {
      id: '4',
      usuario: 'CHAPOLIN COLORADO',
      tempoCriacao: new Date(Date.now() - 1700000),
      texto: 'Não contavam com minha astúcia!',
      curtidas: 3,
      foto: 'https://th.bing.com/th/id/OIP.uAgPko09GoWKTvzmPcHcgwHaEc?rs=1&pid=ImgDetMain' // placeholder de foto
    },
    {
      id: '5',
      usuario: 'EL CHAVO DEL OCHO',
      tempoCriacao: new Date(Date.now() - 2700000),
      texto: 'Seria melhor ter ido ver o filme do pelé!',
      curtidas: 1,
      foto: 'https://th.bing.com/th/id/R.7dc73e032ee7e2354ebe86e579e44264?rik=fLQ5zfemTUwwvg&riu=http%3a%2f%2frafabarbosa.com%2fwp-content%2fuploads%2f2011%2f07%2fchaves22.jpg&ehk=uFTisNnaZM7DbdjTCdvH685iMGLNp4QpfUJFMP6WaWU%3d&risl=&pid=ImgRaw&r=0' // placeholder de foto
    },
    {
      id: '6',
      usuario: 'CHAPOLIN COLORADO',
      tempoCriacao: new Date(Date.now() - 3700000),
      texto: 'Não contavam com minha astúcia!',
      curtidas: 3,
      foto: 'https://th.bing.com/th/id/OIP.uAgPko09GoWKTvzmPcHcgwHaEc?rs=1&pid=ImgDetMain' // placeholder de foto
    },
    {
      id: '7',
      usuario: 'EL CHAVO DEL OCHO',
      tempoCriacao: new Date(Date.now() - 7700000),
      texto: 'Seria melhor ter ido ver o filme do pelé!',
      curtidas: 1,
      foto: 'https://th.bing.com/th/id/R.7dc73e032ee7e2354ebe86e579e44264?rik=fLQ5zfemTUwwvg&riu=http%3a%2f%2frafabarbosa.com%2fwp-content%2fuploads%2f2011%2f07%2fchaves22.jpg&ehk=uFTisNnaZM7DbdjTCdvH685iMGLNp4QpfUJFMP6WaWU%3d&risl=&pid=ImgRaw&r=0' // placeholder de foto
    },
    {
      id: '8',
      usuario: 'CHAPOLIN COLORADO',
      tempoCriacao: new Date(Date.now() - 22700000),
      texto: 'Não contavam com minha astúcia!',
      curtidas: 3,
      foto: 'https://th.bing.com/th/id/OIP.uAgPko09GoWKTvzmPcHcgwHaEc?rs=1&pid=ImgDetMain' // placeholder de foto
    },
    {
      id: '9',
      usuario: 'EL CHAVO DEL OCHO',
      tempoCriacao: new Date(Date.now() - 1700000),
      texto: 'Seria melhor ter ido ver o filme do pelé!',
      curtidas: 1,
      foto: 'https://th.bing.com/th/id/R.7dc73e032ee7e2354ebe86e579e44264?rik=fLQ5zfemTUwwvg&riu=http%3a%2f%2frafabarbosa.com%2fwp-content%2fuploads%2f2011%2f07%2fchaves22.jpg&ehk=uFTisNnaZM7DbdjTCdvH685iMGLNp4QpfUJFMP6WaWU%3d&risl=&pid=ImgRaw&r=0' // placeholder de foto
    },
    {
      id: '10',
      usuario: 'CHAPOLIN COLORADO',
      tempoCriacao: new Date(Date.now() - 5700000),
      texto: 'Não contavam com minha astúcia!',
      curtidas: 3,
      foto: 'https://th.bing.com/th/id/OIP.uAgPko09GoWKTvzmPcHcgwHaEc?rs=1&pid=ImgDetMain' // placeholder de foto
    },
    {
      id: '11',
      usuario: 'EL CHAVO DEL OCHO',
      tempoCriacao: new Date(Date.now() - 4700000),
      texto: 'Seria melhor ter ido ver o filme do pelé!',
      curtidas: 1,
      foto: 'https://th.bing.com/th/id/R.7dc73e032ee7e2354ebe86e579e44264?rik=fLQ5zfemTUwwvg&riu=http%3a%2f%2frafabarbosa.com%2fwp-content%2fuploads%2f2011%2f07%2fchaves22.jpg&ehk=uFTisNnaZM7DbdjTCdvH685iMGLNp4QpfUJFMP6WaWU%3d&risl=&pid=ImgRaw&r=0' // placeholder de foto
    },
    {
      id: '12',
      usuario: 'CHAPOLIN COLORADO',
      tempoCriacao: new Date(Date.now() - 3700000),
      texto: 'Não contavam com minha astúcia!',
      curtidas: 3,
      foto: 'https://th.bing.com/th/id/OIP.uAgPko09GoWKTvzmPcHcgwHaEc?rs=1&pid=ImgDetMain' // placeholder de foto
    },
  ]);

  const abrirModal = () => {
    setModalVisivel(true);
  };

  const fecharModal = () => {
    refConteudoModal.current.slideOutDown(300).then(() => setModalVisivel(false));
  };

  const curtirComentario = (id) => {
    setComentarios(comentarios.map(item => {
      if (item.id === id) {
        return {
          ...item,
          curtido: !item.curtido,
          curtidas: item.curtido ? item.curtidas - 1 : item.curtidas + 1,

        };
      }
      return item;
    }));
  };

  const adicionarComentario = () => {
    if (comentario.trim() === '') return;

    const novoComentario = {
      id: Date.now().toString(),
      usuario: 'USUÁRIO ATUAL',
      tempoCriacao: new Date(),
      texto: comentario,
      curtidas: 0,
      curtido: false,
      foto: 'https://i.imgur.com/0LKZQYM.png'
    };

    setComentarios([novoComentario, ...comentarios]);
    setComentario('');
  };


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
            <Text style={styles.nomeUsuario}>{usuario}</Text>
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
          <TouchableOpacity style={styles.botaoResponder}>
            <Text style={styles.textoResponder}>Responder</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  });
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={abrirModal}
      >
        <Ionicons name="chatbubble-outline" size={20} color="#000" />

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
          >
            <Animatable.View
              ref={refConteudoModal}
              animation="slideInUp"
              duration={300}
              style={styles.conteudoModal}
            >
              <View style={styles.cabecalhoModal}>
                <TouchableOpacity
                  style={styles.botaoFechar}
                  onPress={fecharModal}
                >
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
                <Text style={styles.tituloModal}>Comentários</Text>
                <View style={styles.espacadorCabecalho} />
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

              <View style={styles.containerInput}>
                <TextInput
                  style={styles.inputComentario}
                  placeholder="Escreva seu comentário..."
                  placeholderTextColor="#999"
                  value={comentario}
                  onChangeText={setComentario}
                  onSubmitEditing={adicionarComentario}
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
    backgroundColor: '#f8f8f8',
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
    backgroundColor: '#fff',
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
    color: '#333',
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

