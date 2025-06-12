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
  ActivityIndicator
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
  const [loading, setLoading] = useState(!routeStoriesData); // Só carrega se não vier dados pela rota
  const [currentUserIndex, setCurrentUserIndex] = useState(initialUserIndex);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  // Referências
  const videoRefs = useRef({});
  const flatListRef = useRef(null);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  // Dados atuais
  const currentUser = storiesData[currentUserIndex];
  const currentStory = currentUser?.stories?.[currentStoryIndex];


  async function carregarStories() {
    try {
      setLoadingStories(true);
      const response = await axios.get(`http://${host}:8000/api/stories`);
      
      const storiesAgrupados = response.data.data.reduce((acc, story) => {
        const userIndex = acc.findIndex(u => u.user.id === story.user.id);
        
        if (userIndex >= 0) {
          acc[userIndex].stories.push({
            id: story.id,
            url: story.url,
            type: story.tipo_midia,
            createdAt: story.data_inicio,
            viewed: false
          });
        } else {
          acc.push({
            user: {
              id: story.user.id,
              name: story.user.nome,

              avatar: story.user.foto || `https://ui-avatars.com/api/?name=${encodeURIComponent(story.user.nome)}&background=random`
            },
            stories: [{
              id: story.id,
              url: story.url,
              type: story.tipo_midia,
              createdAt: story.data_inicio,
              viewed: false
            }]
          });
        }
        return acc;
      }, []);
      
      setStories(storiesAgrupados);
    } catch (error) {
      console.error('Erro ao carregar stories:', error);
    } finally {
      setLoadingStories(false);
    }
  }


  const fetchStories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://${host}:8000/api/stories`);
      const formattedData = formatStoriesData(response.data.data);
      setStoriesData(formattedData);
      
      // Se veio de um story específico, encontrar a posição inicial
      if (initialStory) {
        const userIndex = formattedData.findIndex(user => 
          user.id === initialStory.user.id
        );
        if (userIndex !== -1) {
          setCurrentUserIndex(userIndex);
          const storyIndex = formattedData[userIndex].stories.findIndex(
            s => s.id === initialStory.id
          );
          if (storyIndex !== -1) setCurrentStoryIndex(storyIndex);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar stories:', error);
    } finally {
      setLoading(false);
    }
  };


  

  const formatStoriesData = (stories) => {
    const usersMap = {};
    
    stories.forEach(story => {
      if (!usersMap[story.user.id]) {
        usersMap[story.user.id] = {
          id: story.user.id,
          userImage: story.user.foto ? `http://${host}:8000/img/user/fotoPerfil/${story.user.foto}` : 'https://i.pravatar.cc/150',
          userName: story.user.nome_user || story.user.nome,
          stories: []
        };
      }
      usersMap[story.user.id].stories.push({
        id: story.id,
        url: story.url,
        tipo_midia: story.tipo_midia,
        legenda: story.legenda,
        data_inicio: story.data_inicio,
        comments: 0 
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
      carregarStories();
    }
  }, []);

  useEffect(() => {
    if (isFocused && currentStory) {
      if (currentStory.tipo_midia === 'video') {
        videoRefs.current[currentStory.id]?.replayAsync();
      }
      startProgress();

    }
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
              <Video
                ref={(ref) => (videoRefs.current[story.id] = ref)}
                source={{ uri: story.url }}
                style={StyleSheet.absoluteFill}
                resizeMode="cover"
                shouldPlay={isFocused}
                isLooping={false}
                onPlaybackStatusUpdate={(status) => {
                  if (status.didJustFinish) handleNextStory();
                }}
              />
            ) : (
              <Image
                source={{ uri: story.url }}
                style={StyleSheet.absoluteFill}
                resizeMode="cover"
              />
            )}

            <LinearGradient
              colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(0,0,0,0.6)']}
              style={StyleSheet.absoluteFill}
            >
              <View style={{ flexDirection: 'row', marginTop: 40, marginHorizontal: 8 }}>
                {item.stories.map((s, i) => (
                  <View key={s.id} style={{ flex: 1, height: 3, backgroundColor: '#555', marginHorizontal: 2 }}>
                    {i < currentStoryIndex && <View style={{ backgroundColor: '#fff', height: '100%', width: '100%' }} />}
                    {i === currentStoryIndex && (
                      <Animated.View
                        style={{
                          backgroundColor: '#fff',
                          height: '100%',
                          width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] })
                        }}
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
                    <Text style={styles.userName}> {item.user.name}</Text>
                    <Text style={styles.storyTime}>
                      {new Date(story.data_inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                  
                  {story.legenda && (
                    <Text style={styles.caption}>{story.legenda}</Text>
                  )}
                </View>
                
                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.button}>
                    <Ionicons name="heart-outline" size={responsiveFontSize(6)} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button}>
                    <Ionicons name="paper-plane-outline" size={responsiveFontSize(6)} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button}>
                    <Ionicons name="ellipsis-vertical" size={responsiveFontSize(6)} color="white" />
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
      <View style={[styles.loadingContainer, { backgroundColor: 'black' }]}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  if (!storiesData || storiesData.length === 0) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: 'black' }]}>
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
        keyExtractor={(item) => item.id}
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
    padding: responsiveWidth(4)
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: responsiveHeight(5)
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveWidth(2),
    marginBottom: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(4)
  },
  profileImage: {
    width: responsiveWidth(10),
    height: responsiveWidth(10),
    borderRadius: responsiveWidth(5),
    borderWidth: 2,
    borderColor: '#fff'
  },
  userName: {
    color: 'white',
    fontSize: responsiveFontSize(4),
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3
  },
  storyTime: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: responsiveFontSize(3),
    marginLeft: 'auto'
  },
  caption: {
    color: 'white',
    fontSize: responsiveFontSize(4),
    marginBottom: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(4)
  },
  actionButtons: {
    position: 'absolute',
    right: responsiveWidth(4),
    bottom: responsiveHeight(5),
    alignItems: 'center',
    gap: responsiveHeight(2)
  },
  button: {
    alignItems: 'center',
    marginVertical: responsiveHeight(0.5)
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});