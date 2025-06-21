import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  ActivityIndicator 
} from 'react-native';
import { DestaqueService } from './api'; // Ajuste o caminho conforme necessário
import AsyncStorage from '@react-native-async-storage/async-storage';

const videoDestaque = () => {
  const [destaques, setDestaques] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [id_user, setIdUser] = useState(null);

  useEffect(() => {
    const fetchDestaques = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Obter o ID do usuário do AsyncStorage
        const storedIdUser = await AsyncStorage.getItem('idUser');
        if (!storedIdUser) {
          throw new Error('Usuário não logado');
        }
        setIdUser(storedIdUser);
        
        // Buscar destaques usando o ID obtido
        const data = await DestaqueService.getDestaques(storedIdUser);
        setDestaques(data);
        setError(null);
      } catch (err) {
        setError('Falha ao carregar destaques');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDestaques();
  }, []); // Executa apenas na montagem do componente

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (!destaques || !destaques.success || !destaques.data || destaques.data.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Nenhum destaque encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.jsonText}>
        {JSON.stringify(destaques, null, 2)}
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
  jsonText: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#333',
  },
});

export default videoDestaque;