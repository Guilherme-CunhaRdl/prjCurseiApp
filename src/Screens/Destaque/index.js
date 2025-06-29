import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Image,
    Animated,
    FlatList,
    PanResponder,
} from "react-native";
import { Video } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import host from "../../global";

const { width, height } = Dimensions.get("window");

const VideoDestaque = ({ route, navigation }) => {
    const { idDestaque } = route.params;
    const [destaque, setDestaque] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const progressAnim = useRef(new Animated.Value(0)).current;
    const videoRefs = useRef({});
    const flatListRef = useRef();
    const [likesState, setLikesState] = useState({});
    const [isLikeProcessing, setIsLikeProcessing] = useState(false);

    //VERIFICA SE JA TEM LIKES
    const checkLiked = async (storyId) => {
        try {
            const userId = await AsyncStorage.getItem("idUser");
            const res = await axios.get(
                `http://${host}:8000/api/status/is-liked`,
                {
                    params: {
                        id_user: userId,
                        id_story: storyId,
                    },
                }
            );

            setLikesState((prev) => ({
                ...prev,
                [storyId]: res.data.liked,
            }));
        } catch (err) {
            console.error("Erro ao verificar curtida:", err);
        }
    };

    // Adiciona ou remove like
    const handleLike = async () => {
      // Evita múltiplos cliques rápidos
      if (isLikeProcessing) {
        console.log('Like já em processamento...');
        return;
      }
    
      console.log('Iniciando like...');
      setIsLikeProcessing(true);
      
      const currentStory = destaque.stories[currentStoryIndex];
      if (!currentStory?.id) {
        console.log('ID do story não encontrado');
        setIsLikeProcessing(false);
        return;
      }
    
      console.log(`Like para story ID: ${currentStory.id}`);
      
      // Atualização otimista (feedback visual imediato)
      const previousLikeState = likesState[currentStory.id] || false;
      setLikesState(prev => ({
        ...prev,
        [currentStory.id]: !previousLikeState
      }));
    
      try {
        console.time('API Like Request');
        const userId = await AsyncStorage.getItem('idUser');
        console.log(`User ID: ${userId}`);
    
        const res = await axios.post(`http://${host}:8000/api/status/like`, {
          id_user: userId,
          id_story: currentStory.id
        });
    
        console.timeEnd('API Like Request');
        console.log('Resposta do backend:', res.data);
    
        // Verifica se a resposta do servidor difere da nossa atualização otimista
        if (res.data.liked !== !previousLikeState) {
          console.log('Ajustando estado conforme resposta do servidor');
          setLikesState(prev => ({
            ...prev,
            [currentStory.id]: res.data.liked
          }));
        }
    
      } catch (err) {
        console.error('Erro ao curtir story:', err);
        
        // Reverte para o estado anterior em caso de erro
        setLikesState(prev => ({
          ...prev,
          [currentStory.id]: previousLikeState
        }));
    
        // Mostra feedback visual do erro (opcional)
        Alert.alert(
          'Erro',
          'Não foi possível registrar seu like. Tente novamente.',
          [{ text: 'OK' }]
        );
        
      } finally {
        setIsLikeProcessing(false);
        console.log('Processamento de like concluído');
      }
    };

    // Adicionado para o gesto de fechar
    const pan = useRef(new Animated.ValueXY()).current;
    const panResponder = useRef(null);

    useEffect(() => {
        const fetchDestaque = async () => {
            try {
                const response = await axios.get(
                    `http://${host}:8000/api/destaqueEspecifico/${idDestaque}`
                );
                if (response.data.success) {
                    setDestaque(response.data.data);
                }
            } catch (error) {
                console.error("Erro ao buscar destaque:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDestaque();
    }, [idDestaque]);

    // Configurar o PanResponder para detectar gestos de arrastar
    useEffect(() => {
        panResponder.current = PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event([null, { dy: pan.y }], {
                useNativeDriver: false,
            }),
            onPanResponderRelease: (_, gestureState) => {
                // Se o usuário arrastou para baixo mais que 100 pixels
                if (gestureState.dy > 100) {
                    Animated.timing(pan, {
                        toValue: { x: 0, y: height },
                        duration: 300,
                        useNativeDriver: true,
                    }).start(() => navigation.goBack());
                } else {
                    // Voltar para a posição original
                    Animated.spring(pan, {
                        toValue: { x: 0, y: 0 },
                        friction: 5,
                        useNativeDriver: true,
                    }).start();
                }
            },
        });
    }, []);

    useEffect(() => {
        if (destaque && destaque.stories && destaque.stories.length > 0) {
            startProgressAnimation();

            const currentStory = destaque.stories[currentStoryIndex];
            if (currentStory?.id) {
                checkLiked(currentStory.id);
            }
        }
    }, [destaque, currentStoryIndex]);

    const startProgressAnimation = () => {
        progressAnim.setValue(0);
        const story = destaque.stories[currentStoryIndex];
        const duration = story.tipo_midia === "video" ? 10000 : 5000; // 10s para vídeo, 5s para imagem

        Animated.timing(progressAnim, {
            toValue: 1,
            duration,
            useNativeDriver: false,
        }).start(({ finished }) => {
            if (finished) {
                handleNextStory();
            }
        });
    };

    const handleNextStory = () => {
        if (currentStoryIndex < destaque.stories.length - 1) {
            setCurrentStoryIndex(currentStoryIndex + 1);
            flatListRef.current.scrollToIndex({ index: currentStoryIndex + 1 });
        } else {
            navigation.goBack();
        }
    };

    const handlePrevStory = () => {
        if (currentStoryIndex > 0) {
            setCurrentStoryIndex(currentStoryIndex - 1);
            flatListRef.current.scrollToIndex({ index: currentStoryIndex - 1 });
        }
    };

    const togglePause = () => {
        setIsPaused(!isPaused);

        if (destaque.stories[currentStoryIndex].tipo_midia === "video") {
            const videoRef =
                videoRefs.current[destaque.stories[currentStoryIndex].id];
            if (videoRef) {
                isPaused ? videoRef.playAsync() : videoRef.pauseAsync();
            }
        }

        if (!isPaused) {
            progressAnim.stopAnimation();
        } else {
            startProgressAnimation();
        }
    };

    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            const newIndex = viewableItems[0].index;
            setCurrentStoryIndex(newIndex);
        }
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    }).current;

    const renderItem = ({ item, index }) => {
        return (
            <View style={{ width, height }}>
                {item.tipo_midia === "video" ? (
                    <Video
                        ref={(ref) => (videoRefs.current[item.id] = ref)}
                        source={{ uri: item.url_completa }}
                        style={StyleSheet.absoluteFill}
                        resizeMode="cover"
                        shouldPlay={index === currentStoryIndex && !isPaused}
                        isLooping={false}
                        onPlaybackStatusUpdate={(status) => {
                            if (status.didJustFinish) {
                                handleNextStory();
                            }
                        }}
                    />
                ) : (
                    <Image
                        source={{ uri: item.url_completa }}
                        style={StyleSheet.absoluteFill}
                        resizeMode="cover"
                    />
                )}

                <TouchableOpacity
                    style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: width / 3,
                        zIndex: 1 
                    }}
                    onPress={handlePrevStory}
                    activeOpacity={0.9}
                    pointerEvents="box-only"
                />
                <TouchableOpacity
                    style={{
                        position: "absolute",
                        right: 0,
                        top: 0,
                        bottom: 0,
                        width: width / 3,
                        zIndex: 1 
                    }}
                    onPress={handleNextStory}
                    activeOpacity={0.9}
                    pointerEvents="box-only"
                />
                <TouchableOpacity
                    style={{
                        position: "absolute",
                        left: width / 3,
                        top: 0,
                        bottom: 0,
                        width: width / 3,
                        zIndex: 1 
                    }}
                    onPress={togglePause}
                    activeOpacity={0.9}
                    pointerEvents="box-only"
                />
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!destaque) {
        return (
            <View style={styles.container}>
                <Text>Destaque não encontrado</Text>
            </View>
        );
    }

    const currentStory = destaque.stories[currentStoryIndex];
    const user = destaque.stories[0]?.user || {};

    return (
        <Animated.View
            style={[styles.container, { transform: [{ translateY: pan.y }] }]}
            {...panResponder.current.panHandlers}
        >
            <FlatList
                ref={flatListRef}
                data={destaque.stories}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                initialScrollIndex={currentStoryIndex}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                getItemLayout={(data, index) => ({
                    length: width,
                    offset: width * index,
                    index,
                })}
            />

            <LinearGradient
                colors={["rgba(0,0,0,0.6)", "transparent", "rgba(0,0,0,0.6)"]}
                style={StyleSheet.absoluteFill}
                pointerEvents="box-none"
            >
                <View
                    style={{
                        flexDirection: "row",
                        marginTop: 40,
                        marginHorizontal: 8,
                    }}
                >
                    {destaque.stories.map((_, i) => (
                        <View
                            key={i}
                            style={{
                                flex: 1,
                                height: 3,
                                backgroundColor: "#555",
                                marginHorizontal: 2,
                            }}
                        >
                            {i < currentStoryIndex && (
                                <View
                                    style={{
                                        backgroundColor: "#fff",
                                        height: "100%",
                                        width: "100%",
                                    }}
                                />
                            )}
                            {i === currentStoryIndex && (
                                <Animated.View
                                    style={{
                                        backgroundColor: "#fff",
                                        height: "100%",
                                        width: progressAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: ["0%", "100%"],
                                        }),
                                    }}
                                />
                            )}
                        </View>
                    ))}
                </View>

                <View style={styles.overlay}>
                    <View style={styles.profileSection}>
                        <Image
                            style={styles.profileImage}
                            source={{
                                uri: user.foto || "https://i.pravatar.cc/150",
                            }}
                        />
                        <Text style={styles.userName}>
                            {user.nome || "Usuário"}
                        </Text>
                        <Text style={styles.storyTime}>
                            {new Date(
                                currentStory.data_inicio
                            ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </Text>
                    </View>

                    {currentStory.legenda && (
                        <Text style={styles.caption}>
                            {currentStory.legenda}
                        </Text>
                    )}
                </View>

                <View style={styles.actionButtons}>
                    <View style={{ flexDirection: "row", marginBottom: 20 }}>
                   <TouchableOpacity 
  style={styles.button} 
  onPress={handleLike}
  disabled={isLikeProcessing}
  activeOpacity={0.7}
>
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Ionicons
      name={likesState[currentStory?.id] ? 'heart' : 'heart-outline'}
      size={25}
      color={likesState[currentStory?.id] ? 'red' : 'white'}
    />
    {isLikeProcessing && (
      <ActivityIndicator 
        size="small" 
        color="white" 
        style={{ marginLeft: 5 }} 
      />
    )}
  </View>
</TouchableOpacity>
                    </View>
                </View>
            </LinearGradient>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    overlay: {
        position: "absolute",
        top: 60,
        left: 20,
        right: 20,
    },
    profileSection: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 1,
        borderColor: "#3897f0",
    },
    userName: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
    storyTime: {
        color: "rgba(255,255,255,0.7)",
        marginLeft: 10,
        fontSize: 14,
    },
    caption: {
        color: "white",
        fontSize: 16,
        marginBottom: 20,
        backgroundColor: "rgba(0,0,0,0.3)",
        padding: 10,
        borderRadius: 10,
    },
    actionButtons: {
        position: "absolute",
        bottom: 40,
        right: 20,
        alignItems: "flex-end",
        zIndex: 9999, // força ficar na frente
        elevation: 9999, // Android
    },
    button: {
        marginVertical: 10,
        padding: 5,
    },
});

export default VideoDestaque;
