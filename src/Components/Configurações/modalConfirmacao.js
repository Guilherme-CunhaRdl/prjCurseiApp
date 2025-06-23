import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Pressable } from 'react-native';
import Modal from 'react-native-modal';
import { useTema } from '../../context/themeContext';
const ModalConfirmacao = () => {
    const [visible, setVisible] = useState(false);

    const abrirModal = () => setVisible(true);
    const fecharModal = () => setVisible(false);
    const {tema} = useTema();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: tema.fundo }}>
          <Button title="Abrir Modal" onPress={abrirModal} color={tema.azul} />
          
          <Modal
            isVisible={visible}
            onBackdropPress={fecharModal}
            onBackButtonPress={fecharModal}
            animationIn="slideInLeft"
            animationOut="slideOutLeft"
            backdropTransitionInTiming={500}
            backdropTransitionOutTiming={500}
            animationInTiming={800}
            animationOutTiming={800}
          >
            <View style={[styles.modal, { backgroundColor: tema.modalFundo }]}>
              <View style={styles.modalTexto}>
                <Text style={[styles.texto, { color: tema.texto }]}>Tem certeza que deseja continuar?</Text>
                <Text style={[styles.descItem, { color: tema.descricao }]}>
                  Talvez essa alteração não tenha como ser desfeita
                </Text>
              </View>
    
              <View style={styles.modalBotoes}>
                <View style={styles.botoes}>
                  <View
                    style={{
                      height: '100%',
                      borderRightWidth: 1,
                      borderColor: tema.cinza,
                      width: '50%',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Pressable onPress={fecharModal}>
                      <Text style={{ fontWeight: '700', color: tema.azul }}>Cancelar</Text>
                    </Pressable>
                  </View>
    
                  <View
                    style={{
                      height: '100%',
                      width: '50%',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Pressable onPress={fecharModal}>
                      <Text style={{ fontWeight: '600', color: tema.azul }}>Confirmar</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      );
    };
const styles = StyleSheet.create({
    modal: {
        backgroundColor: 'white',
        borderRadius: 10,
        width: '80%',
        alignSelf: 'center',
        justifyContent:'space-around',
        height: '20%',
        
    },
    modalTexto: {
        flex: 0.65,
        alignItems: 'center',
        justifyContent: 'center',
        padding:'5%',
    },
    modalBotoes: {
        flex: 0.35,
    },
    texto: {
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'center',
    },
    descItem: {
        fontSize: 14,
        textAlign: 'center',
        justifyContent: 'center',
        color: '#555',
    },
    botoes: {
        width: '100%',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: '#DBDBDB',
    },
});

export default ModalConfirmacao;
