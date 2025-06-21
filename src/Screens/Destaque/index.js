import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import host from '../../global';

const VideoDestaque = ({ route }) => {
  const { idDestaque } = route.params;
  const [destaque, setDestaque] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestaque = async () => {
      try {
        const response = await axios.get(`http://${host}:8000/api/destaqueEspecifico/${idDestaque}`);
        if (response.data.success) {
          setDestaque(response.data.data);
        }
      } catch (error) {
        console.error('Erro ao buscar destaque:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDestaque();
  }, [idDestaque]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {destaque ? (
        <>
          <Text style={styles.title}>{destaque.titulo_destaque}</Text>
          {/* Implementar player de vídeo aqui */}
          {destaque.stories.map(story => (
            <Text key={story.id}>{story.legenda || 'Story sem legenda'}</Text>
          ))}
        </>
      ) : (
        <Text>Destaque não encontrado</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default VideoDestaque;