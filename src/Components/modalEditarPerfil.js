import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Modal, 
  Pressable, 
  Image,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import host from '../global';
const ModalEditarPerfil = ({ visivel, onClose, usuarioAtual, onSaveSuccess }) => {
  const [nome, setNome] = useState(usuarioAtual.nome || '');
  const [bio, setBio] = useState(usuarioAtual.bio || '');

const [fotoPerfil, setFotoPerfil] = useState(usuarioAtual.foto ? 
  `http://${host}:8000/img/user/fotoPerfil/${usuarioAtual.foto}` : 
  null
);

const [banner, setBanner] = useState(usuarioAtual.banner ? 
  `http://${host}:8000/img/user/bannerPerfil/${usuarioAtual.banner}` : 
  null
);
  const [loading, setLoading] = useState(false);
  
  const selecionarImagem = async (tipo) => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permissão necessária', 'Precisamos de acesso à sua galeria');
    return;
  }

  const resultado = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: tipo === 'foto',
    aspect: tipo === 'foto' ? [1, 1] : [3, 1],
    quality: 0.8,
  });

  if (!resultado.canceled) {
    // Remove qualquer query string existente
    const uri = resultado.assets[0].uri.split('?')[0];
    
    if (tipo === 'foto') {
      setFotoPerfil(uri);
    } else {
      setBanner(uri);
    }
  }
};

  const prepararImagemParaUpload = (uri) => {
    const filename = uri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    return {
      uri,
      name: filename,
      type,
    };
  };

const salvarAlteracoes = async () => {
  if (!nome.trim()) {
    Alert.alert('Erro', 'O nome não pode estar vazio');
    return;
  }

  setLoading(true);
  
  try {
    const idUser = await AsyncStorage.getItem('idUser');
    const formData = new FormData();
    
    formData.append('nomeUser', nome);
    formData.append('bioUser', bio);

    // Processamento da foto de perfil IDÊNTICO ao do seu amigo
    if (fotoPerfil && fotoPerfil !== usuarioAtual.foto && !fotoPerfil.startsWith('http')) {
      if (fotoPerfil.startsWith('data:image')) {
        // Base64 - EXATAMENTE IGUAL AO DO SEU AMIGO
        const response = await fetch(fotoPerfil);
        const blob = await response.blob();
        const filename = `profile_${Date.now()}.jpg`;
        const file = new File([blob], filename, { type: blob.type });
        formData.append('imgUser', file);
      } else {
        // URI local - EXATAMENTE IGUAL AO DO SEU AMIGO
        const localUri = fotoPerfil;
        const filename = localUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        formData.append('imgUser', {
          uri: localUri,
          type: type,
          name: filename,
        });
      }
    }

    // Processamento do banner IDÊNTICO ao do seu amigo
    if (banner && banner !== usuarioAtual.banner && !banner.startsWith('http')) {
      if (banner.startsWith('data:image')) {
        const response = await fetch(banner);
        const blob = await response.blob();
        const filename = `banner_${Date.now()}.jpg`;
        const file = new File([blob], filename, { type: blob.type });
        formData.append('bannerUser', file);
      } else {
        const localUri = banner;
        const filename = localUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        formData.append('bannerUser', {
          uri: localUri,
          type: type,
          name: filename,
        });
      }
    }

    // DEBUG - Verifique se está igual ao do seu amigo
    console.log('Conteúdo do FormData:');
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    // Configuração do axios IGUAL ao do seu amigo
    const response = await axios.post(
      `http://${host}:8000/api/cursei/user/update-perfil/${idUser}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }
    );

    if (response.data.sucesso) {
      onSaveSuccess({
        nome,
        bio,
        foto: response.data.foto || usuarioAtual.foto,
        banner: response.data.banner || usuarioAtual.banner
      });
      onClose();
    } else {
      Alert.alert('Erro', response.data.mensagem || 'Não foi possível salvar');
    }
  } catch (error) {
    console.error('ERRO COMPLETO:', {
      message: error.message,
      response: error.response?.data,
      request: error.request,
      config: error.config
    });
    Alert.alert('Erro', 'Falha ao atualizar perfil');
  } finally {
    setLoading(false);
  }
};
  return (
    <Modal
      visible={visivel}
      transparent={false}
      animationType="slide"
    >
      <ScrollView 
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
 
        <Pressable 
  style={styles.bannerContainer}
  onPress={() => selecionarImagem('banner')}
  disabled={loading}
>
  <Image
    source={banner ? { uri: banner } : require('../../assets/backGroundDeslogado.jpg')}
    style={styles.banner}
  />
  <View style={styles.botaoEditarBanner}>
    <Icon name="camera" size={20} color="white" />
  </View>
</Pressable>

    
        <Pressable 
  style={styles.fotoContainer}
  onPress={() => selecionarImagem('foto')}
  disabled={loading}
>
  <Image
    source={fotoPerfil ? { uri: fotoPerfil } : require('../../assets/userDeslogado.png')}
    style={styles.fotoPerfil}
  />
  <View style={styles.botaoEditarFoto}>
    <Icon name="camera" size={16} color="white" />
  </View>
</Pressable>

        {/* Formulário de edição */}
        <View style={styles.formContainer}>
          <View style={styles.campoWrapper}>
            <Text style={styles.rotulo}>Nome</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#A0A0A0" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={nome}
                onChangeText={setNome}
                placeholder="Seu nome"
                editable={!loading}
              />
            </View>
          </View>

          <View style={styles.campoWrapper}>
            <Text style={styles.rotulo}>Bio</Text>
            <View style={[styles.inputContainer, styles.bioContainer]}>
              <TextInput
                style={[styles.input, styles.bioInput]}
                value={bio}
                onChangeText={setBio}
                placeholder="Fale um pouco sobre você..."
                multiline
                numberOfLines={4}
                editable={!loading}
              />
            </View>
          </View>
        </View>

        {/* Botões inferiores */}
        <View style={styles.botoesContainer}>
          <Pressable 
            style={[styles.botaoCancelar, loading && styles.botaoDesabilitado]} 
            onPress={onClose}
            disabled={loading}
          >
            <Text style={styles.textoBotao}>Cancelar</Text>
          </Pressable>
          
          <Pressable 
            style={[styles.botaoSalvar, loading && styles.botaoDesabilitado]}
            onPress={salvarAlteracoes}
            disabled={loading}
          >
            <Text style={styles.textoBotaoSalvar}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingBottom: 20,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  bannerContainer: {
    height: 150,
    width: '100%',
    backgroundColor: '#f0f0f0',
    position: 'relative',
  },
  banner: {
    width: '100%',
    height: '100%',
  },
  botaoEditarBanner: {
 position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  fotoContainer: {
    position: 'absolute',
    top: 100,
    left: 20,
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    zIndex: 1,
    borderColor: '#fff',
    overflow: 'hidden',
  },
  fotoPerfil: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  botaoEditarFoto: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 5,
    zIndex: 999,
  },
  formContainer: {
    marginTop: 60,
    paddingHorizontal: 24,
  },
  campoWrapper: {
    marginBottom: 24,
  },
  rotulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#787F89',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e1e1e1',
    borderRadius: 8,
    paddingLeft: 12,
    height: 50,
    backgroundColor: '#f8f8f8',
  },
  bioContainer: {
    height: 120,
    alignItems: 'flex-start',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#787F89',
    fontSize: 16,
  },
  bioInput: {
    height: '100%',
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  botoesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 24,
  },
  botaoCancelar: {
    borderWidth: 1,
    borderColor: '#e1e1e1',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
    backgroundColor: '#f8f8f8',
  },
  botaoSalvar: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
  },
  textoBotao: {
    fontSize: 16,
    color: '#333',
  },
  textoBotaoSalvar: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  botaoDesabilitado: {
    opacity: 0.6,
  },
});

export default ModalEditarPerfil;