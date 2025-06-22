import React, { useState, useLayoutEffect, useEffect } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  Text,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Video } from 'expo-av'; // Adicionando novamente o componente Video
import { StatusBar } from 'expo-status-bar';
import { DestaqueService } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRef } from 'react';

const { width } = Dimensions.get('window');
const itemWidth = width / 3;

export default function CriarDestaques({ navigation }) {
  const [storiesData, setStoriesData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [id_user, setIdUser] = useState(null);
  const videoRefs = useRef({});

  useEffect(() => {
    const fetchUserAndStories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const storedIdUser = await AsyncStorage.getItem('idUser');
        if (!storedIdUser) throw new Error('Usuário não logado');
        
        setIdUser(storedIdUser);
        
        const response = await DestaqueService.getStories(storedIdUser);
        
        if (response.data && response.data.success && response.data.data.stories) {
          const formattedStories = response.data.data.stories.map(story => ({
            id: story.id.toString(),
            thumbnail: story.thumbnail || story.conteudo_storyes,
            content: story.conteudo_storyes,
            type: story.tipo_midia,
          }));
          
          setStoriesData(formattedStories);
        } else {
          setStoriesData([]);
        }
      } catch (error) {
        console.error('Erro ao carregar stories:', error);
        setError(error.message || 'Erro ao carregar stories');
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndStories();
  }, []);

  const toggleItemSelection = (itemId) => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  const handleProceed = () => {
    if (selectedItems.length === 0) {
      Alert.alert('Selecione pelo menos um story');
      return;
    }
    
    navigation.navigate('SelecionarCapa', {
      selectedItems,
      itemsData: storiesData.filter(item => selectedItems.includes(item.id)),
      id_user,
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          disabled={selectedItems.length === 0}
          onPress={handleProceed}
          style={[
            styles.headerButton,
            selectedItems.length === 0 && styles.headerButtonDisabled,
          ]}
        >
          <Text style={styles.headerButtonText}>
            Próximo ({selectedItems.length})
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, selectedItems]);

  const renderItem = ({ item }) => {
    const isSelected = selectedItems.includes(item.id);
    const orderNumber = isSelected ? selectedItems.indexOf(item.id) + 1 : '';

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={[styles.storyItem, { width: itemWidth }]}
        onPress={() => toggleItemSelection(item.id)}
      >
        {/* Usando Video para mostrar o primeiro frame */}
        {item.type === 'video' ? (
          <Video
            ref={ref => (videoRefs.current[item.id] = ref)}
            source={{ uri: item.content }}
            style={styles.thumbnail}
            resizeMode="cover"
            shouldPlay={false}
            isMuted
            isLooping={false}
            usePoster={false}
          />
        ) : (
          <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
        )}
      
        {/* Indicador de seleção */}
        <View style={styles.checkOverlay}>
          <View style={[styles.checkBox, isSelected && styles.checkBoxSelected]}>
            <Text style={styles.checkNumber}>{orderNumber}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3897f0" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (storiesData.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Nenhum story disponível</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={storiesData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={3}
        scrollEnabled
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />

      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  storyItem: {
    aspectRatio: 0.66,
    borderWidth: 0.3,
    borderColor: '#ddd',
    overflow: 'hidden',
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  videoIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }],
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 24,
  },
  checkOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  checkBox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  checkBoxSelected: {
    backgroundColor: '#3897f0',
    borderColor: '#3897f0',
  },
  checkNumber: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  headerButton: {
    marginRight: 10,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  headerButtonDisabled: {
    opacity: 0.5,
  },
  headerButtonText: {
    color: '#3897f0',
    fontWeight: '600',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
    marginBottom: 20,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#3897f0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});