import React, { useRef, useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Video } from 'expo-av';
import axios from 'axios';
import host from '../global';
import ComentarioCurtei from './ComentarioCurtei';
import ModalOpcoesCurtei from './ModalOpcoesCurtei';
import CompartilharCurtei from './CompartilharCurtei';
const { height, width } = Dimensions.get('window');

// Cálculos responsivos
const responsiveFontSize = (percentage) => Math.round((width * percentage) / 100);
const responsiveWidth = (percentage) => width * (percentage / 100);
const responsiveHeight = (percentage) => height * (percentage / 100);

export default function PlayerCurtel() {
  const navigation = useNavigation();
  const route = useRoute();
  const videoRef = useRef(null);
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [showOpcoesModal, setShowOpcoesModal] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [modalComp, setModalComp] = useState(false);
  const [curteiSelecionado, setCurteiSelecionado] = useState([]);
  const [chats, setChats] = useState([])
  // Obter dados do vídeo da rota


  const { videoUrl, thumbnailUrl, videoId, userId: videoUserId, userImage } = route.params;

 const trazerChats = async (userId) => {
      id = await AsyncStorage.getItem('idUser')
  try {
    console.log(userId)
        const resposta = await axios.get(
          `http://${host}:8000/api/cursei/chat/recebidor/${id}/compartilhar/0`
        )
        console.log(resposta)
        setChats(resposta.data.conversas)
        return resposta.data.conversas;
  
      } catch (error) {
        console.error("Erro ao buscar mensagens:", error);
        return "deu erro";
      } 
  
      
    }

  // Carregar dados do usuário e vídeo
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedId = await AsyncStorage.getItem('idUser');
        if (storedId) setUserId(storedId);
        await fetchVideoData();
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setError('Erro ao carregar dados do vídeo');
      }
    };
    
    loadData();
    trazerChats(userId);
  }, []);

  // Buscar dados específicos do vídeo
  const fetchVideoData = async () => {
    try {
      setLoading(true);
      
      const response = await axios.get(`http://${host}:8000/api/curtei/${videoId}`, {
        params: {
          user_id: userId
        }
      });
      
      if (response.data.success) {
        const video = response.data.data;
        
        setVideoData({
          id: video.id.toString(),
          videoUrl: video.video_url,
          thumbUrl: video.thumb_url,
          userImage: video.usuario.foto,
          institutionName: video.usuario.nome,
          idUser: video.usuario.id,
          description: video.legenda,
          likes: video.curtidas_count || 0,
          comments: video.comentarios_count || 0,
          liked: video.curtiu || false
        });
        
        setLikesCount(video.curtidas_count || 0);
        setLiked(video.curtiu || false);
        setError(null);
      } else {
        setError('Não foi possível carregar os dados do vídeo');
      }
    } catch (err) {
      console.error('Erro ao carregar dados do vídeo:', err);
      setError('Não foi possível carregar os dados do vídeo');
    } finally {
      setLoading(false);
    }
  };

  // Função para curtir/descurtir vídeos
  const handleCurtir = async () => {
    if (!userId) {
      Alert.alert('Ação necessária', 'Você precisa estar logado para curtir');
      return;
    }

    try {
      const endpoint = liked 
        ? `http://${host}:8000/api/curtei/${videoId}/descurtir`
        : `http://${host}:8000/api/curtei/${videoId}/curtir`;

      const response = await axios.post(
        endpoint, 
        { id_user: userId }, 
        { headers: { 'Content-Type': 'application/json' } }
      );

      // Verifica se a resposta tem a estrutura esperada
      if (response.data && typeof response.data.curtidas_count !== 'undefined') {
        setLiked(!liked);
        setLikesCount(response.data.curtidas_count);
      } else {
        // Tenta extrair a contagem de curtidas da resposta
        const newCount = liked ? Math.max(0, likesCount - 1) : likesCount + 1;
        setLiked(!liked);
        setLikesCount(newCount);
      }
    } catch (error) {
      console.error('Erro na curtida:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a curtida');
    }
  };

  // Estados de carregamento e erro
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchVideoData} style={styles.retryButton}>
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!videoData) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Vídeo não encontrado</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.retryButton}>
          <Text style={styles.retryText}>Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

   


  return (
    <SafeAreaView style={styles.container}>
      <Video
        ref={videoRef}
        source={{ uri: videoData.videoUrl }}
        style={styles.video}
        resizeMode="cover"
        isLooping
        shouldPlay
        useNativeControls={false}
      />
      
      <LinearGradient colors={['transparent', 'rgba(0, 0, 0, 0.7)']} style={styles.overlay}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={responsiveFontSize(7)} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>Curtel</Text>
          <View style={{ width: responsiveFontSize(7) }} />
        </View>

        {/* Informações do usuário */}
        <View style={styles.contentContainer}>
          <View style={styles.profileSection}>
            <Image
              style={styles.profileImage}
              source={videoData.userImage 
                ? { uri: `http://${host}:8000/img/user/fotoPerfil/${ userImage || videoData.userImage}` } 
                : require('../../assets/etecLogo.jpg')
              }
            />
            <Text style={styles.institutionName}>{videoData.institutionName}</Text>
          </View>

          {videoData.description && (
            <Text style={styles.description} numberOfLines={3} ellipsizeMode="tail">
              {videoData.description}
            </Text>
          )}
        </View>

        {/* Botões de ação */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.button} onPress={handleCurtir}>
            <Ionicons 
              name={liked ? "heart" : "heart-outline"}  
              size={responsiveFontSize(6)}  
              color={liked ? "#FF0000" : "white"}  
            />
            <Text style={[styles.buttonText, liked && styles.likedText]}>{likesCount}</Text>
          </TouchableOpacity>
          
                <TouchableOpacity
        style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center' }}
        onPress={() => setShowComments(true)}
      >
        <Ionicons name="chatbubble-outline" size={responsiveFontSize(6)} color="white" />
        <Text style={styles.buttonText}>{videoData.comments}</Text>
      </TouchableOpacity>
          
          <TouchableOpacity style={styles.button} onPress={() => {
            setModalComp(true)
          }}>
            <Ionicons name="paper-plane-outline" size={responsiveFontSize(6)} color="white" />
          </TouchableOpacity>
          
          {videoData.idUser?.toString() === userId && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => setShowOpcoesModal(true)}
            >
              <Ionicons name="ellipsis-vertical" size={responsiveFontSize(6)} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      {/* Modal de Comentários */}
      <ComentarioCurtei 
        idCurtei={videoId} 
        isVisible={showComments}
        onClose={() => {
          setShowComments(false);
          fetchVideoData();
        }}
      />

      <CompartilharCurtei 
              chats={chats} 
              visibilidade={modalComp} 
              idCurtei={videoId} 
              curtei={videoData}
              onClose={() => setModalComp(false)} 
               />

      {/* Modal de Opções */}
      <ModalOpcoesCurtei
        visible={showOpcoesModal}
        onClose={() => setShowOpcoesModal(false)}
        onEditar={() => {
          setShowOpcoesModal(false);
          navigation.navigate('CriarCurteis', { curtei: videoData });
        }}
        onExcluir={async () => {
          setShowOpcoesModal(false);
          try {
            await axios.delete(`http://${host}:8000/api/curtei/deletar/${videoId}`);
            navigation.goBack();
            Alert.alert('Sucesso', 'Curtei excluído com sucesso!');
          } catch (err) {
            console.error('Erro ao excluir:', err);
            Alert.alert('Erro', 'Não foi possível excluir');
          }
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  video: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: responsiveWidth(4),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Platform.select({
      ios: responsiveHeight(6),
      android: responsiveHeight(4)
    }),
  },
  title: {
    color: 'white',
    fontSize: responsiveFontSize(5),
    fontWeight: 'bold',
    maxWidth: responsiveWidth(60),
  },
  contentContainer: {
    marginBottom: responsiveHeight(3),
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveWidth(2),
    marginBottom: responsiveHeight(2),
  },
  profileImage: {
    width: responsiveWidth(12),
    height: responsiveWidth(12),
    borderRadius: responsiveWidth(6),
  },
  institutionName: {
    color: 'white',
    fontSize: responsiveFontSize(4),
    fontWeight: '500',
    maxWidth: responsiveWidth(70),
  },
  description: {
    color: 'white',
    fontSize: responsiveFontSize(3.8),
    width: responsiveWidth(80),
  },
  actionButtons: {
    position: 'absolute',
    right: responsiveWidth(4),
    bottom: responsiveHeight(7),
    alignItems: 'center',
    gap: responsiveHeight(2),
  },
  button: {
    alignItems: 'center',
    marginVertical: responsiveHeight(0.5),
  },
  buttonText: {
    color: 'white',
    fontSize: responsiveFontSize(3),
    marginTop: responsiveHeight(0.5),
  },
  likedText: {
    color: '#FF0000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    padding: 20,
  },
  errorText: {
    color: 'white',
    fontSize: responsiveFontSize(4),
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontSize: responsiveFontSize(4),
  },
});