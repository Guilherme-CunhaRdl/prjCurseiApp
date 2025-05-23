import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  TextInput,
  Pressable,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import styles from './styles';
import * as ImagePicker from 'expo-image-picker';
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import Login from '../Login';
import CadastroInstituicaoModal from '../../Components/cadastrarInstituicao';
import host from '../../global';
export default function Cadastro() {
  const [showPassword, setShowPassword] = useState(false);
  const [banner, setBanner] = useState('');
  const [userImg, setUserImg] = useState('https://cdn.pixabay.com/photo/2017/08/16/00/29/add-person-2646097_1280.png');
  const [nome, setNome] = useState('');
  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const [userId, setUserId] = useState(null);
  const [erroEmail, setErroEmail] = useState('');
  const [erroUsuario, setErroUsuario] = useState('');
  const [errosFormulario, setErrosFormulario] = useState({
    nome: '',
    usuario: '',
    email: '',
    senha: ''
  });

  // Função para verificar email existente
  async function verificarEmailExistente(email) {
    try {
      const resposta = await axios.get(`http://${host}:8000/api/verificar-email?email=${email}`);
      return resposta.data.existe;
    } catch (erro) {
      console.error('Erro ao verificar email:', erro);
      return false;
    }
  }

  // Verifica se usuário já existe
  async function verificarUsuarioExistente(usuario) {
    try {
      const resposta = await axios.get(`http://${host}:8000/api/verificar-usuario?usuario=${usuario}`);
      return resposta.data.existe;
    } catch (erro) {
      console.error('Erro ao verificar usuário:', erro);
      return false;
    }
  }

  // Validação de email básica
  function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  // Valida todos os campos
  function validarFormulario() {
    const erros = {
      nome: !nome.trim() ? 'Nome completo é obrigatório' : '',
      usuario: !user.trim() ? 'Usuário é obrigatório' : '',
      email: !email.trim() ? 'Email é obrigatório' : !validarEmail(email) ? 'Email inválido' : '',
      senha: !senha.trim() ? 'Senha é obrigatória' : '',
    };
  
    if (erroEmail) erros.email = erroEmail;
    if (erroUsuario) erros.usuario = erroUsuario;
  
    setErrosFormulario(erros);
    return !Object.values(erros).some(erro => erro !== '');
  }

  async function MudancaEmail(texto) {
    setEmail(texto);
    
    if (texto.trim().length > 0) {
      if (!validarEmail(texto)) {
        setErroEmail('Email inválido');
      } else {
        const existe = await verificarEmailExistente(texto);
        setErroEmail(existe ? 'Este email já está cadastrado' : '');
      }
    } else {
      setErroEmail('');
    }
  }

  async function MudancaUsuario(texto) {
    const usuarioLimpo = texto.replace(/@/g, '');
    setUser(usuarioLimpo);
    
    if (usuarioLimpo.length > 0) {
      const existe = await verificarUsuarioExistente(usuarioLimpo);
      setErroUsuario(existe ? 'Este usuário já está em uso' : '');
    } else {
      setErroUsuario('');
    }
  }
 
  async function fotoBanner() {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setBanner(result.assets[0].uri);
    }
  }

  async function fotoPerfil() {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setUserImg(result.assets[0].uri);
    }
  }

  async function CriarUser() {
     //  Validação do formulário
     if (!validarFormulario()) {
      return false;
    }

    // Verificação de email/user existentes
    const [emailExiste, userExiste] = await Promise.all([
      verificarEmailExistente(email),
      verificarUsuarioExistente(user)
    ]);

    //  Lógica de alertas para duplicatas
    if (emailExiste || userExiste) {
      let mensagem = '';
      if (emailExiste && userExiste) {
        mensagem = 'Email e usuário já cadastrados!';
      } else if (emailExiste) {
        mensagem = 'Este email já está cadastrado!';
      } else {
        mensagem = 'Este usuário já existe!';
      }
      Alert.alert('Cadastro não realizado', mensagem);
      return false;
    }

    //  Preparação do FormData
    const usuario = new FormData();

    //  Lógica para imagens
    if (userImg.startsWith("data:image")) {
      // Converter Base64 para Blob
      const response = await fetch(userImg);
      const blob = await response.blob();
      // Gerar um nome único para o arquivo
      const filename = `image_${Date.now()}.jpg`;
      // Criar um arquivo a partir do Blob
      const file = new File([blob], filename, { type: blob.type });
      // Adicionar o arquivo ao FormData
      usuario.append("imgUser", file);
    } else {
      // Se não for Base64, assumir que é uma URI local
      const localUri = userImg;
      const filename = localUri.split("/").pop(); // Extrair o nome do arquivo da URI
      const match = /\.(\w+)$/.exec(filename); // Extrair o tipo da imagem
      const type = match ? `image/${match[1]}` : "image/jpeg"; // Definir o tipo, fallback para "image/jpeg"
    
      // Criar o objeto de arquivo com a URI local
      const file = {
        uri: localUri,
        type: type,
        name: filename,
      };
    
      // Adicionar o arquivo ao FormData
      usuario.append("imgUser", file);
    }

    //  Lógica para banner
    if (banner.startsWith("data:image")) {
      // Converter Base64 para Blob
      const response = await fetch(banner);
      const blob = await response.blob();
      // Gerar um nome único para o arquivo
      const filename = `image_${Date.now()}.jpg`;
      // Criar um arquivo a partir do Blob
      const file = new File([blob], filename, { type: blob.type });
      // Adicionar o arquivo ao FormData
      usuario.append("bannerUser", file);
    } else {
      // Se não for Base64, assumir que é uma URI local
      const localUri = banner;
      const filename = localUri.split("/").pop(); // Extrair o nome do arquivo da URI
      const match = /\.(\w+)$/.exec(filename); // Extrair o tipo da imagem
      const type = match ? `image/${match[1]}` : "image/jpeg"; // Definir o tipo, fallback para "image/jpeg"
    
      // Criar o objeto de arquivo com a URI local
      const file = {
        uri: localUri,
        type: type,
        name: filename,
      };
    
      // Adicionar o arquivo ao FormData
      usuario.append("bannerUser", file);
    }
    
    //  Dados básicos
    usuario.append('nomeUser', nome);
    usuario.append('senhaUser', senha);
    usuario.append('bioUser', 'cleiton');
    usuario.append('arrobaUser', user);
    usuario.append('emailUser', email);
    
    //teste para percorrer o FormData e ver os valores (tentei usar para saber se a image estava sendo enviada corretamente)
    //for (const value of usuario.values()) {
    //  console.log(value);
    //}    
    console.log('userImg:', userImg);
    console.log('banner:', banner);
    
    const url = `http://${host}:8000/api/cursei/user`;
    
    try {
      // Requisição POST com tratamento de erro aprimorado
      const response = await axios.post(url, usuario, {
        headers: { 
          'Content-Type': 'multipart/form-data',
        },
      });

      //  Verificação adicional da resposta
      if (!response.data.sucesso) {
        throw new Error('Resposta do servidor incompleta');
      }

      console.log(response);

      // Feedback visual melhorado
      Alert.alert('Sucesso', 'Cadastro concluído! Redirecionando...', [
        { 
          text: 'OK', 
          onPress: () => navigation.navigate('Login') 
        }
      ]);
      navigation.navigate('Login')
      return response.data.id;

    } catch (error) {
      console.error("Erro no cadastro:", error);
      
      // Tratamento de erro detalhado mantendo seus logs
      let mensagemErro = 'Erro ao conectar com o servidor';
      
      if (error.response) {
        // Caso seja erro de validação do backend
        if (error.response.status === 422) {
          mensagemErro = error.response.data.message || 'Dados inválidos';
        } 
        // Caso seja erro de duplicata que passou pela validação inicial
        else if (error.response.data?.error?.includes("Duplicate")) {
          mensagemErro = 'Dados já cadastrados (erro de banco)';
        }
      }
      
 
      console.log('Detalhes do erro:', {
        error: error.message,
        response: error.response?.data
      });

      Alert.alert('Erro', mensagemErro);
      return false;
    }
}
  return (
    <ScrollView style={styles.container}>
      <Pressable style={styles.capa} onPress={() => fotoBanner()}>
        <Icon name="camera" size={24} color="#FFFFFF" />
        <Text style={styles.bannerText}>Adicionar Banner</Text>
        <Image style={styles.banner} source={{ uri: banner }} />
      </Pressable>
      
      <Pressable onPress={() => fotoPerfil()}>
        <Image style={styles.user} source={{ uri: userImg }} />
      </Pressable>
      
      <View style={styles.cadastro}>
        <Text style={styles.titulo}>Informações Básicas</Text>

        {/* Nome Completo */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Nome Completo</Text>
          <View style={[styles.inputContainer, errosFormulario.nome ? styles.inputErro : null]}>
            <Icon name="user" size={18} color="#A0A0A0" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Seu nome completo"
              placeholderTextColor="#A0A0A0"
              onChangeText={text => setNome(text)}
            />
          </View>
          {errosFormulario.nome ? <Text style={styles.textoErro}>{errosFormulario.nome}</Text> : null}
        </View>

        {/* Username */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Username</Text>
          <View style={[styles.inputContainer, (errosFormulario.usuario || erroUsuario) ? styles.inputErro : null]}>
            <Text style={styles.atSymbol}>@</Text>
            <TextInput
              style={styles.textInput}
              placeholder="seuUsername"
              placeholderTextColor="#A0A0A0"
              onChangeText={MudancaUsuario}
            />
          </View>
          {(errosFormulario.usuario || erroUsuario) ? (
            <Text style={styles.textoErro}>{errosFormulario.usuario || erroUsuario}</Text>
          ) : null}
        </View>

        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email</Text>
          <View style={[styles.inputContainer, (errosFormulario.email || erroEmail) ? styles.inputErro : null]}>
            <Icon name="mail" size={18} color="#A0A0A0" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Seu@gmail.com"
              placeholderTextColor="#A0A0A0"
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={MudancaEmail}
            />
          </View>
          {(errosFormulario.email || erroEmail) ? (
            <Text style={styles.textoErro}>{errosFormulario.email || erroEmail}</Text>
          ) : null}
        </View>

        {/* Senha */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Senha</Text>
          <View style={[styles.inputContainer, errosFormulario.senha ? styles.inputErro : null]}>
            <Icon name="lock" size={18} color="#A0A0A0" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Coloque sua Senha"
              placeholderTextColor="#A0A0A0"
              onChangeText={text => setSenha(text)}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Icon name={showPassword ? "eye" : "eye-off"} size={18} color="#A0A0A0" />
            </TouchableOpacity>
          </View>
          {errosFormulario.senha ? <Text style={styles.textoErro}>{errosFormulario.senha}</Text> : null}
        </View>

        {/* Continuar Button */}
        <Pressable 
          style={styles.continueButton}
          onPress={async () => {
            if (!validarFormulario()) {
              return;
            }
        
            const sucesso = await CriarUser();
            if (sucesso) {
              Alert.alert('Sucesso', 'Cadastro realizado!');
              navigation.navigate('Login');
            }
          }}
        >
          <Text style={styles.continueButtonText}>Continuar</Text>
        </Pressable>

        {/* Login option */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Já tem uma conta? 
            <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}> Faça login</Text>
          </Text>

          <Text style={styles.loginText}>Deseja ser uma instituição? 
            <Text style={styles.loginLink} onPress={async () => {
              if (nome.trim() && user.trim() && email.trim() && senha.trim()) {
                const novoId = await CriarUser();
                if (novoId) {
                  setModalVisible(true);
                }
              } else {
                Alert.alert('Atenção', 'Preencha todas as informações antes de cadastrar uma instituição.');
              }
            }}> Se cadastre aqui</Text>
          </Text>
          
          <CadastroInstituicaoModal
            userId={userId}
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            onSubmit={(formData) => {
              setModalVisible(false);
              navigation.navigate('Login'); 
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
}