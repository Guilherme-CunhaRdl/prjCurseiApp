import React, { useState, useRef } from 'react';
import { View, Button, TextInput, Alert } from 'react-native';
import axios from 'axios';

const VideoUpload = () => {
  const [caption, setCaption] = useState('');
  const videoRef = useRef();
  const thumbRef = useRef();
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!videoRef.current?.files[0] || !thumbRef.current?.files[0]) {
      Alert.alert('Erro', 'Selecione ambos os arquivos');
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('caminho_curtei', videoRef.current.files[0]);
    formData.append('caminho_curtei_thumb', thumbRef.current.files[0]);
    formData.append('legenda_curtei', caption);

    try {
      const response = await axios.post('http://localhost:8000/api/curtei/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      Alert.alert('Sucesso', 'Vídeo enviado com sucesso!');
      console.log(response.data);
      
      // Limpar seleção
      videoRef.current.value = '';
      thumbRef.current.value = '';
      setCaption('');
      
    } catch (error) {
      console.error('Erro no upload:', error);
      Alert.alert('Erro', error.response?.data?.message || 'Falha no upload');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <input
        type="file"
        ref={videoRef}
        accept="video/mp4,video/avi,video/mov"
        style={{ display: 'none' }}
        id="videoInput"
      />
      <label htmlFor="videoInput">
        <Button 
          title={videoRef.current?.files[0] ? videoRef.current.files[0].name : 'Selecionar Vídeo'} 
          onPress={() => document.getElementById('videoInput').click()}
        />
      </label>

      <input
        type="file"
        ref={thumbRef}
        accept="image/jpeg,image/png,image/gif"
        style={{ display: 'none' }}
        id="thumbInput"
      />
      <label htmlFor="thumbInput">
        <Button 
          title={thumbRef.current?.files[0] ? thumbRef.current.files[0].name : 'Selecionar Thumbnail'} 
          onPress={() => document.getElementById('thumbInput').click()}
          style={{ marginTop: 10 }}
        />
      </label>

      <TextInput
        placeholder="Legenda (opcional)"
        value={caption}
        onChangeText={setCaption}
        maxLength={220}
        style={{ 
          borderWidth: 1, 
          padding: 10, 
          marginVertical: 10,
          minWidth: 300 
        }}
      />

      <Button 
        title={uploading ? 'Enviando...' : 'Enviar Vídeo'} 
        onPress={handleUpload} 
        disabled={uploading}
      />
    </View>
  );
};

export default VideoUpload;