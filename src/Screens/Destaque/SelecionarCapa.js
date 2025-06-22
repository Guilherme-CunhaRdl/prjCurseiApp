import React, { useState } from 'react';
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
  const { selectedItems } = route.params;
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [titulo, setTitulo] = useState('');

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
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleCreateHighlight = async () => {
    if (!selectedImage || !titulo) {
      Alert.alert('Atenção', 'Por favor, selecione uma capa e preencha o título');
      return;
    }

    try {
      setLoading(true);
      const id_user = await AsyncStorage.getItem('idUser');
      if (!id_user) throw new Error('Usuário não logado');

      const orderedStories = selectedItems.map(id => parseInt(id));

      // Passa dados separados para o serviço
      const response = await DestaqueService.createDestaqueWithImage(
        id_user,
        orderedStories,
        titulo,
        selectedImage
      );

      if (response.success) {
        Alert.alert('Sucesso', 'Destaque criado com sucesso!');
        navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
      } else {
        throw new Error(response.message || 'Erro ao criar destaque');
      }
    } catch (error) {
      console.error('Erro ao criar destaque:', error);
      let errorMessage = 'Ocorreu um erro ao criar o destaque';
      if (error.response?.data?.errors) {
        errorMessage = Object.values(error.response.data.errors).flat().join('\n');
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
            <Image source={{ uri: selectedImage }} style={styles.coverPreview} />
          ) : (
            <View style={[styles.coverPreview, styles.placeholderCover]}>
              <Ionicons name="image" size={50} color="#ccc" />
            </View>
          )}
          <View style={styles.changeCoverButton}>
            <Text style={styles.changeCoverText}>Selecionar imagem da galeria</Text>
          </View>
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
            onPress={handleCreateHighlight}
            disabled={!selectedImage || !titulo || loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Criar Destaque</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: { width: '100%', marginBottom: 30 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#333' },
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
  placeholderCover: { backgroundColor: '#eee' },
  changeCoverButton: { marginTop: 15 },
  changeCoverText: { color: '#3897f0', fontWeight: '600', fontSize: 16, textAlign: 'center' },
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
  disabledButton: { backgroundColor: '#c0c0c0' },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});
