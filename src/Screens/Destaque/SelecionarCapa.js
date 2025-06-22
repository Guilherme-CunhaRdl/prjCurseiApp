import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
  ScrollView
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { DestaqueService } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function SelecionarCapa({ route, navigation }) {
  const params = route.params || {};
  const { 
    selectedItems = [], 
    modoEdicao = false, 
    destaqueId = null
  } = params;
  
  const [loading, setLoading] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [usandoImagemExistente, setUsandoImagemExistente] = useState(false);
  const [dadosDestaque, setDadosDestaque] = useState(null);
  
  // Buscar dados do destaque quando o componente montar
  useEffect(() => {
    const fetchDestaque = async () => {
      if (modoEdicao && destaqueId) {
        try {
          setLoading(true);
          const response = await DestaqueService.getDestaqueById(destaqueId);
          
          if (response.success) {
            const destaque = response.data;
            setDadosDestaque(destaque);
            setTitulo(destaque.titulo_destaque);
            
            if (destaque.foto_destaque) {
              setSelectedImage({ uri: destaque.foto_destaque });
              setUsandoImagemExistente(true);
            }
          }
        } catch (error) {
          console.error('Erro ao buscar destaque:', error);
          Alert.alert('Erro', 'Não foi possível carregar os dados do destaque');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDestaque();
  }, [modoEdicao, destaqueId]);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [1, 1],
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setSelectedImage({ uri: result.assets[0].uri });
      setUsandoImagemExistente(false);
    }
  };

  const handleCreateOrUpdateHighlight = async () => {
    if (!selectedImage || !titulo) {
      Alert.alert('Atenção', 'Por favor, selecione uma capa e preencha o título');
      return;
    }

    try {
    setLoading(true);
    const id_user = await AsyncStorage.getItem('idUser');
    if (!id_user) throw new Error('Usuário não logado');

    // Garantir que os IDs sejam números
    const orderedStories = selectedItems.map(id => parseInt(id));

    const response = await DestaqueService.saveDestaque({
      modoEdicao,
      id_user: parseInt(id_user), // Converter para número
      destaqueId,
      stories: orderedStories,
      titulo_destaque: titulo,
      imageUri: usandoImagemExistente ? null : selectedImage.uri
    });


      if (response.success) {
        Alert.alert('Sucesso', `Destaque ${modoEdicao ? 'atualizado' : 'criado'} com sucesso!`);
        navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
      } else {
        throw new Error(response.message || `Erro ao ${modoEdicao ? 'atualizar' : 'criar'} destaque`);
      }
    } catch (error) {
      console.error(`Erro ao ${modoEdicao ? 'atualizar' : 'criar'} destaque:`, error);
      
      let errorMessage = `Ocorreu um erro ao ${modoEdicao ? 'atualizar' : 'criar'} o destaque`;
      if (error.response?.data?.errors) {
        errorMessage = Object.values(error.response.data.errors).flat().join('\n');
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Mostrar loading enquanto busca os dados
  if (loading && modoEdicao) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3897f0" />
        <Text style={styles.loadingText}>Carregando dados do destaque...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity
          onPress={pickImage}
          style={styles.previewContainer}
          activeOpacity={0.7}
          disabled={loading}
        >
          {selectedImage ? (
            <Image 
              source={selectedImage} 
              style={styles.coverPreview} 
              onError={(e) => console.log('Erro ao carregar imagem:', e.nativeEvent.error)}
            />
          ) : (
            <View style={[styles.coverPreview, styles.placeholderCover]}>
              <Ionicons name="image" size={50} color="#ccc" />
            </View>
          )}
          
          <View style={styles.changeCoverButton}>
            <Text style={styles.changeCoverText}>
              {selectedImage ? 'Trocar imagem' : 'Selecionar imagem da galeria'}
            </Text>
          </View>
          
          {modoEdicao && usandoImagemExistente && (
            <Text style={styles.imagemExistenteText}>Usando imagem atual</Text>
          )}
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Título do Destaque</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o título"
            placeholderTextColor="#999"
            value={titulo}
            onChangeText={setTitulo}
            maxLength={30}
            editable={!loading}
          />
          <TouchableOpacity
            style={[styles.createButton, (!selectedImage || !titulo || loading) && styles.disabledButton]}
            onPress={handleCreateOrUpdateHighlight}
            disabled={!selectedImage || !titulo || loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>
                {modoEdicao ? 'Atualizar Destaque' : 'Criar Destaque'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  loadingText: {
    marginTop: 10,
    color: '#3897f0',
    fontSize: 16
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: { 
    width: '100%', 
    marginBottom: 30 
  },
  label: { 
    fontSize: 16, 
    fontWeight: '600', 
    marginBottom: 8, 
    color: '#333' 
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    color: '#333',
  },
  previewContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 30,
    position: 'relative',
  },
  coverPreview: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#3897f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderCover: { 
    backgroundColor: '#eee' 
  },
  changeCoverButton: { 
    marginTop: 15 
  },
  changeCoverText: { 
    color: '#3897f0', 
    fontWeight: '600', 
    fontSize: 16, 
    textAlign: 'center' 
  },
  imagemExistenteText: {
    marginTop: 5,
    color: '#666',
    fontStyle: 'italic',
  },
  createButton: {
    backgroundColor: '#3897f0',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 20,
    minWidth: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: { 
    backgroundColor: '#c0c0c0' 
  },
  buttonText: { 
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
});