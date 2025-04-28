import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator, FlatList, Image, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import Configuracoes from './Configurações/configuracoes';
import Comentario from './Comentario';
import Compartilhar from '../Components/Compartilhar';
import Icon from "react-native-vector-icons/Feather";
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/pt-br'; 


export default function App() {
 
  const [posts, setPosts] = useState();
  dayjs.extend(relativeTime);
  dayjs.locale('pt-br')
  useEffect(() => {
    const fetchPosts = async () => {
      
        const response = await axios.get('http://localhost:8000/api/posts/0/0/100/0/0');
        console.log(response.data.data)
        setPosts(response.data.data)
    };

    fetchPosts();
  }, []);
  const formatarTempoInsercao = (seconds) => {
    return dayjs().subtract(seconds, 'seconds').fromNow(); // Exibe o tempo como "há 2 horas", "há 1 dia", etc.
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <FlatList
        data={posts}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id_post.toString()}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            <View style={styles.postHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={{ uri: `http://localhost:8000/img/user/fotoPerfil/${item.img_user}` }} 
                  style={styles.fotoUser}
                />
                <View style={{ paddingLeft: 10 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.institutionText}>
                      {item.nome_user}
                    </Text>
                    <Text style={styles.horaPost}>
                      ·
                    </Text>
                    <Text style={styles.horaPost}>
                      {formatarTempoInsercao(item.tempo_insercao)}
                    </Text>
                  </View>
                  <Text style={styles.arrobaUser}>
                    @{item.arroba_user}
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
                <Image style={{ width: '100%', height: '100%', borderRadius: 8 }} source={{ uri: `http://localhost:8000/img/user/imgPosts/${item.conteudo_post}` }} />
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