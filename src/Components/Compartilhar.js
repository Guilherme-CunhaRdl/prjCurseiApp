import React, { useRef } from 'react';
import { TouchableOpacity, Share, Alert, Modal, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';


//conteudo seria o post
export default function Compartilhar({ conteudo }) {
  const modalRef = useRef(null);
  const [visivel, setVisivel] = React.useState(false);

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

  const abrirModal = () => setVisivel(true);

  const fecharModal = () => {
    modalRef.current?.fadeOutDown(300).then(() => setVisivel(false));
  };

  return (
    <>
      {/* Ícone no post */}
      <TouchableOpacity
        onPress={abrirModal}
        style={styles.icone}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-redo-outline" size={20} color="#666" />
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
            style={styles.modal}
          >
            <View style={styles.cabecalho}>
              <TouchableOpacity onPress={fecharModal} style={styles.botaoFechar}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
              <Text style={styles.titulo}>Compartilhar post</Text>
            </View>

            <View style={styles.opcoes}>
              {opcoes.map((opcao, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.opcao}
                  onPress={() => compartilhar(opcao.nome)}
                >
                  <View style={[styles.iconeOpcao, { backgroundColor: opcao.cor + '15' }]}>
                    <Ionicons name={opcao.icone} size={24} color={opcao.cor} />
                  </View>
                  <View style={styles.textos}>
                    <Text style={styles.nome}>{opcao.nome}</Text>
                    <Text style={styles.descricao}>{opcao.descricao}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
                </TouchableOpacity>
              ))}
            </View>
          </Animatable.View>
        </View>
      </Modal>
    </>
  );
};


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
});