import React, { useEffect, useState } from 'react';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Post from "../../../Components/Post";
import { useRoute } from '@react-navigation/native';
import { ScrollView, ActivityIndicator } from 'react-native';
import styles from './styles';
import { View, Text, FlatList, Pressable, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import host from '../../../global';

const Top = createMaterialTopTabNavigator();

const TopTabs = () => {
    const route = useRoute();
    const { termoPesquisado } = route.params || {};
    console.log(termoPesquisado);
    const [loading, setLoading] = useState(false);
    const [usuarios, setUsuarios] = useState()

    async function recomendarUsuarios() {
        const idUserSalvo = await AsyncStorage.getItem('idUser');
        const url = `http://${host}:8000/api/cursei/user/sugerirUsuario/${idUserSalvo}/5`;
        Response = await axios.get(url)
        setUsuarios(Response.data)
    }

    useEffect(() => {
        setLoading(true);
        const idUserSalvo = AsyncStorage.getItem('idUser');
        if (idUserSalvo) {
            recomendarUsuarios()
        }
        setLoading(false);
    }, []);
    return (
        <Top.Navigator>
            <Top.Screen
                name="Em Destaque"
                children={() => <ScrollView style={styles.containerPost}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#000" />
                    ) : (

                        <Post pesquisa={termoPesquisado} />

                    )}
                </ScrollView>}

            />
            <Top.Screen
                name="Usuários"
                children={() => <View style={styles.sugestao}>
                    <View style={styles.containerTitle}>
                        <Text style={styles.title}>Quem seguir</Text>
                    </View>

                    <FlatList
                        nestedScrollEnabled
                        data={usuarios}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.userContainer}>
                                <Pressable style={styles.userImgContainer} onPress={() => {
                                    navigation.navigate('Perfil', {
                                        idUserPerfil: item.id,
                                        titulo: item.arroba_user
                                    });
                                }}>

                                    <Image source={{ uri: `http://${host}:8000/img/user/fotoPerfil/${item.img_user}` }} style={styles.imgLogo} />
                                </Pressable>

                                <Pressable style={styles.containerNomeUser} onPress={() => {
                                    navigation.navigate('Perfil', {
                                        idUserPerfil: item.id,
                                        titulo: item.arroba_user
                                    });
                                }}>
                                    <Text style={styles.nomeUser}>{item.nome_user}</Text>
                                    <Text style={styles.arrobaUser}>@{item.arroba_user}</Text>
                                </Pressable>

                                <View style={styles.buttonFollowContainer}>
                                    <Pressable
                                        style={item.seguido ? styles.buttonFollowActive : styles.buttonFollow}
                                        onPress={() => seguir(item.id)}
                                    >
                                        <Text style={item.seguido ? styles.titleButtonActive : styles.titleButton}>{item.seguido ? ('Seguido') : 'Seguir'}</Text>
                                    </Pressable>
                                </View>
                            </View>
                        )}
                    />

                    <View style={styles.containerMS}>
                        <Text style={styles.titleMS}>Mostrar Mais</Text>
                    </View>
                </View>} />


        </Top.Navigator>
    );
};

export default TopTabs;
