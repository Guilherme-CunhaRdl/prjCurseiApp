import { View, Text, Image, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import { FlatList } from 'react-native';
import host from '../../global';
import { SafeAreaView } from 'react-native-safe-area-context';
import adicionarLogo from "../../../assets/adicionarLogo.png";

const Destaques = ({ navigation, adicionarLogo }) => {
    const route = useRoute();
    const rotavalores = route.params;
    const [idUser, setIdUser] = useState();
    const [loading, setLoading] = useState(true);
    const [perfilProprio, setPerfilProprio] = useState(false);
    const [destaques, setDestaques] = useState([]);
    const [error, setError] = useState(null);

    async function carregarPerfil() {
        const idUserSalvo = await AsyncStorage.getItem('idUser');
        const idPerfil = rotavalores ? rotavalores.idUserPerfil : idUserSalvo;

        try {
            setIdUser(idPerfil);
            const resultados = await axios.get(`http://${host}:8000/api/cursei/user/${idPerfil}/${idUserSalvo}`);
            const data = resultados.data;
            
            if (idUserSalvo == idPerfil) {
                setPerfilProprio(true);
            }
        } catch (error) {
            console.error('Erro ao buscar perfil:', error);
        }
    }

    async function carregarDestaques() {
        try {
            if (!idUser) return;
            
            const response = await axios.get(`http://${host}:8000/api/destaques/${idUser}`);
            if (response.data && response.data.success && response.data.data) {
                setDestaques(response.data.data);
            } else {
                setDestaques([]);
            }
            setError(null);
        } catch (error) {
            setError('Falha ao carregar destaques');
            console.error('Erro ao buscar destaques:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            await carregarPerfil();
            await carregarDestaques();
        };
        fetchData();
    }, [idUser]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    const renderItem = ({ item }) => (
        <View style={styles.storys}>
            <Pressable 
                style={styles.circuloStorys} 
                onPress={() => navigation.navigate('videoDestaque', { idDestaque: item.id })}
            >
                <Image
                    style={styles.storyImage}
                    source={{ uri: item.foto_destaque || (item.stories && item.stories[0]?.url_completa) }}
                    onError={(e) => console.log("Erro ao carregar imagem:", e.nativeEvent.error)}
                />
            </Pressable>
            <View style={styles.nomeStorys}>
                <Text style={styles.textStorys} numberOfLines={1}>
                    {item.titulo_destaque}
                </Text>
            </View>
        </View>
    );

    return (
        <View style={styles.storysContainer}>
            <FlatList
                horizontal
                data={destaques}
                keyExtractor={(item) => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                ListHeaderComponent={
                    perfilProprio ? (
                        <View style={styles.storys}>
                            <Pressable
                                style={styles.circuloStorys}
                                onPress={() => navigation.navigate('CriarDestaques')}
                            >
                                <Image style={styles.addImage} source={adicionarLogo} />
                            </Pressable>
                            <View style={styles.nomeStorys}>
                                <Text style={styles.textStorys}>Novo</Text>
                            </View>
                        </View>
                    ) : null
                }
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    storysContainer: {
        flexDirection: 'row',
        paddingVertical: 10,
    },
    listContent: {
        paddingHorizontal: 16,
    },
    storys: {
        alignItems: 'center',
        marginRight: 15,
        width: 60,
    },
    circuloStorys: {
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#E3E3E3',
        borderRadius: 30,
        height: 60,
        width: 60,
        borderWidth: 2,
    },
    storyImage: {
        width: '100%',
        height: '100%',
        borderRadius: 30,
    },
    addImage: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
    nomeStorys: {
        marginTop: 4,
        width: 60,
    },
    textStorys: {
        fontSize: 12,
        textAlign: 'center',
    },
    loadingContainer: {
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
    },
});

export default Destaques;