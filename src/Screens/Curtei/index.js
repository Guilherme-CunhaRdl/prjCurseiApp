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
  RefreshControl

} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Video } from 'expo-av';
import axios from 'axios';
import host from '../../global';

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
  const [refreshing, setRefreshing] = useState(false); // Estado para o refresh

  // Buscar dados do banco
  const fetchCurteis = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://${host}:8000/api/curtei/videos`);
      
      // Verificar a estrutura da resposta
      if (!response.data || !response.data.videos || !Array.isArray(response.data.videos)) {
        console.error('Formato inesperado da API:', response.data);
        throw new Error('Formato de resposta inesperado da API');
      }

      // Mapear os dados para o formato esperado
      const enrichedStories = response.data.videos.map(curtei => ({
        id: curtei.id.toString(),
        videoUrl: curtei.video_url,
        // Usar exatamente o mesmo padrão que no componente Perfil
        userImage: curtei.usuario.foto,
        institutionName: curtei.usuario.nome,
        description: curtei.legenda,
        likes: 0,
        comments: 0
      }));
      
      setStories(enrichedStories);
    } catch (err) {
      console.error('Erro ao buscar curteis:', err);
      setError('Não foi possível carregar os curteis');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurteis();
  }, []);

  const handleScrollEnd = (e) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    const maxOffset = (stories.length - 1) * ITEM_HEIGHT;
    const clampedOffset = Math.min(Math.max(offsetY, 0), maxOffset);
    const index = Math.round(clampedOffset / ITEM_HEIGHT);

    if (currentIndex !== index) {
      // Pausar todos os vídeos
      videoRefs.current.forEach((ref, i) => {
        if (ref && ref.pauseAsync) {
          ref.pauseAsync();
        }
      });

      // Tocar o vídeo atual
      const currentVideo = videoRefs.current[index];
      if (currentVideo && currentVideo.playAsync) {
        currentVideo.playAsync();
      }

      setCurrentIndex(index);
      flatListRef.current?.scrollToOffset({
        offset: index * ITEM_HEIGHT,
        animated: true,
      });
    }
  };

  const handleScroll = (e) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    const maxOffset = (stories.length - 1) * ITEM_HEIGHT;

    if (offsetY > maxOffset) {
      flatListRef.current?.scrollToOffset({
        offset: maxOffset,
        animated: false,
      });
    }
  };

  useEffect(() => {
    if (!isFocused) {
      // Pausar todos os vídeos quando sair da tela
      videoRefs.current.forEach((ref) => {
        if (ref?.pauseAsync) {
          ref.pauseAsync();
        }
      });
    } else {
      // Tocar o vídeo atual quando voltar para a tela
      const currentVideo = videoRefs.current[currentIndex];
      if (currentVideo?.playAsync) {
        currentVideo.playAsync();
      }
    }
  }, [isFocused]);

  const recarrecarCurteis = () => {
        fetchCurteis();

  }

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
      <LinearGradient
        colors={['transparent', 'rgba(0, 0, 0, 0.7)']}
        style={styles.overlay}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={responsiveFontSize(7)} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>Curtei</Text>
          <TouchableOpacity onPress={() => navigation.navigate('CriarCurteis')}>
            <Ionicons name="camera-outline" size={responsiveFontSize(7)} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.profileSection}>
            <Image
              style={styles.profileImage}
              source={
                item.userImage
                  ? { uri: `http://${host}:8000/img/user/fotoPerfil/${item.userImage}` }
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
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.button}>
            <Ionicons name="heart-outline" size={responsiveFontSize(6)} color="white" />
            <Text style={styles.buttonText}>{item.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Ionicons name="chatbubble-outline" size={responsiveFontSize(6)} color="white" />
            <Text style={styles.buttonText}>{item.comments}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Ionicons name="paper-plane-outline" size={responsiveFontSize(6)} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Ionicons name="ellipsis-vertical" size={responsiveFontSize(6)} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );

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
        <TouchableOpacity onPress={() => navigation.navigate('CriarCurteis')} style={styles.createButton}>
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
        onScroll={handleScroll}
        getItemLayout={(data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={recarrecarCurteis}
           
          />
        }
        overScrollMode="never"
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