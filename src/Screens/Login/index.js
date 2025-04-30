import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './styles';
import Home from '../Home';
import Cadastro from '../Cadastro';
import MensagemSucesso from '../../Components/MensagemSucesso'
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  var dados
  const navigation = useNavigation();
  const [visibilidadeSucesso, setVisibilidadeSucesso] = useState(false)
  var logado = ''

  
// useEffect(() =>{
//   async function verificarLogin(){
//   logado = await AsyncStorage.getItem('logado')
//   console.log(logado)
//   if(logado === '1'){
//     navigation.navigate('Home')
//   }
// }
// verificarLogin()
// }, [])

  const login = async () => {
    

    const resposta = await axios.post(`http://localhost:8000/api/cursei/user/logar`, {
      emailDigitado: email,
      senhaDigitada: password
    })

    console.log(resposta)

      if(resposta.data.sucesso === true){
        dados = resposta.data.usuario

        setVisibilidadeSucesso(true)
        console.log(dados)
        await AsyncStorage.setItem('idUser', dados.id)
        await AsyncStorage.setItem('logado', 1)
        setTimeout(() => {
          setVisibilidadeSucesso(false)
        }, 2000 )
        setInterval(() => {
          navigation.navigate('Home')

        }, 2500 )
        
      }else{
        console.log('erro')
         logado = await AsyncStorage.setItem('logado', 0)
      }

    


  }

  

  {/*Link Login temporario*/ }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View style={styles.logoContainer}>
        <Image
          source={require('../../../assets/curseiLogo.png')}
          style={styles.logo}
        />
        <Text style={styles.welcomeText}>Bem-vindo de Volta</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Ionicons style={styles.inputIcon} name="mail"></Ionicons>
          <TextInput
            style={styles.input}
            placeholder="Coloque seu Email"
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons style={styles.inputIcon} name="key"></Ionicons>
          <TextInput
            style={styles.input}
            placeholder="Coloque sua Senha"
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.visibilityIcon}
          >
            <Text>{showPassword ? <Ionicons style={styles.inputIcon} name="eye-off"></Ionicons> : <Ionicons style={styles.inputIcon} name="eye"></Ionicons>}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.loginButton}
          onPress={() => login()}
        >
          <Text style={styles.loginButtonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.forgotPasswordButton}>
          <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>ou continue com</Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialIconG}>G</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialIconF}>f</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Não tem uma conta? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Cadastro')}
          >
            <Text style={styles.signupLink}>Cadastra-se</Text>
          </TouchableOpacity>
        </View>
      </View>

      <MensagemSucesso visible={visibilidadeSucesso} 
                        onClose={() => fecharModal()}/>
    </SafeAreaView>
  );
}
