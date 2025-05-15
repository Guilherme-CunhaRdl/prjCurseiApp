import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';

export default function Splash() {
  const animacaoRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    // Inicia a animação
    animacaoRef.current?.animate({ 0: { opacity: 0, scale: 0.8 }, 1: { opacity: 1, scale: 1 } }, 1000)
      .then(() => {
        setTimeout(() => navigation.replace('Login'), 800);
      });
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      
      <Animatable.View
        ref={animacaoRef}
        style={styles.logoContainer}
        easing="ease-out-expo"
        duration={1000}
      >
        <Animatable.Image
          source={require('../../assets/curseiLogo.png')}
          style={styles.logo}
 
        />
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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