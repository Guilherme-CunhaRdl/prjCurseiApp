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

const videoWidth = width * 0.9;
const videoHeight = (videoWidth * 16) / 9;


const testConnection = async () => {
  try {
    const response = await fetch(`http://${host}:8000/ping`);
    const data = await response.json();
    console.log('Teste de conexão:', data);
  } catch (error) {
    console.error('Falha no teste de conexão:', error);
  }
};

const CriarCurteis = () => {
  const [caption, setCaption] = useState('');
  const [videoUri, setVideoUri] = useState(null);
  const [thumbUri, setThumbUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoFileRef = useRef(null);
  const thumbFileRef = useRef(null);
  const videoRef = useRef(null);
  const animatedIndex = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de acesso à sua galeria para selecionar vídeos e fotos.');
      }
    })();
  }, []);

  const scrollToSection = (index) => {
    scrollViewRef.current?.scrollTo({ x: width * index, animated: true });
  };

  const selectVideo = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setVideoUri(result.assets[0].uri);
        videoFileRef.current = {
          uri: result.assets[0].uri,
          type: result.assets[0].type || 'video/mp4',
          name: result.assets[0].fileName || `video_${Date.now()}.mp4`,
        };
      }
    } catch (error) {
      console.error('Erro ao selecionar vídeo:', error);
      Alert.alert('Erro', 'Não foi possível selecionar o vídeo');
    }
  };

  const selectThumbnail = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setThumbUri(result.assets[0].uri);
        thumbFileRef.current = {
          uri: result.assets[0].uri,
          type: result.assets[0].type || 'image/jpeg',
          name: result.assets[0].fileName || `thumb_${Date.now()}.jpg`,
        };
      }
    } catch (error) {
      console.error('Erro ao selecionar thumbnail:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a thumbnail');
    }
  };

  const handleUpload = async () => {
    if (!videoFileRef.current || !thumbFileRef.current) {
      Alert.alert('Atenção', 'Selecione um vídeo e uma thumbnail');
      return;
    }
  
    setUploading(true);
    
    try {
      const idUser = await AsyncStorage.getItem('idUser');
      if (!idUser) throw new Error('Usuário não identificado');
  
      // Teste de conexão básico
      try {
        await axios.get(`http://${host}:8000`, { timeout: 5000 });
      } catch (e) {
        throw new Error('Servidor inacessível. Verifique: \n- Se o servidor está rodando\n- Se o IP está correto\n- Se estão na mesma rede');
      }
  
      // FormData modificado para React Native
      const formData = new FormData();
      formData.append('caminho_curtei', {
        uri: videoFileRef.current.uri,
        type: 'video/mp4', // Forçar tipo MIME
        name: 'video.mp4'
      });
      formData.append('caminho_curtei_thumb', {
        uri: thumbFileRef.current.uri,
        type: 'image/jpeg',
        name: 'thumbnail.jpg'
      });
      formData.append('legenda_curtei', caption);
      formData.append('id_user', idUser);
  
      console.log('Enviando para:', `http://${host}:8000/api/curtei/upload`);
      
      const response = await fetch(`http://${host}:8000/api/curtei/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro no servidor');
      }
  
      Alert.alert('Sucesso!', 'Vídeo publicado!');
      setVideoUri(null);
      setThumbUri(null);
      setCaption('');
      scrollToSection(0);
  
    } catch (error) {
      console.error('Erro completo:', JSON.stringify(error, null, 2));
      Alert.alert('Erro', error.message || 'Falha na comunicação');
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
      <View style={styles.pageIndicatorContainer}>
        {[0, 1, 2].map((index) => {
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
        contentContainerStyle={{ width: width * 3 }}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        scrollEventThrottle={16}
      >
        {/* Página 1 - Seleção de vídeo */}
        <View style={styles.page}>
          {videoUri ? (
            <View style={styles.preview}>
              <Video
                ref={videoRef}
                source={{ uri: videoUri }}
                style={styles.media}
                resizeMode="cover"
                isLooping
                shouldPlay={false}
                useNativeControls
              />
              <TouchableOpacity style={styles.editButton} onPress={selectVideo}>
                <Icon name="edit" size={25} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <UploadPlaceholder icon="videocam" label="Selecionar vídeo" onPress={selectVideo} />
          )}
          {videoUri && (
            <TouchableOpacity 
              style={styles.nextButton} 
              onPress={() => scrollToSection(1)}
              disabled={uploading}
            >
              <Text style={styles.nextText}>Avançar</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Página 2 - Seleção de thumbnail */}
        <View style={styles.page}>
          {thumbUri ? (
            <View style={styles.preview}>
              <Image source={{ uri: thumbUri }} style={styles.media} resizeMode="cover" />
              <TouchableOpacity style={styles.editButton} onPress={selectThumbnail}>
                <Icon name="edit" size={25} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <UploadPlaceholder icon="image" label="Selecionar thumbnail" onPress={selectThumbnail} />
          )}
          {thumbUri && (
            <TouchableOpacity 
              style={styles.nextButton} 
              onPress={() => scrollToSection(2)}
              disabled={uploading}
            >
              <Text style={styles.nextText}>Avançar</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Página 3 - Legenda e upload */}
        <View style={styles.page}>
          <Text style={styles.label}>Legenda (opcional)</Text>
          <TextInput
            placeholder="Conte a história por trás desse vídeo..."
            value={caption}
            onChangeText={setCaption}
            maxLength={220}
            multiline
            style={styles.input}
            textAlignVertical="top"
          />
          <Text style={styles.charCounter}>{caption.length}/220</Text>
          <TouchableOpacity
            style={[styles.uploadButton, (!videoUri || !thumbUri) && styles.uploadButtonDisabled]}
            onPress={handleUpload}
            disabled={uploading || !videoUri || !thumbUri}
          >
            {uploading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <AntDesign name="upload" size={20} color="#fff" />
                <Text style={styles.uploadText}>Publicar vídeo</Text>
              </>
            )}
          </TouchableOpacity>
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
  page: {
    width: width,
    alignItems: 'center',
    padding: 20,
    justifyContent: 'center',
  },
  placeholder: {
    width: videoWidth,
    height: videoHeight,
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
  },
  preview: {
    width: videoWidth,
    height: videoHeight,
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
    fontSize: 18,
    color: '#4B5563',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: responsiveHeight(20),
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    backgroundColor: '#F9FAFB',
  },
  charCounter: {
    alignSelf: 'flex-end',
    color: '#6B7280',
    marginTop: 5,
  },
  uploadButton: {
    marginTop: 20,
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    gap: 10,
    width: '100%',
  },
  uploadButtonDisabled: {
    backgroundColor: '#a5c3f7',
  },
  uploadText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  pageIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: responsiveHeight(5),
  },
  pageIndicatorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 6,
  },
});

export default CriarCurteis;