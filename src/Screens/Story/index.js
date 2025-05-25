import React, {
  useRef, useState, useEffect, useCallback
} from 'react';
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
  PanResponder
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Video } from 'expo-av';

const { height, width } = Dimensions.get('window');

const responsiveFontSize = (percentage) => Math.round((width * percentage) / 100);
const responsiveWidth = (percentage) => width * (percentage / 100);
const responsiveHeight = (percentage) => height * (percentage / 100);

const usersData = [
  {
    id: 'user1',
    userImage: 'https://i.pravatar.cc/150?img=1',
    institutionName: 'Instituição 1',
    stories: [
      { id: '1', videoUrl: 'https://www.w3schools.com/html/movie.mp4', comments: 43 },
      { id: '2', videoUrl: 'https://www.w3schools.com/html/movie.mp4', comments: 12 },
    ]
  },
  {
    id: 'user2',
    userImage: 'https://i.pravatar.cc/150?img=2',
    institutionName: 'Instituição 2',
    stories: [
      { id: '3', videoUrl: 'https://www.w3schools.com/html/movie.mp4', comments: 34 },
      { id: '4', videoUrl: 'https://www.w3schools.com/html/movie.mp4', comments: 34 },
    ]
  }
];

export default function Story() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const videoRefs = useRef({});
  const flatListRef = useRef(null);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const currentUser = usersData[currentUserIndex];
  const currentStory = currentUser?.stories?.[currentStoryIndex];

  const startProgress = useCallback(() => {
    progressAnim.setValue(0);
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) handleNextStory();
    });
  }, [currentUserIndex, currentStoryIndex]);

  const handleNextStory = useCallback(() => {
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
    if (currentUserIndex < usersData.length - 1) {
      setCurrentUserIndex((prev) => prev + 1);
      setCurrentStoryIndex(0);
      flatListRef.current.scrollToIndex({ index: currentUserIndex + 1, animated: true });
    } else {
      navigation.goBack();
    }
  }, [currentUserIndex]);

  const handlePrevUser = useCallback(() => {
    if (currentUserIndex > 0) {
      setCurrentUserIndex((prev) => prev - 1);
      setCurrentStoryIndex(usersData[currentUserIndex - 1].stories.length - 1);
      flatListRef.current.scrollToIndex({ index: currentUserIndex - 1, animated: true });
    }
  }, [currentUserIndex]);

  useEffect(() => {
    if (isFocused && currentStory) {
      videoRefs.current[currentStory.id]?.replayAsync();
      startProgress();
    }
  }, [currentStoryIndex, currentUserIndex, isFocused]);

  // Pan responder para saída vertical
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
            <Video
              ref={(ref) => (videoRefs.current[story.id] = ref)}
              source={{ uri: story.videoUrl }}
              style={StyleSheet.absoluteFill}
              resizeMode="cover"
              shouldPlay={isFocused}
              isLooping={false}
              onPlaybackStatusUpdate={(status) => {
                if (status.didJustFinish) handleNextStory();
              }}
            />

            <LinearGradient
              colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(0,0,0,0.6)']}
              style={StyleSheet.absoluteFill}
            >
              <View style={{ flexDirection: 'row', marginTop: 40, marginHorizontal: 8 }}>
                {item.stories.map((story, i) => (
                  <View key={story.id} style={{ flex: 1, height: 3, backgroundColor: '#555', marginHorizontal: 2 }}>
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
        </TouchableWithoutFeedback>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <FlatList
        ref={flatListRef}
        data={usersData}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={renderUserStory}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          if (index !== currentUserIndex) {
            setCurrentUserIndex(index);
            setCurrentStoryIndex(0);
          }
        }}
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
  }
});
