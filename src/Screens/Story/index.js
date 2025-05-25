import React, { useRef, useState, useEffect, useCallback } from 'react';
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
  Animated,
  PanResponder,
  Pressable
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Video } from 'expo-av';

const { height, width } = Dimensions.get('window');
const ITEM_WIDTH = width;

const responsiveFontSize = (percentage) => Math.round((width * percentage) / 100);
const responsiveWidth = (percentage) => width * (percentage / 100);
const responsiveHeight = (percentage) => height * (percentage / 100);

const usersData = [
  {
    id: 'user1',
    userImage: 'https://akamai.sscdn.co/uploadfile/letras/fotos/c/a/5/2/ca52b9aff9234ab34a4f36fa8acdf91f.jpg',
    institutionName: 'Instituição 1',
    stories: [
      {
        id: '1',
        videoUrl: 'https://www.w3schools.com/html/movie.mp4',
        comments: 43
      },
      {
        id: '2',
        videoUrl: 'https://www.w3schools.com/html/movie.mp4',
        comments: 12
      }
    ]
  },
  {
    id: 'user2',
    userImage: 'https://akamai.sscdn.co/uploadfile/letras/fotos/c/a/5/2/ca52b9aff9234ab34a4f36fa8acdf91f.jpg',
    institutionName: 'Instituição 2',
    stories: [
      {
        id: '3',
        videoUrl: 'https://www.w3schools.com/html/movie.mp4',
        comments: 34
      },
      {
        id: '4',
        videoUrl: 'https://www.w3schools.com/html/movie.mp4',
        comments: 34
      },
      {
        id: '5',
        videoUrl: 'https://www.w3schools.com/html/movie.mp4',
        comments: 34
      },
      {
        id: '6',
        videoUrl: 'https://www.w3schools.com/html/movie.mp4',
        comments: 34
      },
      {
        id: '7',
        videoUrl: 'https://www.w3schools.com/html/movie.mp4',
        comments: 34
      },
      {
        id: '8',
        videoUrl: 'https://www.w3schools.com/html/movie.mp4',
        comments: 34
      }
    ]
  }
];

export default function Story() {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const videoRefs = useRef([]);
  const flatListRef = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentUser, setCurrentUser] = useState('');
  const [viewedStories, setViewedStories] = useState(new Set());
  const [progress, setProgress] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const storiesData = usersData.flatMap(user =>
    user.stories.map((story, index) => ({
      ...story,
      userId: user.id,
      userImage: user.userImage,
      institutionName: user.institutionName,
      totalStories: user.stories.length,
      storyIndex: index
    }))
  );

  const handleNext = useCallback(() => {
    if (currentIndex < storiesData.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
    } else {
      navigation.goBack();
    }
  }, [currentIndex]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
    }
  }, [currentIndex]);

  const handlePress = (evt) => {
    const x = evt.nativeEvent.locationX;
    const screenThird = width / 3;

    if (x < screenThird) {
      handlePrev();
    } else if (x > screenThird * 2) {
      handleNext();
    }
  };

  useEffect(() => {
    const story = storiesData[currentIndex];
    if (story.userId !== currentUser) {
      setCurrentUser(story.userId);
      setProgress(0);
      progressAnim.setValue(0);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (isFocused) {
      videoRefs.current[currentIndex]?.playAsync();
      setViewedStories(prev => {
        const newSet = new Set(prev);
        newSet.add(storiesData[currentIndex].id);
        return newSet;
      });
    }
    return () => {
      progressAnim.setValue(0);
    };
  }, [currentIndex, isFocused]);

  useEffect(() => {
    if (!isFocused) {
      videoRefs.current.forEach(ref => ref?.pauseAsync());
    }
  }, [isFocused]);

  const renderItem = ({ item, index }) => {
    const userStories = storiesData.filter(s => s.userId === item.userId);
    const currentStoryIndex = userStories.findIndex(s => s.id === item.id);

    return (
      <View style={{ width: ITEM_WIDTH, height }}>
        <Video
          ref={(ref) => (videoRefs.current[index] = ref)}
          source={{ uri: item.videoUrl }}
          style={{ width: '100%', height: '100%', position: 'absolute' }}
          resizeMode="cover"
          isLooping={false}
          isMuted={false}
          shouldPlay={index === currentIndex}
          onPlaybackStatusUpdate={(status) => {
            if (status.isLoaded && status.durationMillis) {
              const progressValue = status.positionMillis / status.durationMillis;
              setProgress(progressValue);
              progressAnim.setValue(progressValue);
              if (status.didJustFinish) {
                handleNext();
              }
            }
          }}
        />

        <LinearGradient
          colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(0,0,0,0.6)']}
          style={{ ...StyleSheet.absoluteFillObject }}
        >
          <View style={{ flexDirection: 'row', marginTop: 40, marginHorizontal: 8 }}>
            {userStories.map((story, i) => {
              const isCurrent = story.id === item.id;
              const isPast = i < currentStoryIndex;
              return (
                <View key={story.id} style={{ flex: 1, height: 3, backgroundColor: '#555', marginHorizontal: 2 }}>
                  {isPast && <View style={{ backgroundColor: '#fff', height: '100%', width: '100%' }} />}
                  {isCurrent && (
                    <Animated.View
                      style={{
                        backgroundColor: '#fff',
                        height: '100%',
                        width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] })
                      }}
                    />
                  )}
                </View>
              );
            })}
          </View>
          <View style={styles.overlay}>
            <View style={styles.contentContainer}>
              <View style={styles.profileSection}>
                <Image style={styles.profileImage} source={{ uri: item.userImage }} />
                <Text style={styles.institutionName}>{item.institutionName}</Text>
              </View>
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
    );
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10 || Math.abs(gestureState.dy) > 10;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (Math.abs(gestureState.dy) > 100) {
          navigation.goBack();
        } else if (gestureState.dx > 50) {
          handlePrev();
        } else if (gestureState.dx < -50) {
          handleNext();
        }
      },
    })
  ).current;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }} {...panResponder.panHandlers}>
      <Pressable onPress={handlePress} style={{ flex: 1 }}>
        <FlatList
          ref={flatListRef}
          data={storiesData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          scrollEnabled={false}
          initialScrollIndex={currentIndex}
          getItemLayout={(data, index) => ({ length: ITEM_WIDTH, offset: ITEM_WIDTH * index, index })}
        />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  videoContainer: { width: ITEM_WIDTH, height, backgroundColor: 'black' },
  video: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: responsiveWidth(4)
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 10,
    paddingTop: 10
  },
  progressBar: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
    position: 'relative'
  },
  filledProgressBar: {
    height: '100%',
    backgroundColor: 'white',
    position: 'absolute'
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: responsiveHeight(0)
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveWidth(2),
    marginBottom: responsiveHeight(2)
  },
  profileImage: {
    width: responsiveWidth(12),
    height: responsiveWidth(12),
    borderRadius: responsiveWidth(6)
  },
  institutionName: {
    color: 'white',
    fontSize: responsiveFontSize(4),
    fontWeight: '500'
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
  buttonText: {
    color: 'white',
    fontSize: responsiveFontSize(3),
    marginTop: responsiveHeight(0.5)
  },
  fullScreen: {
    flex: 1
  }
});
