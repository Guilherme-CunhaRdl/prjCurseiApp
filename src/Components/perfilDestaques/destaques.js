import { View, Text, Image, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import { FlatList } from 'react-native';
import host from '../../global';
import { SafeAreaView } from 'react-native-safe-area-context';
import adicionarLogo from "../../../assets/adicionarLogo.png";
import PropTypes from 'prop-types';

const Destaques = ({ data, navigation, adicionarLogo }) => {
    const route = useRoute();
    const rotavalores = route.params;
    const [userImg, setUserImg] = useState('');
    const [nome, setNome] = useState('');
    const [user, setUser] = useState('');
    const [instituicao, setInstituicao] = useState('');
    const [idUser, setIdUser] = useState();
    const [loading, setLoading] = useState(true);
    const [perfilProprio, setPerfilProprio] = useState(false);
    const [perfilBloqueado, setPerfilBloqueado] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    async function carregarPerfil() {
        const idUserSalvo = await AsyncStorage.getItem('idUser');
        const idPerfil = rotavalores ? rotavalores.idUserPerfil : idUserSalvo;

        try {
            setIdUser(idPerfil);
            const resultados = await axios.get(`http://${host}:8000/api/cursei/user/${idPerfil}/${idUserSalvo}`);
            const data = resultados.data;
            setNome(data.User.nome_user);
            setUser(data.User.arroba_user);
            setUserImg(data.User.img_user);
            setInstituicao(data.User.instituicao);
            setPerfilBloqueado(data.User.bloqueando);

            if (idUserSalvo == idPerfil) {
                setPerfilProprio(true);
            }
        } catch (error) {
            console.error('Erro ao buscar perfil:', error);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 1500);
        }
    }

    useEffect(() => {
        carregarPerfil();
    }, []);

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </SafeAreaView>
        );
    }

    return (
        <View style={styles.storysContainer}>
            <FlatList
                horizontal
                data={data}
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
                ListHeaderComponent={
                    perfilProprio ? (
                        <View style={styles.storys}>
                            <Pressable
                                style={styles.circuloStorys}
                                onPress={() => navigation.navigate('CriarDestaques')}
                            >
                                <Image style={styles.imgLogo} source={adicionarLogo} />
                            </Pressable>
                        </View>
                    ) : null
                }
                renderItem={({ item }) => (
                    <View style={styles.storys}>
                        <Pressable style={styles.circuloStorys} onPress={() => navigation.navigate('Destaques')}>
                            <View style={styles.imgLogo}>
                                <Image
                                    style={styles.storyImage}
                                    source={item.photoURL}
                                />
                            </View>
                        </Pressable>
                        <View style={styles.nomeStorys}>
                            <Text style={styles.textStorys}>{item.nome}</Text>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    storysContainer: {
        flexDirection: 'row',
        gap: 10,
        paddingHorizontal: 16,
    },
    storys: {
        alignItems: 'center',
    },
    circuloStorys: {
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#E3E3E3',
        borderRadius: 60,
        height: 60,
        width: 60,
        marginLeft: 5,
        marginRight: 5,
        borderWidth: 2,
    },
    imgLogo: {
        width: '90%',
        height: '90%',
        resizeMode: 'contain',
        borderRadius: 40,
    },
    storyImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
        borderRadius: 100
    },
    nomeStorys: {
        marginTop: 4,
    },
    textStorys: {
        fontSize: 12,
    },
});

Destaques.propTypes = {
    data: PropTypes.array.isRequired,
    navigation: PropTypes.object.isRequired,
};

export default Destaques;