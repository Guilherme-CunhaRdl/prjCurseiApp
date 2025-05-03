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
  Pressable
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import styles from './styles';
import * as ImagePicker from 'expo-image-picker';
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import Login from '../Login';
import CadastroInstituicaoModal from '../../Components/cadastrarInstituicao';

export default function Cadastro() {
  const [showPassword, setShowPassword] = useState(false);
  const [banner, setBanner] = useState('');
  const [userImg, setUserImg] = useState('https://cdn.pixabay.com/photo/2017/08/16/00/29/add-person-2646097_1280.png');
  const [nome, setNome] = useState('');
  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [modalVisible, setModalVisible] = useState(false); // <-- novo
  const navigation = useNavigation();
  const [userId, setUserId] = useState(null);

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
    console.log(userImg)
    const usuario = new FormData();

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
    const url = 'http://localhost:8000/api/cursei/user';
    const response =axios.post(url,usuario, {
      headers: { 
        'Content-Type': 'multipart/form-data',
      },
    })
     
    
    
    console.log( response);
   
  }
  return (
    <View style={styles.container}>
      {/* Banner Area */}
      <Pressable style={styles.capa} onPress={() => fotoBanner()}>
        <Icon name="camera" size={24} color="#FFFFFF" />
        <Text style={styles.bannerText}>Adicionar Banner</Text>

        <Image
          style={styles.banner}
          source={{ uri: banner }}
        />
      </Pressable>
      <Pressable onPress={() => fotoPerfil()}>

        <Image
          style={styles.user}
          source={{ uri: userImg }}
        />
      </Pressable>
      <View style={styles.cadastro}>
        <Text style={styles.titulo}>Informações Básicas</Text>

        {/* Nome Completo */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Nome Completo</Text>
          <View style={styles.inputContainer}>
            <Icon name="user" size={18} color="#A0A0A0" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Seu nome completo"
              placeholderTextColor="#A0A0A0"
              onChangeText={text => setNome(text)}
            />
          </View>
        </View>

        {/* Username */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Username</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.atSymbol}>@</Text>
            <TextInput
              style={styles.textInput}
              placeholder="@seuUsername"
              placeholderTextColor="#A0A0A0"
              onChangeText={text => setUser(text)}
            />
          </View>
        </View>

        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email</Text>
          <View style={styles.inputContainer}>
            <Icon name="mail" size={18} color="#A0A0A0" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Seu@gmail.com"
              placeholderTextColor="#A0A0A0"
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={text => setEmail(text)}
            />
          </View>
        </View>

        {/* Senha */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Senha</Text>
          <View style={styles.inputContainer}>
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
        </View>

        {/* Continuar Button */}
        <Pressable style={styles.continueButton}
          onPress={() => CriarUser()}

        >
          <Text style={styles.continueButtonText}>Continuar</Text>
        </Pressable>

        {/* Login option */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Já tem uma conta? <Text style={styles.loginLink}>Faça login</Text>
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
          >
          </TouchableOpacity>

          <Text style={styles.loginText}>Deseja ser uma instituição? <TouchableOpacity
      onPress={async () => {
        if (nome.trim() && user.trim() && email.trim() && senha.trim()) {
          const newUserId = await CriarUser();
          console.log('ID do usuário criado:', newUserId); // Agora isso mostrará o ID correto
          if (newUserId) {
            setModalVisible(true);
          } else {
            alert('Erro ao criar usuário. Tente novamente.');
          }
        } else {
          alert('Preencha todas as informações antes de cadastrar uma instituição.');
        }
      }}
          >
            <Text style={styles.loginLink}>Se cadastre aqui</Text>
            <CadastroInstituicaoModal
              userId={userId}
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              onSubmit={(formData) => {
                console.log('Instituição cadastrada:', formData);
                setModalVisible(false);
                navigation.navigate('Login'); 
              }}
            />
          </TouchableOpacity> </Text>

        </View>
      </View>
    </View>
  );
}