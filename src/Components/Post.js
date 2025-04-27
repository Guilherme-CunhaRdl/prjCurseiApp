import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator, FlatList, Image, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import Configuracoes from './Configurações/configuracoes';
import Comentario from './Comentario';
import Compartilhar from '../Components/Compartilhar';
import Icon from "react-native-vector-icons/Feather";

const posts = [
  {
    id: '1',
    usuario: {
      nome_user: 'Ana Silva'
    },
    descricao_post: 'Olha só esse pôr do sol incrível que vi hoje!',
    image_url: 'https://images.unsplash.com/photo-1501973801540-537f08ccae7b',
  },
  {
    id: '2',
    usuario: {
      nome_user: 'Carlos Souza'
    },
    descricao_post: 'Meu novo livro favorito! Recomendo demais.',
    image_url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f',
  },
  {
    id: '3',
    usuario: {
      nome_user: 'Fernanda Lima'
    },
    descricao_post: 'Alguém mais ama café quanto eu? ☕',
    image_url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93',
  },
];

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <FlatList
        data={posts}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            <View style={styles.postHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={{ uri: 'https://cdn-icons-png.flaticon.com/128/3917/3917688.png' }} // Substituir pela imagem do usuário
                  style={styles.fotoUser}
                />
                <View style={{ paddingLeft: 10 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.institutionText}>
                      {item.usuario.nome_user}
                    </Text>
                    <Text style={styles.horaPost}>
                      ·
                    </Text>
                    <Text style={styles.horaPost}>
                      2h
                    </Text>
                  </View>
                  <Text style={styles.arrobaUser}>
                    @anaSilva
                  </Text>
                </View>
              </View>

              <Configuracoes />
            </View>
            <View style={styles.containerConteudo}>
              <Text style={styles.postText}>
                {item.descricao_post}
              </Text>
              <View style={styles.postContent}>
                <Image style={{ width: '100%', height: '100%', borderRadius: 8 }} source={{ uri: item.image_url }} />
              </View>
            </View>
            <View style={styles.postActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Icon name="heart" size={20} color="#666" />
              </TouchableOpacity>

              <View style={styles.containerComents}>
                <Comentario />
              </View>

              <TouchableOpacity style={styles.actionButton}>
                <Icon name="repeat" size={20} color="#666" />
              </TouchableOpacity>

              <View style={styles.containerShare}>
                <Compartilhar />
              </View>

              <TouchableOpacity style={styles.actionButton}>
                <Icon name="download" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
    
  },
  postContainer: {
    marginBottom: 30,
  },
  postText: {
    fontSize: 14,
    marginBottom: 5,
  },
  tituloPost: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postContent: {
    height: 210,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    marginBottom: 8,
  },
  containerConf: {
    alignSelf: 'center',
    paddingLeft: 5,
  },
  fotoUser: {
    width: 40,
    height: 40,
    borderRadius: 25,
  },
  arrobaUser: {
    fontSize: 12,
    color: '#666',
  },
  horaPost: {
    fontSize: 10,
    color: '#666',
    paddingLeft: 10,
    alignSelf: 'center',
  },
  containerConteudo: {
    paddingTop: 5,
  },

});