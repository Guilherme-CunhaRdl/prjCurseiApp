import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import  * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import host from '../global';
import {useTema} from '../context/themeContext';
export default function Splash() {
  const animacaoRef = useRef(null);
  const navigation = useNavigation();
  const {tema} = useTema();
  console.log(tema)

  useEffect(() => {
    // Inicia a animação
    animacaoRef.current?.animate({ 0: { opacity: 0, scale: 0.8 }, 1: { opacity: 1, scale: 1 } }, 1000)
      .then(() => {
        setTimeout(() => verificarLogin(), 300);
      });
       async function verificarLogin() {
      const logado = await AsyncStorage.getItem('logado');
      if(logado === '1') {
        navigation.navigate('Home');
      }
      else{
        navigation.navigate('Login')
      }
    }
    
  }, []);

  return (
    <View style={[styles.container, {backgroundColor: tema.fundo}]}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      
      <Animatable.View
        ref={animacaoRef}
        style={styles.logoContainer}
        easing="ease-out-expo"
        duration={1000}
      >
        <Animatable.Image
          source={ tema.nome === 'claro' ? require("../../assets/curseiLogo.png")  : require("../../assets/curseiLogoBlackMode.png")}
          style={styles.logo}
 
        />
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer:{
    padding:5
  },
  logo: {
    width: 300,
    height: 270,
  
  },
});