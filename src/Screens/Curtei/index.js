import React, { useRef, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Video } from 'expo-av';
import { useIsFocused } from '@react-navigation/native';
import { useEffect } from 'react';


const { height, width } = Dimensions.get('window');
const ITEM_HEIGHT = height;
const SNAP_INTERVAL = ITEM_HEIGHT;

// Cálculos responsivos
const responsiveFontSize = (percentage) => Math.round((width * percentage) / 100);
const responsiveWidth = (percentage) => width * (percentage / 100);
const responsiveHeight = (percentage) => height * (percentage / 100);

const storiesData = [
  {
    id: '1',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    userImage: 'https://akamai.sscdn.co/uploadfile/letras/fotos/c/a/5/2/ca52b9aff9234ab34a4f36fa8acdf91f.jpg',
    institutionName: 'Instituição 1',
    description: 'Texto de descrição que eles quiserem colocar aqui, bla bla bla',
    likes: 21,
    comments: 43
  },
  {
    id: '2',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    userImage: 'https://akamai.sscdn.co/uploadfile/letras/fotos/c/a/5/2/ca52b9aff9234ab34a4f36fa8acdf91f.jpg',
    institutionName: 'Instituição 2',
    description: 'Outra descrição interessante para o segundo vídeo',
    likes: 56,
    comments: 12
  },
  {
    id: '3',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    userImage: 'https://akamai.sscdn.co/uploadfile/letras/fotos/c/a/5/2/ca52b9aff9234ab34a4f36fa8acdf91f.jpg',
    institutionName: 'Instituição 3',
    description: 'Terceiro item de teste com o mesmo GIF',
    likes: 78,
    comments: 34
  },
];

export default function Curtei() {
<<<<<<< HEAD
  const navigation = useNavigation();
=======
>>>>>>> 12868cfa47d814c9527671931a3d7983b41dbed2
  const isFocused = useIsFocused();
  const videoRefs = useRef([]);
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScrollEnd = (e) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    const maxOffset = (storiesData.length - 1) * ITEM_HEIGHT;
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
    const maxOffset = (storiesData.length - 1) * ITEM_HEIGHT;

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
              source={{ uri: item.userImage }}
            />
            <Text style={styles.institutionName}>{item.institutionName}</Text>
          </View>

          <Text style={styles.description} numberOfLines={1} ellipsizeMode="tail">
            {item.description}
          </Text>
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
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={storiesData}
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
    bottom: responsiveHeight(4),
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
});