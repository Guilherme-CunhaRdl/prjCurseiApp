import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  ActivityIndicator,
  Alert,
  ScrollView
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DestaqueService } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function SelecionarCapa({ route, navigation }) {
  const { itemsData, selectedItems } = route.params;
  const [selectedCover, setSelectedCover] = useState(itemsData[0]?.id || null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [titulo, setTitulo] = useState('');
  
  const numColumns = Math.min(3, Math.max(1, itemsData.length));
  const spacing = 10;
  const availableWidth = width - 40;
  const itemWidth = (availableWidth - (numColumns - 1) * spacing) / numColumns;

  const handleCreateHighlight = async () => {
    if (!selectedCover || !titulo) {
      Alert.alert('Atenção', 'Por favor, selecione uma capa e preencha o título');
      return;
    }
    
    try {
      setLoading(true);
      const id_user = await AsyncStorage.getItem('idUser');
      
      if (!id_user) {
        throw new Error('Usuário não logado');
      }
      
      // Converter todos os IDs para números
      const orderedStories = [
        parseInt(selectedCover),
        ...selectedItems
          .map(id => parseInt(id))
          .filter(id => id !== parseInt(selectedCover))
      ];
      
      // Chamar serviço com 3 parâmetros
      const response = await DestaqueService.createDestaque(
        id_user, 
        orderedStories,
        titulo
      );
      
      if (response.success) {
        Alert.alert('Sucesso', 'Destaque criado com sucesso!');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      } else {
        throw new Error(response.message || 'Erro ao criar destaque');
      }
    } catch (error) {
      console.error('Erro ao criar destaque:', error);
      
      // Mensagem de erro mais detalhada
      let errorMessage = 'Ocorreu um erro ao criar o destaque';
      if (error.response?.data?.errors) {
        // Juntar todas as mensagens de erro
        errorMessage = Object.values(error.response.data.errors)
          .flat()
          .join('\n');
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item, index }) => (
    <View style={[
      styles.itemWrapper, 
      numColumns > 1 && index % numColumns !== numColumns - 1 && { marginRight: spacing }
    ]}>
      <TouchableOpacity
        style={[
          styles.itemContainer,
          { width: itemWidth },
          selectedCover === item.id && styles.selectedItem,
        ]}
        onPress={() => setSelectedCover(item.id)}
        activeOpacity={0.8}
      >
        <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity 
          onPress={() => setShowModal(true)}
          style={styles.previewContainer}
          activeOpacity={0.7}
          disabled={loading}
        >
          <Image
            source={{ uri: itemsData.find(i => i.id === selectedCover)?.thumbnail }}
            style={styles.coverPreview}
          />
          <View style={styles.changeCoverButton}>
            <Text style={styles.changeCoverText}>Trocar imagem do destaque</Text>
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
            style={[styles.createButton, (!selectedCover || !titulo || loading) && styles.disabledButton]}
            onPress={handleCreateHighlight}
            disabled={!selectedCover || !titulo || loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Criar Destaque</Text>
            )}
          </TouchableOpacity>
        </View>

        <Modal visible={showModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowModal(false)}
              hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
            >
              <Ionicons name="close" size={30} color="white" />
            </TouchableOpacity>

            <FlatList
              data={itemsData}
              renderItem={renderItem}
              keyExtractor={item => item.id.toString()}
              numColumns={numColumns}
              contentContainerStyle={[styles.galleryContainer, { paddingTop: 60 }]}
              key={numColumns}
            />
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
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
  },
  coverPreview: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#3897f0',
  },
  changeCoverButton: {
    marginTop: 15,
  },
  changeCoverText: {
    color: '#3897f0',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
  },
  galleryContainer: {
    paddingHorizontal: 15,
    paddingBottom: 30,
  },
  itemWrapper: {
    marginBottom: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1000,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    padding: 8,
  },
  itemContainer: {
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  selectedItem: {
    borderWidth: 3,
    borderColor: '#3897f0',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
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
    backgroundColor: '#c0c0c0',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});