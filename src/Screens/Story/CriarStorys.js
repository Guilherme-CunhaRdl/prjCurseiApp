import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
  Animated,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Video } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import host from '../../global';

const { width, height } = Dimensions.get('window');

const responsiveFontSize = (percentage) => Math.round((width * percentage) / 100);
const responsiveWidth = (percentage) => width * (percentage / 100);
const responsiveHeight = (percentage) => height * (percentage / 100);

const storyWidth = width * 0.9;
const storyHeight = (storyWidth * 16) / 9;

const CriarStory = () => {
  const [conteudo, setConteudo] = useState('');
  const [mediaUri, setMediaUri] = useState(null);
  const [mediaType, setMediaType] = useState(null); // 'image' ou 'video'
  const [uploading, setUploading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const mediaFileRef = useRef(null);
  const scrollViewRef = useRef(null);
  const animatedIndex = useRef(new Animated.Value(0)).current;
  const videoRef = useRef(null);






  useEffect(() => {

    
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de acesso à sua galeria para selecionar fotos ou vídeos.');
      }
    })();
  }, []);

  const scrollToSection = (index) => {
    scrollViewRef.current?.scrollTo({ x: width * index, animated: true });
  };

  const selectMedia = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [9, 16],
        quality: 0.8,
      });
  
      if (!result.canceled && result.assets?.length > 0) {
        const asset = result.assets[0];
        setMediaUri(asset.uri);
        setMediaType(asset.type);
        
  
        const fileExtension = asset.uri.split('.').pop();
        const mimeType = asset.type === 'video' ? 
          `video/${fileExtension}` : 
          `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`;
  
        mediaFileRef.current = {
          uri: asset.uri,
          type: mimeType, 
          name: `story_${Date.now()}.${fileExtension}`,
        };
      }
    } catch (error) {
      console.error('Erro ao selecionar mídia:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a mídia');
    }
  };

  const handleUpload = async () => {
    if (!mediaFileRef.current) {
      Alert.alert('Atenção', 'Selecione uma foto ou vídeo');
      return;
    }
  
    setUploading(true);
  
    try {
      const idUser = await AsyncStorage.getItem('idUser');
      if (!idUser) throw new Error('Usuário não logado');
  
      const formData = new FormData();
      
      // Adiciona o arquivo corretamente
      formData.append('conteudo_storyes', {
        uri: mediaFileRef.current.uri,
        type: mediaFileRef.current.type, // Ex: 'image/jpeg'
        name: mediaFileRef.current.name   // Ex: 'story_1234567890.jpeg'
      });
      
      formData.append('legenda', conteudo);
      formData.append('id_user', idUser);
  
      console.log('Enviando para:', `http://${host}:8000/api/status/upload`);
      console.log('Dados do FormData:', {
        uri: mediaFileRef.current.uri,
        type: mediaFileRef.current.type,
        name: mediaFileRef.current.name,
        legenda: conteudo,
        id_user: idUser
      });
  
      const response = await fetch(`http://${host}:8000/api/status/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          // Não definir Content-Type, o RN faz automaticamente
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erro ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Resposta do servidor:', data);
  
      Alert.alert('Sucesso!', 'Story publicado com sucesso!');
      setMediaUri(null);
      setConteudo('');
      scrollToSection(0);
  
    } catch (error) {
      console.error('Erro completo:', {
        message: error.message,
        stack: error.stack,
        response: error.response
      });
      
      Alert.alert(
        'Erro de Conexão', 
        `Verifique:
        1. Se está na mesma rede Wi-Fi
        2. Se o IP do servidor está correto
        3. Se o servidor está rodando
        
        Detalhes: ${error.message}`
      );
    } finally {
      setUploading(false);
    }
  };




  useEffect(() => {
    Animated.timing(animatedIndex, {
      toValue: currentIndex,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentIndex]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Novo Story</Text>
      </View>
      
      <View style={styles.pageIndicatorContainer}>
        {[0, 1].map((index) => {
          const scale = animatedIndex.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [1, 1.8, 1],
            extrapolate: 'clamp',
          });

          const opacity = animatedIndex.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.pageIndicatorDot,
                {
                  transform: [{ scale }],
                  opacity,
                  backgroundColor: '#3B82F6',
                },
              ]}
            />
          );
        })}
      </View>
      
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ width: width * 2 }}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        scrollEventThrottle={16}
      >
        {/* Página 1 - Seleção de mídia */}
        <View style={styles.page}>
          {mediaUri ? (
            <ScrollView style={styles.preview}>
              {mediaType === 'video' ? (
                <Video
                  ref={videoRef}
                  source={{ uri: mediaUri }}
                  style={styles.media}
                  resizeMode="cover"
                  isLooping
                  shouldPlay={false}
                  useNativeControls
                />
              ) : (
                <Image source={{ uri: mediaUri }} style={styles.media} resizeMode="cover" />
              )}
              <TouchableOpacity style={styles.editButton} onPress={selectMedia}>
                <Icon name="edit" size={25} color="#fff" />
              </TouchableOpacity>
            </ScrollView>
          ) : (
            <UploadPlaceholder 
              icon={mediaType === 'video' ? 'videocam' : 'image'} 
              label="Selecionar foto ou vídeo" 
              onPress={selectMedia} 
            />
          )}
          {mediaUri && (
            <TouchableOpacity 
              style={styles.nextButton} 
              onPress={() => scrollToSection(1)}
              disabled={uploading}
            >
              <Text style={styles.nextText}>Avançar</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Página 2 - Legenda e upload */}
        <View style={styles.page}>
          <Text style={styles.label}>Legenda (opcional)</Text>
          <TextInput
            placeholder="Adicione uma legenda ao seu story..."
            placeholderTextColor="#9CA3AF"
            value={conteudo}
            onChangeText={setConteudo}
            maxLength={220}
            multiline
            style={styles.input}
            textAlignVertical="top"
          />
          <Text style={styles.charCounter}>{conteudo.length}/220</Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.backButton, uploading && styles.buttonDisabled]}
              onPress={() => scrollToSection(0)}
              disabled={uploading}
            >
              <Text style={styles.backButtonText}>Voltar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.uploadButton, (!mediaUri || uploading) && styles.buttonDisabled]}
              onPress={handleUpload}
              disabled={uploading || !mediaUri}
            >
              {uploading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <AntDesign name="upload" size={20} color="#fff" />
                  <Text style={styles.uploadText}>Publicar</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const UploadPlaceholder = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.placeholder} onPress={onPress}>
    <Icon name={icon} size={50} color="#3B82F6" />
    <Text style={styles.placeholderLabel}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  page: {
    width: width,
    alignItems: 'center',
    padding: 20,
    justifyContent: 'center',
  },
  placeholder: {
    width: storyWidth,
    height: storyHeight,
    borderWidth: 2,
    borderColor: '#3B82F6',
    borderStyle: 'dashed',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
  },
  placeholderLabel: {
    marginTop: 10,
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '500',
  },
  preview: {
    width: storyWidth,
    height: storyHeight,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#ddd',
    position: 'relative',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  editButton: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 25,
  },
  nextButton: {
    marginTop: 20,
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  nextText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 10,
    fontWeight: '500',
  },
  input: {
    width: '100%',
    height: responsiveHeight(20),
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    backgroundColor: '#F9FAFB',
    color: '#1F2937',
    fontSize: 16,
  },
  charCounter: {
    alignSelf: 'flex-end',
    color: '#9CA3AF',
    marginTop: 5,
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  backButton: {
    backgroundColor: '#E5E7EB',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  backButtonText: {
    color: '#4B5563',
    fontSize: 16,
    fontWeight: '600',
  },
  uploadButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    gap: 10,
    flex: 1,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  uploadText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  pageIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  pageIndicatorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 6,
  },
});

export default CriarStory;