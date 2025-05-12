import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles';

export default function Curseels() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerHeader}>
        <TouchableOpacity>
          <Ionicons name={'arrow-back'} size={30} color={'black'} />
        </TouchableOpacity>
        <Text style={styles.tituloHeader}>Curtei</Text>
        <TouchableOpacity>
          <Ionicons name={'camera-outline'} size={30} color={'black'} />
        </TouchableOpacity>
      </View>

      <View style={styles.conteudoStory}>
        <Image
          source={{ uri: 'https://media.tenor.com/e7J9vOf6tHwAAAAM/davy-jones-gameplayrj.gif' }}
          style={styles.imagemStory}
          resizeMode="cover"
        />
        
        <LinearGradient
          colors={['transparent', 'rgba(0, 0, 0, 0.7)']}
          style={styles.overlayContainer}
        >
          <View style={styles.containerComentario}>
            <View style={styles.containerInfoStory}>
              <View style={styles.containerInfoPerfil}>
                <TouchableOpacity>
                  <View style={styles.containerImgPerfil}>
                    <Image
                      style={styles.imgPerfil}
                      source={{ uri: 'https://akamai.sscdn.co/uploadfile/letras/fotos/c/a/5/2/ca52b9aff9234ab34a4f36fa8acdf91f.jpg' }}
                    />
                  </View>
                </TouchableOpacity>
                <Text style={{ color: 'white' }}>Nome da instituição</Text>
              </View>
              <View style={styles.containerDescPost}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.descricaoTexto}
                >
                  Texto de descrição que eles quiserem colocar aqui, bla bla bla
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.containerBotoesFlutuantes}>
            <View style={{ alignItems: 'center' }}>
              <TouchableOpacity style={styles.botaoAcao}>
                <Ionicons name="heart-outline" size={28} color="white" />
                <Text style={styles.textoAcao}>21</Text>
              </TouchableOpacity>
            </View>
            <View style={{ alignItems: 'center' }}>
              <TouchableOpacity style={styles.botaoAcao}>
                <Ionicons name="chatbubble-outline" size={28} color="white" />
                <Text style={styles.textoAcao}>43</Text>
              </TouchableOpacity>
            </View>
            <View style={{ alignItems: 'center' }}>
              <TouchableOpacity style={styles.botaoAcao}>
                <Ionicons name="paper-plane-outline" size={28} color="white" />
              </TouchableOpacity>
            </View>
            <View style={{ alignItems: 'center' }}>
              <TouchableOpacity style={styles.botaoAcao}>
                <Ionicons name="ellipsis-vertical" size={28} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
};