import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
  FlatList,
  TouchableWithoutFeedback,
  PanResponder,
  ActivityIndicator,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useIsFocused, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Video } from 'expo-av';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import host from '../../global';

const { height, width } = Dimensions.get('window');

const responsiveFontSize = (percentage) => Math.round((width * percentage) / 100);
const responsiveWidth = (percentage) => width * (percentage / 100);
const responsiveHeight = (percentage) => height * (percentage / 100);

export default function Story() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const route = useRoute();
  const { story: initialStory, storiesData: routeStoriesData, initialUserIndex = 0 } = route.params || {};

  // Estados
  const [storiesData, setStoriesData] = useState(routeStoriesData || []);
  const [loading, setLoading] = useState(!routeStoriesData);
  const [currentUserIndex, setCurrentUserIndex] = useState(initialUserIndex);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [userId, setUserId] = useState(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesState, setLikesState] = useState({});
  // Referências
  const videoRefs = useRef({});
  const flatListRef = useRef(null);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  // Dados atuais
  const currentUser = storiesData[currentUserIndex];
  const currentStory = currentUser?.stories?.[currentStoryIndex];

  useEffect(() => {
    const loadUserId = async () => {
      const id = await AsyncStorage.getItem('idUser');
      setUserId(id ? parseInt(id, 10) : null);
    };
    loadUserId();
  }, []);

//PARTE DO LIKE 
  const handleLike = async () => {
    try {
      const userId = await AsyncStorage.getItem('idUser');
      const res = await axios.post(`http://${host}:8000/api/status/like`, {
        id_user: userId,
        id_story: currentStory.id
      });
  
      setLikesState(prev => ({
        ...prev,
        [currentStory.id]: res.data.liked
      }));
    } catch (err) {
      console.error('Erro ao curtir:', err);
    }
  };

  useEffect(() => {
    const fetchLikeStatus = async () => {
      if (!currentStory?.id) return;
  
      try {
        const userId = await AsyncStorage.getItem('idUser');
        const res = await axios.get(`http://${host}:8000/api/status/is-liked`, {
          params: {
            id_user: userId,
            id_story: currentStory.id
          }
        });
  
        setLikesState(prev => ({
          ...prev,
          [currentStory.id]: res.data.liked
        }));
      } catch (err) {
        console.error('Erro ao verificar se já curtiu:', err);
      }
    };
  
    fetchLikeStatus();
  }, [currentStory?.id]);
//------------------------------------------------------------------------------

  const handleDeleteStory = (storyId) => {
    Alert.alert(
      'Apagar story',
      'Tem certeza que deseja apagar este story?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(`http://${host}:8000/api/status/${storyId}`);
              alert('Story deletado com sucesso');
              fetchStories(); 
            } catch (error) {
              alert('Erro ao deletar story');
            }
          }
        }
      ]
    );
  };

  const fetchStories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://${host}:8000/api/status`);
      const formattedData = formatStoriesData(response.data.data);
      setStoriesData(formattedData);
      
      if (initialStory) {
        const userIndex = formattedData.findIndex(user => 
          user.user.id === initialStory.user.id
        );
        if (userIndex !== -1) {
          setCurrentUserIndex(userIndex);
          const storyIndex = formattedData[userIndex].stories.findIndex(
            s => s.id === initialStory.id
          );
          if (storyIndex !== -1) setCurrentStoryIndex(storyIndex);
        }
      }
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar os stories');
    } finally {
      setLoading(false);
    }
  };

  const formatStoriesData = (stories) => {
    const usersMap = {};
    
    stories.forEach(story => {
      if (!usersMap[story.user.id]) {
        const userName = story.user.nome || story.user.nome_user || 'Usuário';
        usersMap[story.user.id] = {
          id: story.user.id.toString(),
          user: {
            id: story.user.id,
            name: userName,
            avatar: story.user.foto 
              ? `http://${host}:8000/img/user/fotoPerfil/${story.user.foto}`
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=random`
          },
          stories: []
        };
      }
      
      let mediaUrl = story.url;
      if (!mediaUrl.startsWith('http')) {
        mediaUrl = mediaUrl.startsWith('/') 
          ? `http://${host}:8000${mediaUrl}`
          : `http://${host}:8000/${mediaUrl}`;
      }
      
      let tipo_midia = story.tipo_midia?.toLowerCase();
      
      if (!tipo_midia || !['video', 'image'].includes(tipo_midia)) {
        const extension = mediaUrl.split('.').pop().toLowerCase();
        tipo_midia = ['mp4', 'mov', 'webm', 'ogg'].includes(extension) ? 'video' : 'image';
      }
      
      usersMap[story.user.id].stories.push({
        id: story.id.toString(),
        url: mediaUrl,
        tipo_midia: story.tipo_midia || tipo_midia,
        legenda: story.legenda,
        data_inicio: story.createdAt || new Date().toISOString()
      });
    });
  
    return Object.values(usersMap);
  };

  const startProgress = useCallback(() => {
    progressAnim.setValue(0);
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) handleNextStory();
    });
  }, [currentUserIndex, currentStoryIndex, storiesData]);

  const handleNextStory = useCallback(() => {
    if (!currentUser) return;
    if (currentStoryIndex < currentUser.stories.length - 1) {
      setCurrentStoryIndex((prev) => prev + 1);
    } else {
      handleNextUser();
    }
  }, [currentStoryIndex, currentUser]);

  const handlePrevStory = useCallback(() => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex((prev) => prev - 1);
    } else {
      handlePrevUser();
    }
  }, [currentStoryIndex]);

  const handleNextUser = useCallback(() => {
    if (currentUserIndex < storiesData.length - 1) {
      setCurrentUserIndex((prev) => prev + 1);
      setCurrentStoryIndex(0);
      flatListRef.current?.scrollToIndex({ index: currentUserIndex + 1, animated: true });
    } else {
      navigation.goBack();
    }
  }, [currentUserIndex, storiesData]);

  const handlePrevUser = useCallback(() => {
    if (currentUserIndex > 0) {
      setCurrentUserIndex((prev) => prev - 1);
      setCurrentStoryIndex(storiesData[currentUserIndex - 1].stories.length - 1);
      flatListRef.current?.scrollToIndex({ index: currentUserIndex - 1, animated: true });
    }
  }, [currentUserIndex, storiesData]);

  useEffect(() => {
    if (!routeStoriesData) {
      fetchStories();
    }
  }, []);

  useEffect(() => {
    if (!isFocused || !currentStory) return;
  
    const videoRef = videoRefs.current[currentStory?.id];
    let timeoutId;
  
    const prepareMedia = async () => {
      try {
        if (currentStory.tipo_midia === 'video') {
          await videoRef?.pauseAsync();
          await videoRef?.loadAsync(
            { uri: currentStory.url },
            { shouldPlay: isFocused },
            false
          );
          if (isFocused) {
            await videoRef?.playAsync();
          }
        } else {
          startProgress();
        }
      } catch {
        timeoutId = setTimeout(() => {
          handleNextStory();
        }, 5000);
      }
    };
  
    prepareMedia();
  
    return () => {
      clearTimeout(timeoutId);
      if (currentStory?.tipo_midia === 'video') {
        videoRef?.pauseAsync().catch(() => {});
      }
    };
  }, [currentStoryIndex, currentUserIndex, isFocused]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 10,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          Animated.timing(translateY, {
            toValue: height,
            duration: 200,
            useNativeDriver: true
          }).start(() => navigation.goBack());
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true
          }).start();
        }
      }
    })
  ).current;

  const renderUserStory = ({ item }) => {
    if (!item || !item.stories || !item.user) return null;

    const story = item.stories[currentStoryIndex];
    if (!story) return null;

    return (
      <Animated.View
        {...panResponder.panHandlers}
        style={{ width, height, transform: [{ translateY }] }}
      >
        <TouchableWithoutFeedback onPress={(e) => {
          const { locationX } = e.nativeEvent;
          if (locationX < width / 2) {
            handlePrevStory();
          } else {
            handleNextStory();
          }
        }}>
          <View style={{ flex: 1 }}>
            {story.tipo_midia === 'video' ? (
              <View style={{ flex: 1 }}>
                <Video
                  ref={ref => videoRefs.current[story.id] = ref}
                  source={{ uri: story.url }}
                  rate={1.0}
                  volume={1.0}
                  isMuted={false}
                  resizeMode="cover"
                  shouldPlay={isFocused}
                  isLooping={false}
                  style={StyleSheet.absoluteFill}
                  onReadyForDisplay={() => {
                    setIsVideoReady(true);
                    startProgress();
                  }}
                  onError={() => {
                    setIsVideoReady(false);
                    handleNextStory();
                  }}
                  onPlaybackStatusUpdate={(status) => {
                    if (status.didJustFinish) {
                      handleNextStory();
                    }
                  }}
                />
                {!isVideoReady && (
                  <View style={styles.videoLoading}>
                    <ActivityIndicator size="large" color="white" />
                    <Text style={styles.loadingText}>Carregando vídeo...</Text>
                  </View>
                )}
              </View>
            ) : (
              <Image
                source={{ uri: story.url }}
                style={StyleSheet.absoluteFill}
                resizeMode="cover"
                onLoad={() => startProgress()}
                onError={() => handleNextStory()}
              />
            )}

            <LinearGradient
              colors={['rgba(0,0,0,0.7)', 'transparent', 'transparent', 'rgba(0,0,0,0.7)']}
              locations={[0, 0.2, 0.8, 1]}
              style={StyleSheet.absoluteFill}
            >
              <View style={styles.progressContainer}>
                {item.stories.map((s, i) => (
                  <View key={s.id} style={styles.progressBar}>
                    {i < currentStoryIndex && <View style={[styles.progressFill, { width: '100%' }]} />}
                    {i === currentStoryIndex && (
                      <Animated.View
                        style={[
                          styles.progressFill,
                          {
                            width: progressAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: ['0%', '100%']
                            })
                          }
                        ]}
                      />
                    )}
                  </View>
                ))}
              </View>

              <View style={styles.overlay}>
                <View style={styles.contentContainer}>
                  <View style={styles.profileSection}>
                    <Image 
                      style={styles.profileImage} 
                      source={{ uri: item.user.avatar }} 
                      onError={() => item.userImage = 'https://i.pravatar.cc/150'}
                    />
                    <View style={styles.userInfo}>
                      <Text style={styles.userName}>{item.user.name}</Text>
                      <Text style={styles.storyTime}>
                        {new Date(story.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </View>
                  </View>
                  
                  {story.legenda && (
                    <Text style={styles.caption}>{story.legenda}</Text>
                  )}
                </View>
                
                <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.button} onPress={handleLike}>
                        <Ionicons
          name={likesState[currentStory.id] ? 'heart' : 'heart-outline'}
          size={responsiveFontSize(5.5)}
          color={likesState[currentStory.id] ? 'red' : 'white'}
        />
              </TouchableOpacity>

              
                  {userId !== null && Number(item.user.id) === userId && (
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => handleDeleteStory(story.id)}
                    >
                      <Ionicons name="trash-outline" size={responsiveFontSize(5.5)} color="white" />
                    </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity style={styles.button}>
                    <Ionicons name="ellipsis-vertical" size={responsiveFontSize(5.5)} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="white" />
        <Text style={{ color: 'white', marginTop: 10 }}>Carregando stories...</Text>
      </View>
    );
  }

  if (!storiesData || storiesData.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: 'white' }}>Nenhum story disponível</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <FlatList
        ref={flatListRef}
        data={storiesData}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => item?.id?.toString() || `story-${index}`}
        renderItem={renderUserStory}
        initialScrollIndex={currentUserIndex}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          if (index !== currentUserIndex) {
            setCurrentUserIndex(index);
            setCurrentStoryIndex(0);
          }
        }}
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index
        })}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: responsiveWidth(4),
    zIndex: 1
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: responsiveHeight(8)
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(4)
  },
  profileImage: {
    width: responsiveWidth(12),
    height: responsiveWidth(12),
    borderRadius: responsiveWidth(6),
    borderWidth: 2,
    borderColor: '#fff',
    marginRight: responsiveWidth(3)
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  userName: {
    color: 'white',
    fontSize: responsiveFontSize(4.5),
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    marginRight: responsiveWidth(2)
  },
  storyTime: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: responsiveFontSize(3.5),
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3
  },
  caption: {
    color: 'white',
    fontSize: responsiveFontSize(4.2),
    marginBottom: responsiveHeight(3),
    paddingHorizontal: responsiveWidth(4),
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    lineHeight: responsiveHeight(3.5)
  },
  progressContainer: {
    flexDirection: 'row',
    marginTop: responsiveHeight(4),
    marginHorizontal: responsiveWidth(2),
    marginBottom: responsiveHeight(1)
  },
  progressBar: {
    flex: 1,
    height: responsiveHeight(0.4),
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: responsiveWidth(0.5),
    borderRadius: responsiveWidth(0.2)
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: responsiveWidth(0.2)
  },
  actionButtons: {
    position: 'absolute',
    right: responsiveWidth(5),
    bottom: responsiveHeight(6),
    alignItems: 'center',
    gap: responsiveHeight(3)
  },
  button: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    width: responsiveWidth(12),
    height: responsiveWidth(12),
    borderRadius: responsiveWidth(6),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000'
  },
  videoLoading: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)'
  },
  loadingText: {
    color: 'white',
    marginTop: responsiveHeight(2),
    fontSize: responsiveFontSize(4),
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5
  }
});