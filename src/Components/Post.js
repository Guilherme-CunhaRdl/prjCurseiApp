import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator, FlatList, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useState, useEffect} from 'react';
import Configuracoes from './Configurações/configuracoes';
import Comentario from './Comentario';
import Compartilhar from '../Components/Compartilhar';
import Icon from "react-native-vector-icons/Feather";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/cursei/posts');
        setPosts([response.data]);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);
  console.log(posts)
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centralizar}>
        <Text>Erro ao carregar posts: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <FlatList
        data={posts[0].data}
        keyExtractor={(item) => item.toString()}
        renderItem={({ item }) => (

          <View style={styles.postContainer}>
            <View style={styles.postHeader}>
              <View style={styles.containerPost}>
                <Text style={styles.institutionText}>
                  {item.usuario.nome_user}
                </Text>
              </View>
              <View style={styles.containerConf}>
                <Configuracoes />
              </View>
            </View>
            <Text style={styles.postText}>
              {item.descricao_post}
            </Text>
            <View style={styles.postContent}>
              <Image style={{ width: 100, height: 100 }} source={{ uri: item.image_url }} />
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
    padding: 16,
    backgroundColor: '#fff',
  },
  centralizar: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postContainer: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  tituloPost: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 5,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postContent: {
    height: 120,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    marginBottom: 8,
  },
  containerConf: {
    alignSelf: 'center',
    paddingLeft: 5,
  },

});