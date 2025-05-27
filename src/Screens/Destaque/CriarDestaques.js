import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Video from 'react-native-video';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import host from '../../global';

const { width } = Dimensions.get('window');
const videoWidth = width * 0.9;
const videoHeight = (videoWidth * 16) / 9;

const CriarDestaques = () => {
  const [videoUri, setVideoUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const videoFileRef = useRef(null);

  const selectVideo = async () => {
    const result = await launchImageLibrary({
      mediaType: 'video',
      videoQuality: 'medium',
      durationLimit: 60,
    });
    if (result.assets && result.assets[0].uri) {
      setVideoUri(result.assets[0].uri);
      videoFileRef.current = {
        uri: result.assets[0].uri,
        type: result.assets[0].type || 'video/mp4',
        name: result.assets[0].fileName || `video_${Date.now()}.mp4`,
      };
    }
  };

  const handleUpload = async () => {
    const idUserString = await AsyncStorage.getItem('idUser');
    const idUser = parseInt(idUserString);

    if (!videoFileRef.current) {
      Alert.alert('Atenção', 'Você precisa selecionar um vídeo');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('caminho_curtei', videoFileRef.current);
      formData.append('id_user', idUser);

      await axios.post(`http://${host}:8000/api/curtei/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
      });

      Alert.alert('Sucesso!', 'Seu vídeo foi publicado com sucesso!');
      setVideoUri(null);
      videoFileRef.current = null;
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível enviar o vídeo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      {videoUri ? (
        <View style={styles.preview}>
          <Video source={{ uri: videoUri }} style={styles.media} resizeMode="cover" paused />
          <TouchableOpacity style={styles.editButton} onPress={selectVideo}>
            <Icon name="edit" size={25} color="#fff" />
          </TouchableOpacity>
        </View>
      ) : (
        <UploadPlaceholder icon="videocam" label="Selecionar vídeo" onPress={selectVideo} />
      )}

      <TouchableOpacity
        style={[styles.uploadButton, !videoUri && { backgroundColor: '#a5c3f7' }]}
        onPress={handleUpload}
        disabled={uploading || !videoUri}
      >
        {uploading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.uploadText}>Postar vídeo</Text>
        )}
      </TouchableOpacity>
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
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
  uploadButton: {
    marginTop: 10,
    backgroundColor: '#3B82F6',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 15,
    width:'100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CriarDestaques;
