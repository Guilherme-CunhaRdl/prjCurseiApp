import axios from 'axios';
import React, { useState, useEffect,useRef } from 'react';

import { View, Text, StyleSheet, Pressable, TouchableOpacity, Image, Animated, Clipboard } from 'react-native';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTema } from '../../context/themeContext';
import { shadow } from 'react-native-paper';


const ModalImpulsionar = ({ visible, onClose, arroba, idPost }) => {
  const { tema } = useTema();
  const [parte, setParte] = useState(1);
  const [selecionado, setSelecionado] = useState(null);
  const animationRef = useRef(null);

  const [progress] = useState(new Animated.Value(0)); // de 0 a 100
  function voltar() {
    setParte(1),
      progress.setValue(0);
  }
  function fechar() {
    onClose()
    setTimeout(() => {
      animationRef.current.stop();
      setParte(1)
      setSelecionado(null)
      progress.setValue(0);
    }, 500);
  }
  animationRef.current = Animated.timing(progress, {
    toValue: 100,
    duration: 2000,
    useNativeDriver: false,
  });

  function confirmar() {
    if (selecionado != null) {
      setParte(2)
      animationRef.current.start(() => {
        setTimeout(() => {
          setParte(3)
        }, 200);
      })

        ;
    } else {
      setSelecionado('vazio')
    }
  }


  const widthInterpolated = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={fechar}
      onBackButtonPress={fechar}
      animationIn="slideInLeft"
      animationOut="slideOutLeft"
      backdropTransitionInTiming={500}
      backdropTransitionOutTiming={500}
      animationInTiming={800}
      animationOutTiming={800}
    >
      <View style={styles.modal}>
        {parte == 1 ? (


          <View>
            <View style={styles.closeCont}>
              <TouchableOpacity onPress={fechar}>
                <Ionicons
                  name={'close'}
                  size={28}
                  color={'#000'}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.titulo}>Impulsionar seu post</Text>
            <View style={styles.rowCards}>
              <Pressable
                onPress={() => setSelecionado(1)}
                style={[
                  styles.cardContainer,
                  { backgroundColor: selecionado === 1 ? tema.azul : tema.fundo },
                ]}
              >
                <View style={styles.card}>
                  <Text style={{ fontWeight: '700', fontSize: 13, color: selecionado === 1 ? '#fff' : tema.azul }}>
                    Impulsionar
                  </Text>
                  <Text style={{ fontWeight: '800', fontSize: 20, color: selecionado === 1 ? '#fff' : tema.texto }}>
                    R$ 25,00
                  </Text>
                  <Text
                    style={{
                      fontWeight: '600',
                      fontSize: 13,
                      color: selecionado === 1 ? '#fff' : tema.texto,
                      opacity: selecionado === 1 ? 1 : 0.5,
                    }}
                  >
                    24 Horas
                  </Text>
                </View>
              </Pressable>

              {/* CARD 2 */}
              <Pressable
                onPress={() => setSelecionado(2)}
                style={[
                  styles.cardContainer,
                  { backgroundColor: selecionado === 2 ? tema.azul : tema.fundo },
                ]}
              >
                <View style={styles.card}>
                  <Text style={{ fontWeight: '700', fontSize: 13, color: selecionado === 2 ? '#fff' : tema.azul }}>
                    Impulsionar
                  </Text>
                  <Text style={{ fontWeight: '800', fontSize: 20, color: selecionado === 2 ? '#fff' : tema.texto }}>
                    R$ 57,50
                  </Text>
                  <Text
                    style={{
                      fontWeight: '600',
                      fontSize: 13,
                      color: selecionado === 2 ? '#fff' : tema.texto,
                      opacity: selecionado === 2 ? 1 : 0.5,
                    }}
                  >
                    3 Dias
                  </Text>
                </View>
              </Pressable>

              {/* CARD 3 */}
              <Pressable
                onPress={() => setSelecionado(3)}
                style={[
                  styles.cardContainer,
                  { backgroundColor: selecionado === 3 ? tema.azul : tema.fundo },
                ]}
              >
                <View style={styles.card}>
                  <Text style={{ fontWeight: '700', fontSize: 13, color: selecionado === 3 ? '#fff' : tema.azul }}>
                    Impulsionar
                  </Text>
                  <Text style={{ fontWeight: '800', fontSize: 20, color: selecionado === 3 ? '#fff' : tema.texto }}>
                    R$139,99
                  </Text>
                  <Text
                    style={{
                      fontWeight: '600',
                      fontSize: 13,
                      color: selecionado === 3 ? '#fff' : tema.texto,
                      opacity: selecionado === 3 ? 1 : 0.5,
                    }}
                  >
                    7 Dias
                  </Text>
                </View>
              </Pressable>
            </View>
            <Text style={{ width: '100%', textAlign: 'center', color: 'red', marginTop: 30 }}> {selecionado == 'vazio' ? 'Escolha uma das opções acima' : ''}</Text>
            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 5 }}>
              <TouchableOpacity style={{ backgroundColor: 'transparent', borderWidth: 2, borderColor: tema.azul, width: '45%', alignItems: 'center', borderRadius: 5, paddingBlock: 1, }} onPress={fechar}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: tema.azul }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ backgroundColor: tema.azul, borderWidth: 2, borderColor: tema.azul, width: '45%', alignItems: 'center', borderRadius: 5, paddingBlock: 1 }} onPress={confirmar}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : parte == 2 ? (
          <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <Image
              source={tema.nome === 'claro' ? require("../../../assets/curseiLogo.png") : require("../../../assets/curseiLogoBlackMode.png")}
              style={styles.logo}
            />
            <View style={styles.backgroundBar}>
              <Animated.View style={[styles.progressBar, { width: widthInterpolated }]} />
            </View>
            <Text style={{ marginTop: 5, fontWeight: 600, fontSize: 20 }}>Gerando código pix</Text>
          </View>
        ) : parte == 3 ? (

          <View style={{ alignItems: 'center' }}>
            <Text style={[styles.titulo, { marginTop: 10 }]}>Pague via pix</Text>
            <View style={{ backgroundColor: '#fff', height: 140, width: 140, marginTop: 5 }}>
              <Image
                source={{ uri: "https://pngimg.com/d/qr_code_PNG33.png" }}
                style={{ width: '100%', height: '100%' }}
              />
            </View>
            <TouchableOpacity style={{ width: 150, backgroundColor: tema.azul, height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 5 }} onPress={Clipboard.setString('00020126580014BR.GOV.BCB.PIX0110cursei202752040000530398654051.005802BR5920CURSEI OFICIAL LTDA6009SÃO PAULO62070503***6304ABCD')}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Copiar Código Pix</Text>
            </TouchableOpacity>
            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 35 }}>
              <TouchableOpacity style={{ backgroundColor: 'transparent', borderWidth: 2, borderColor: tema.azul, width: '45%', alignItems: 'center', borderRadius: 5, paddingBlock: 1, }} onPress={() => voltar()}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: tema.azul }}>Voltar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ backgroundColor: tema.azul, borderWidth: 2, borderColor: tema.azul, width: '45%', alignItems: 'center', borderRadius: 5, paddingBlock: 1 }} onPress={() => setParte(4)}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}>Continuar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Ionicons
              name={'checkmark-circle-outline'}
              size={60}
              color={tema.azul}
              style={{ marginTop: 40 }}
            />
            <Text style={{ color: tema.azul, fontSize: 30, fontWeight: 600 }}>Sucesso!</Text>
            <Text style={{ color: tema.texto, fontSize: 16, fontWeight: 500, opacity: 0.5, marginTop: 20, width: '60%', textAlign: 'center' }}>Seu post foi impulsionado com sucesso!</Text>
            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 35 }}>
              <TouchableOpacity style={{ backgroundColor: 'transparent', borderWidth: 2, borderColor: tema.azul, width: '45%', alignItems: 'center', borderRadius: 5, paddingBlock: 1, }} onPress={() => fechar()}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: tema.azul }}>Fechar</Text>
              </TouchableOpacity>

            </View>
          </View>
        )
        }
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'white',
    borderRadius: 5,
    width: '100%',
    paddingTop: 6,
    height: 300,
  },
  closeCont: {
    marginLeft: 4,
  },
  titulo: {
    width: '100%',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 500,
    opacity: 0.7,
    margin: 0,
  },
  rowCards: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 40,
    justifyContent: 'space-evenly'
  },
  card: {
    justifyContent: 'space-between',
    height: 100,
    width: '100%',
    paddingBlock: 10,
    alignItems: 'center',
  },

  cardContainer: {
    elevation: 4,
    borderRadius: 10,
    width: '30%',

  },
  logo: {
    width: 130,
    height: 140,
    objectFit: 'contain'
  },
  backgroundBar: {
    width: '60%',
    marginTop: 10,
    height: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: 10,
    backgroundColor: '#007AFF',
  },
});

export default ModalImpulsionar;
