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
  ScrollView,
  Dimensions,
  Platform,
  Animated
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Video from 'react-native-video';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Calculate 9:16 aspect ratio dimensions
const videoWidth = screenWidth - 40;
const videoHeight = (videoWidth * 16) / 9;

const CriarCurtei = () => {
  const [caption, setCaption] = useState('');
  const [videoUri, setVideoUri] = useState(null);
  const [thumbUri, setThumbUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const scrollViewRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoFileRef = useRef(null);
  const thumbFileRef = useRef(null);

  // Auto-advance when fields are filled
  useEffect(() => {
    if (videoUri && currentIndex === 0) {
      scrollToSection(1);
    }
  }, [videoUri]);

  useEffect(() => {
    if (thumbUri && currentIndex === 1) {
      scrollToSection(2);
    }
  }, [thumbUri]);

  const selectVideo = async () => {
    try {
      if (Platform.OS === 'web') {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'video/*';
        input.onchange = (e) => {
          const file = e.target.files[0];
          if (file) {
            videoFileRef.current = file;
            const videoUrl = URL.createObjectURL(file);
            setVideoUri(videoUrl);
          }
        };
        input.click();
        return;
      }
      
      const result = await launchImageLibrary({
        mediaType: 'video',
        videoQuality: 'medium',
        durationLimit: 60,
      });
      
      if (result.assets && result.assets[0].uri) {
        setVideoUri(result.assets[0].uri);
        // No mobile, usamos a URI diretamente
        videoFileRef.current = {
          uri: result.assets[0].uri,
          type: result.assets[0].type || 'video/mp4',
          name: result.assets[0].fileName || `video_${Date.now()}.mp4`
        };
      }
    } catch (error) {
      console.error('Error selecting video:', error);
      Alert.alert('Erro', 'Não foi possível selecionar o vídeo');
    }
  };

  const selectThumbnail = async () => {
    try {
      if (Platform.OS === 'web') {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
          const file = e.target.files[0];
          if (file) {
            thumbFileRef.current = file;
            const thumbUrl = URL.createObjectURL(file);
            setThumbUri(thumbUrl);
          }
        };
        input.click();
        return;
      }
      
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
      });
      
      if (result.assets && result.assets[0].uri) {
        setThumbUri(result.assets[0].uri);
        thumbFileRef.current = {
          uri: result.assets[0].uri,
          type: result.assets[0].type || 'image/jpeg',
          name: result.assets[0].fileName || `thumb_${Date.now()}.jpg`
        };
      }
    } catch (error) {
      console.error('Error selecting thumbnail:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a thumbnail');
    }
  };

  const handleUpload = async () => {
    const idUserString = await AsyncStorage.getItem('idUser');
    const idUser = parseInt(idUserString);
    
    if (!videoFileRef.current || !thumbFileRef.current) {
      Alert.alert('Atenção', 'Você precisa selecionar um vídeo e uma thumbnail');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      
      // Adiciona os arquivos diretamente (funciona tanto web quanto mobile)
      formData.append('caminho_curtei', videoFileRef.current);
      formData.append('caminho_curtei_thumb', thumbFileRef.current);
      formData.append('legenda_curtei', caption);
      formData.append('id_user', idUser);

      const response = await axios.post('http://localhost:8000/api/curtei/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
      });
      
      Alert.alert('Sucesso!', 'Seu vídeo foi publicado com sucesso!');
      setVideoUri(null);
      setThumbUri(null);
      setCaption('');
      videoFileRef.current = null;
      thumbFileRef.current = null;
      
    } catch (error) {
      console.error('Erro completo:', error);
      console.error('Resposta do erro:', error.response?.data);
      
      let errorMessage = 'Ocorreu um erro ao enviar o vídeo';
      if (error.response?.data?.errors) {
        errorMessage = Object.values(error.response.data.errors).flat().join('\n');
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      Alert.alert('Erro', errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } }}],
    {
      useNativeDriver: false,
      listener: (event) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const newIndex = Math.round(offsetX / (screenWidth - 40));
        if (newIndex !== currentIndex) {
          setCurrentIndex(newIndex);
        }
      }
    }
  );

  const scrollToSection = (index) => {
    scrollViewRef.current?.scrollTo({ x: (screenWidth - 40) * index, animated: true });
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      {/* Indicadores de página */}
      <View style={styles.indicatorContainer}>
        <TouchableOpacity onPress={() => scrollToSection(0)}>
          <View style={[styles.indicator, currentIndex === 0 && styles.activeIndicator]} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => scrollToSection(1)}>
          <View style={[styles.indicator, currentIndex === 1 && styles.activeIndicator]} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => scrollToSection(2)}>
          <View style={[styles.indicator, currentIndex === 2 && styles.activeIndicator]} />
        </TouchableOpacity>
      </View>

      {/* Container principal horizontal */}
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalScroll}
        contentContainerStyle={styles.horizontalContent}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {/* Tela do Vídeo */}
        <View style={styles.fullScreenSection}>
          {videoUri ? (
            <View style={styles.videoContainer}>
              <Video
                source={{ uri: videoUri }}
                style={styles.videoPreview}
                paused={true}
                resizeMode="cover"
                muted
              />
              <TouchableOpacity 
                style={styles.changeButton}
                onPress={selectVideo}
              >
                <Icon name="edit" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.uploadPlaceholder}
              onPress={selectVideo}
              activeOpacity={0.7}
            >
              <Icon name="videocam" size={40} color="#3B82F6" />
              <Text style={styles.placeholderText}>Selecionar vídeo</Text>
              <Text style={styles.hintText}>Arraste para continuar</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Tela da Thumbnail */}
        <View style={styles.fullScreenSection}>
          {thumbUri ? (
            <View style={styles.thumbContainer}>
              <Image 
                source={{ uri: thumbUri }} 
                style={styles.thumbPreview} 
                resizeMode="cover"
              />
              <TouchableOpacity 
                style={styles.changeButton}
                onPress={selectThumbnail}
              >
                <Icon name="edit" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.uploadPlaceholder}
              onPress={selectThumbnail}
              activeOpacity={0.7}
            >
              <Icon name="image" size={40} color="#3B82F6" />
              <Text style={styles.placeholderText}>Selecionar thumbnail</Text>
              <Text style={styles.hintText}>Arraste para continuar</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Tela da Descrição e Upload */}
        <View style={styles.fullScreenSection}>
          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>Legenda (opcional)</Text>
            <TextInput
              placeholder="Conte a história por trás desse vídeo..."
              placeholderTextColor="#9CA3AF"
              value={caption}
              onChangeText={setCaption}
              maxLength={220}
              multiline
              numberOfLines={4}
              style={styles.input}
              textAlignVertical="top"
            />
            <Text style={styles.counter}>{caption.length}/220 caracteres</Text>
            
            <TouchableOpacity 
              style={[styles.uploadButton, (!videoUri || !thumbUri || uploading) && styles.uploadButtonDisabled]} 
              onPress={handleUpload}
              disabled={!videoUri || !thumbUri || uploading}
              activeOpacity={0.8}
            >
              {uploading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  {!videoUri || !thumbUri ? (
                    <AntDesign name="close" size={24} color="#fff" />
                  ) : (
                    <AntDesign name="check" size={24} color="#fff" />
                  )}
                  <Text style={styles.uploadButtonText}>
                    {!videoUri || !thumbUri ? 'Preencha os campos' : 'Publicar vídeo'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    gap: 10,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CBD5E0',
  },
  activeIndicator: {
    backgroundColor: '#3B82F6',
    width: 16,
  },
  horizontalScroll: {
    flex: 1,
  },
  horizontalContent: {
    width: (screenWidth - 40) * 3,
  },
  fullScreenSection: {
    width: screenWidth - 40,
    marginRight: 20,
  },
  videoContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    height: videoHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPreview: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E5E7EB',
  },
  thumbContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    height: videoHeight,
  },
  thumbPreview: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E5E7EB',
  },
  descriptionContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  changeButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 20,
  },
  uploadPlaceholder: {
    borderWidth: 2,
    borderColor: '#3B82F6',
    borderStyle: 'dashed',
    borderRadius: 12,
    height: videoHeight,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    padding: 20,
  },
  placeholderText: {
    color: '#3B82F6',
    marginTop: 12,
    fontWeight: '500',
    fontSize: 15,
    textAlign: 'center',
  },
  hintText: {
    color: '#718096',
    marginTop: 15,
    fontSize: 14,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
    fontSize: 15,
    color: '#1F2937',
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  counter: {
    textAlign: 'right',
    color: '#9CA3AF',
    marginTop: 6,
    fontSize: 13,
    marginBottom: 20,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  uploadButtonDisabled: {
    backgroundColor: '#93C5FD',
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 17,
    marginLeft: 12,
  },
});

export default CriarCurtei;