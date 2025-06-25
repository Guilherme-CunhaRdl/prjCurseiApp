import React, { useRef, useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  Platform,
  ActivityIndicator,
  RefreshControl,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Video } from 'expo-av';
import axios from 'axios';
import host from '../../global';
import ComentarioCurtei from '../../Components/ComentarioCurtei';
import ModalOpcoesCurtei from '../../Components/ModalOpcoesCurtei';
import CompartilharCurtei from '../../Components/CompartilharCurtei';

const { height, width } = Dimensions.get('window');
const ITEM_HEIGHT = height;
const SNAP_INTERVAL = ITEM_HEIGHT;

// Cálculos responsivos
const responsiveFontSize = (percentage) => Math.round((width * percentage) / 100);
const responsiveWidth = (percentage) => width * (percentage / 100);
const responsiveHeight = (percentage) => height * (percentage / 100);

export default function Curtei() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const videoRefs = useRef([]);
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [selectedCurteiId, setSelectedCurteiId] = useState(null);
  const [showOpcoesModal, setShowOpcoesModal] = useState(false);
  const [curteiSelecionado, setCurteiSelecionado] = useState(null);
  const [modalComp, setModalComp] = useState(false);
  const [chats, setChats] = useState([]);
  // Carregar dados do usuário e curteis
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedId = await AsyncStorage.getItem('idUser');
        if (storedId) setUserId(storedId);
        await fetchCurteis();
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setError('Erro ao carregar dados');
      }
    };
    
    loadData();
    trazerChats(userId);
  }, [isFocused]);


  
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

  // Função para curtir/descurtir vídeos
  const handleCurtir = async (curteiId, isLiked) => {
    if (!userId) {
      Alert.alert('Ação necessária', 'Você precisa estar logado para curtir');
      return;
    }

    try {
      const endpoint = isLiked 
        ? `http://${host}:8000/api/curtei/${curteiId}/descurtir`
        : `http://${host}:8000/api/curtei/${curteiId}/curtir`;

      await axios.post(endpoint, { id_user: userId }, {
        headers: { 'Content-Type': 'application/json' }
      });

      // Atualização otimista
      setStories(prev => prev.map(item => 
        item.id === curteiId.toString() ? {
          ...item,
          likes: isLiked ? Math.max(0, item.likes - 1) : item.likes + 1,
          liked: !isLiked
        } : item
      ));
    } catch (error) {
      console.error('Erro na curtida:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a curtida');
    }
  };

  // Buscar curteis da API
  const fetchCurteis = async () => {
    try {
      setLoading(true);
      setRefreshing(true);
      
      const [videosResponse, likesResponse] = await Promise.all([
        axios.get(`http://${host}:8000/api/curtei/videos`),
        userId ? axios.get(`http://${host}:8000/api/curtidas/usuario/${userId}`) : Promise.resolve(null)
      ]);

      const videos = videosResponse.data.videos || [];
      const userLikes = likesResponse?.data?.curtidas?.map(c => c.id_curtei.toString()) || [];

      const enrichedStories = videos.map(video => ({
        id: video.id.toString(),
        videoUrl: video.video_url,
        thumbUrl: video.thumb_url,
        userImage: video.usuario?.foto,
        institutionName: video.usuario?.nome,
        idUser: video.usuario?.id,
        description: video.legenda,
        likes: video.curtidas_count || 0,
        comments: video.comentarios_count || 0,
        liked: userLikes.includes(video.id.toString())
      }));
      
      setStories(enrichedStories);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar curteis:', err);
      setError('Não foi possível carregar os vídeos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Controle de scroll e vídeos
  const handleScrollEnd = (e) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    const index = Math.round(Math.min(Math.max(offsetY, 0), (stories.length - 1) * ITEM_HEIGHT) / ITEM_HEIGHT);

    if (currentIndex !== index) {
      videoRefs.current.forEach((ref, i) => ref?.setStatusAsync({ shouldPlay: i === index }));
      setCurrentIndex(index);
    }
  };

  // Pausar vídeos quando a tela perde foco
  useEffect(() => {
    if (!isFocused) {
      videoRefs.current.forEach(ref => ref?.pauseAsync());
    } else {
      videoRefs.current[currentIndex]?.playAsync();
    }
  }, [isFocused]);

  // Renderização do item do FlatList
  const renderItem = ({ item, index }) => (
    <View style={styles.videoContainer}>
      <Video
        ref={(ref) => (videoRefs.current[index] = ref)}
        source={{ uri: item.videoUrl }}
        style={styles.video}
        resizeMode="cover"
        isLooping
        isMuted={false}
        useNativeControls={false}
        shouldPlay={index === currentIndex}
      />
      
      <LinearGradient colors={['transparent', 'rgba(0, 0, 0, 0.7)']} style={styles.overlay}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={responsiveFontSize(7)} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>Curtei</Text>
          <TouchableOpacity onPress={() => navigation.navigate('CriarCurteis')}>
            <Ionicons name="camera-outline" size={responsiveFontSize(7)} color="white" />
          </TouchableOpacity>
        </View>

        {/* Informações do usuário */}
        <View style={styles.contentContainer}>
          <View style={styles.profileSection}>
            <Image
              style={styles.profileImage}
              source={item.userImage 
                ? { uri: item.userImage } 
                : require('../../../assets/userDeslogado.png')
              }
            />
            <Text style={styles.institutionName}>{item.institutionName}</Text>
          </View>

          {item.description && (
            <Text style={styles.description} numberOfLines={1} ellipsizeMode="tail">
              {item.description}
            </Text>
          )}
        </View>

        {/* Botões de ação */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.button} onPress={() => handleCurtir(item.id, item.liked)}>
            <Ionicons 
              name={item.liked ? "heart" : "heart-outline"}  
              size={responsiveFontSize(6)}  
              color={item.liked ? "#FF0000" : "white"}  
            />
            <Text style={[styles.buttonText, item.liked && styles.likedText]}>{item.likes}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => {
              setSelectedCurteiId(item.id);
              setShowComments(true);
            }}
          >
            <Ionicons name="chatbubble-outline" size={responsiveFontSize(6)} color="white" />
            <Text style={styles.buttonText}>{item.comments}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button} onPress={() => {
            setModalComp(true)
            setCurteiSelecionado(item)
          }
          }>
            <Ionicons name="paper-plane-outline" size={responsiveFontSize(6)} color="white" />
          </TouchableOpacity>
          
          {item.idUser?.toString() === userId && (

  <TouchableOpacity
    style={styles.button}
    onPress={() => {
      setCurteiSelecionado(item);
      setShowOpcoesModal(true);
    }}
  >
    <Ionicons name="ellipsis-vertical" size={responsiveFontSize(6)} color="white" />
  </TouchableOpacity>
)}

        </View>
      </LinearGradient>
    </View>
  );

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
        <TouchableOpacity onPress={fetchCurteis} style={styles.retryButton}>
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (stories.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Nenhum curtei disponível</Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('CriarCurteis')} 
          style={styles.createButton}
        >
          <Ionicons name="camera-outline" size={responsiveFontSize(7)} color="white" />
          <Text style={styles.createText}>Criar seu primeiro curtei</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={stories}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        pagingEnabled
        snapToInterval={SNAP_INTERVAL}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}
        getItemLayout={(data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchCurteis}
          />
        }
        overScrollMode="never"
      />

      {/* Modal de Comentários */}
      <ComentarioCurtei 
        idCurtei={selectedCurteiId} 
        isVisible={showComments}
        onClose={() => {
          setShowComments(false);
          fetchCurteis();
        }}
      />

            {/* Modal de Opçoes */}
            <ModalOpcoesCurtei
  visible={showOpcoesModal}
  onClose={() => setShowOpcoesModal(false)}
  onEditar={() => {
    setShowOpcoesModal(false);
    navigation.navigate('CriarCurteis', { curtei: curteiSelecionado });
  }}
  onExcluir={async () => {
    setShowOpcoesModal(false);
    try {
      await axios.delete(`http://${host}:8000/api/curtei/deletar/${curteiSelecionado.id}`);
      fetchCurteis();
      Alert.alert('Sucesso', 'Curtei excluído com sucesso!');
    } catch (err) {
      console.error('Erro ao excluir:', err);
      Alert.alert('Erro', 'Não foi possível excluir');
    }
  }}
/>

        <CompartilharCurtei 
        chats={chats} 
        visibilidade={modalComp} 
        curtei={curteiSelecionado} 
        idCurtei={curteiSelecionado.id}
        onClose={() => setModalComp(false)} 
         />


    </SafeAreaView>



  );

  
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  videoContainer: {
    height: ITEM_HEIGHT,
    width,
    backgroundColor: 'black',
  },
  video: {
    flex: 1,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    padding: 20,
  },
  emptyText: {
    color: 'white',
    fontSize: responsiveFontSize(4.5),
    textAlign: 'center',
    marginBottom: 20,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 10,
  },
  createText: {
    color: 'white',
    fontSize: responsiveFontSize(4),
  },
});