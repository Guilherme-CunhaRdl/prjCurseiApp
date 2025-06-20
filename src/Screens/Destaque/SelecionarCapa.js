import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  ActivityIndicator,
  Alert,
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
  
  // Calcula o número de colunas dinamicamente
  const numColumns = Math.min(3, Math.max(1, itemsData.length));
  
  // Calcula a largura dos itens considerando o número de colunas
  const spacing = 10;
  const availableWidth = width - 40; // 20 de cada lado
  const itemWidth = (availableWidth - (numColumns - 1) * spacing) / numColumns;

  const handleCreateHighlight = async () => {
    if (!selectedCover) return;
    
    try {
      setLoading(true);
      
      // Obter ID do usuário
      const id_user = await AsyncStorage.getItem('idUser');
      if (!id_user) {
        throw new Error('Usuário não logado');
      }
      
      // Ordenar stories: capa primeiro, depois os demais
      const orderedStories = [
        parseInt(selectedCover), // Converter para número se necessário
        ...selectedItems
          .map(id => parseInt(id))
          .filter(id => id !== parseInt(selectedCover))
      ];
      
      // Criar destaque via API
      const response = await DestaqueService.createDestaque(
        id_user, 
        orderedStories
      );
      
      if (response.success) {
        Alert.alert('Sucesso', 'Destaque criado com sucesso!');
        
        // Volta para a tela inicial (Home) e limpa o histórico de navegação
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      } else {
        throw new Error(response.message || 'Erro ao criar destaque');
      }
    } catch (error) {
      console.error('Erro ao criar destaque:', error);
      Alert.alert('Erro', error.message || 'Ocorreu um erro ao criar o destaque');
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
      {/* Foto principal centralizada */}
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

      {/* Modal da galeria */}
      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          {/* Botão de fechar fixo no canto superior direito */}
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
            keyExtractor={item => item.id}
            numColumns={numColumns}
            contentContainerStyle={[
              styles.galleryContainer,
              { paddingTop: 60 } // Espaço para o botão de fechar
            ]}
            ListHeaderComponent={<View style={{height: 10}} />}
            key={numColumns} // Força re-render quando numColumns muda
          />
        </View>
      </Modal>

      {/* Botão criar destaque */}
      <TouchableOpacity
        style={[styles.createButton, (!selectedCover || loading) && styles.disabledButton]}
        onPress={handleCreateHighlight}
        disabled={!selectedCover || loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Criar Destaque</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  coverPreview: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#3897f0',
    marginBottom: 20,
  },
  changeCoverButton: {
    marginTop: 10,
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
    borderRadius: 30,
    marginBottom: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
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