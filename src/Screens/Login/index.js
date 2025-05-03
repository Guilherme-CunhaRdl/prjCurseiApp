import React, { useEffect, useState } from 'react';
import { 
  View, 
  Image, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  ScrollView
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './styles';
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erroEmail, setErroEmail] = useState('');
  const [erroSenha, setErroSenha] = useState('');
  const [erroGeral, setErroGeral] = useState('');
  const navigation = useNavigation();

  // useEffect(() => {
  //   async function verificarLogin() {
  //     const logado = await AsyncStorage.getItem('logado');
  //     if(logado === '1') {
  //       navigation.navigate('Home');
  //     }
  //   }
  //   verificarLogin();
  // }, []);

  const validarEmail = (email) => {
    const formatoValidoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     ^[^\s@]+ - Texto antes do @ (não pode ter espaços ou @)
// @ - O símbolo @ obrigatório
// [^\s@]+ - Texto depois do @  
// \. - Um ponto literal
// [^\s@]+$ - Texto depois do ponto (extensão)


    return formatoValidoEmail.test(email); // Testa se o email bate com o formato valido
  };

  const fazerLogin = async () => {
    setErroEmail('');
    setErroSenha('');
    setErroGeral('');

    let valido = true;

    if (!email) {
      setErroEmail('Email é obrigatório');
      valido = false;
    } else if (!validarEmail(email)) {
      setErroEmail('Email inválido');
      valido = false;
    }

    if (!senha) {
      setErroSenha('Senha é obrigatória');
      valido = false;
    }

    if (!valido) return;

    setCarregando(true);

    try {
      const resposta = await axios.post(`http://localhost:8000/api/cursei/user/logar`, {
        emailDigitado: email,
        senhaDigitada: senha
      });

      if(resposta.data.sucesso) {
        const usuario = resposta.data.usuario;
        
        await AsyncStorage.setItem('idUser', usuario.id);
        await AsyncStorage.setItem('logado', '1');
        
        navigation.navigate('Home');
      } else {
        setErroEmail('Informações inválidas');
        setErroSenha('Informações inválidas');
      }
    } catch (erro) {
      setErroEmail('Informações inválidas');
      setErroSenha('Informações inválidas');
      console.error('Erro no login:', erro);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <ScrollView 
        contentContainerStyle={{flexGrow: 1, paddingBottom: 40}}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../assets/curseiLogo.png')}
            style={styles.logo}
          />
          <Text style={styles.welcomeText}>Bem-vindo de Volta</Text>
        </View>

        <View style={styles.formContainer}>
          {erroGeral ? (
            <Text style={{
              color: '#ff4444', 
              fontSize: 14, 
              marginBottom: 10,
              textAlign: 'center'
            }}>
              {erroGeral}
            </Text>
          ) : null}

          <View style={[
            styles.inputContainer, 
            erroEmail ? {borderColor: '#ff4444'} : null
          ]}>
            <Ionicons style={styles.inputIcon} name="mail" />
            <TextInput
              style={styles.input}
              placeholder="Digite seu email"
              value={email}
              onChangeText={(texto) => {
                setEmail(texto);
                setErroEmail('');
                setErroGeral('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          {erroEmail ? (
            <Text style={{
              color: '#ff4444',
              fontSize: 12,
              marginTop: -10,
              marginBottom: 10,
              marginLeft: 15
            }}>
              {erroEmail}
            </Text>
          ) : null}

          <View style={[
            styles.inputContainer, 
            erroSenha ? {borderColor: '#ff4444'} : null
          ]}>
            <Ionicons style={styles.inputIcon} name="key" />
            <TextInput
              style={styles.input}
              placeholder="Digite sua senha"
              value={senha}
              onChangeText={(texto) => {
                setSenha(texto);
                setErroSenha('');
                setErroGeral('');
              }}
              secureTextEntry={!mostrarSenha}

            />
            <TouchableOpacity
              onPress={() => setMostrarSenha(!mostrarSenha)}
              style={styles.visibilityIcon}
            >
              <Ionicons 
                style={styles.inputIcon} 
                name={mostrarSenha ? "eye-off" : "eye"} 
              />
            </TouchableOpacity>
          </View>
          {erroSenha ? (
            <Text style={{
              color: '#ff4444',
              fontSize: 12,
              marginTop: -10,
              marginBottom: 10,
              marginLeft: 15
            }}>
              {erroSenha}
            </Text>
          ) : null}

          <TouchableOpacity 
            style={styles.loginButton}
            onPress={fazerLogin}
            disabled={carregando}
          >
            <Text style={styles.loginButtonText}>
              {carregando ? 'Carregando...' : 'Entrar'}
            </Text>
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
              <Text style={styles.signupLink}>Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}