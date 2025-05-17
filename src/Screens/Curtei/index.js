import React, { useRef, useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Image, FlatList, StyleSheet, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { height } = Dimensions.get('window');
const ITEM_HEIGHT = height; // Altura total da tela para cada item
const SNAP_INTERVAL = ITEM_HEIGHT; // Intervalo de snap igual à altura do item

const storiesData = [
  {
    id: '1',
    userImage: 'https://akamai.sscdn.co/uploadfile/letras/fotos/c/a/5/2/ca52b9aff9234ab34a4f36fa8acdf91f.jpg',
    institutionName: 'Instituição 1',
    description: 'Texto de descrição que eles quiserem colocar aqui, bla bla bla',
    likes: 21,
    comments: 43
  },
  {
    id: '2',
    userImage: 'https://akamai.sscdn.co/uploadfile/letras/fotos/c/a/5/2/ca52b9aff9234ab34a4f36fa8acdf91f.jpg',
    institutionName: 'Instituição 2',
    description: 'Outra descrição interessante para o segundo vídeo',
    likes: 56,
    comments: 12
  },
  {
    id: '3',
    userImage: 'https://akamai.sscdn.co/uploadfile/letras/fotos/c/a/5/2/ca52b9aff9234ab34a4f36fa8acdf91f.jpg',
    institutionName: 'Instituição 3',
    description: 'Terceiro item de teste com o mesmo GIF',
    likes: 78,
    comments: 34
  },
];

export default function Curtei() {
    const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 90, // Aumentamos o threshold para garantir que o item está quase totalmente visível
  };

  // Função para garantir que o scroll sempre pare em um item completo
  const handleScrollEnd = (e) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    
    // Se não estiver alinhado corretamente, ajustamos
    if (offsetY % ITEM_HEIGHT !== 0) {
      flatListRef.current?.scrollToIndex({
        index,
        animated: true,
      });
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.videoContainer}>
      <Image
        source={{ uri: 'https://media.tenor.com/e7J9vOf6tHwAAAAM/davy-jones-gameplayrj.gif' }}
        style={styles.video}
        resizeMode="cover"
      />

      <LinearGradient
        colors={['transparent', 'rgba(0, 0, 0, 0.7)']}
        style={styles.overlayContainer}
      >
        <View style={styles.containerInfoStory}>
          <View style={styles.containerInfoPerfil}>
            <TouchableOpacity>
              <View style={styles.containerImgPerfil}>
                <Image
                  style={styles.imgPerfil}
                  source={{ uri: item.userImage }}
                />
              </View>
            </TouchableOpacity>
            <Text style={styles.institutionName}>{item.institutionName}</Text>
          </View>
          <View style={styles.containerDescPost}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.descricaoTexto}
            >
              {item.description}
            </Text>
          </View>
        </View>

        <View style={styles.containerBotoesFlutuantes}>
          <TouchableOpacity style={styles.botaoAcao}>
            <Ionicons name="heart-outline" size={28} color="white" />
            <Text style={styles.textoAcao}>{item.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.botaoAcao}>
            <Ionicons name="chatbubble-outline" size={28} color="white" />
            <Text style={styles.textoAcao}>{item.comments}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.botaoAcao}>
            <Ionicons name="paper-plane-outline" size={28} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.botaoAcao}>
            <Ionicons name="ellipsis-vertical" size={28} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerHeader}>
        <TouchableOpacity  onPress={() => navigation.goBack()}>
          <Ionicons name={'arrow-back'} size={30} color={'white'} />
        </TouchableOpacity>
        <Text style={styles.tituloHeader}>Curtei</Text>
        <TouchableOpacity  onPress={() => navigation.navigate('CriarCurteis')}>
          <Ionicons name={'camera-outline'} size={30} color={'white'} />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={storiesData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        pagingEnabled
        snapToInterval={SNAP_INTERVAL}
        snapToAlignment="start"
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onMomentumScrollEnd={handleScrollEnd} // Adicionamos o handler para o fim do scroll
        getItemLayout={(data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  containerHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '3%',
    backgroundColor: 'transparent',
  },
  tituloHeader: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600'
  },
  videoContainer: {
    height: ITEM_HEIGHT,
    width: '100%',
    position: 'relative', // Ajuste para garantir que a descrição fique visível acima do tab nav
  },
  video: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlayContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  containerInfoStory: {
    width: '100%',
  },
  containerInfoPerfil: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  institutionName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  containerImgPerfil: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: 'grey',
  },
  imgPerfil: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  containerDescPost: {
    width:'80%',
    marginTop: 8,
    marginBottom: 60, // Espaço extra para a descrição ficar visível acima do tab nav
  },
  descricaoTexto: {
    color: 'white',
    fontSize: 14,
  },
  containerBotoesFlutuantes: {
    position: 'absolute',
    right: 16,
    bottom: 80,
    alignItems: 'center',
    gap: 20,
  },
  botaoAcao: {
    alignItems: 'center',
  },
  textoAcao: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
  },
});