import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, ScrollView, FlatList, TouchableOpacity, Pressable, Image } from 'react-native';
import styles from './styles';
import User from '../../../../assets/userIMG.png';
import Configuracoes from '../../../Components/Configurações/configuracoes';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import Post from '../../../Components/Post';






export default function ParaVoce() {
    const navigation = useNavigation();
    const [usuarios, setUsuarios] = useState()
    const [segue_usuario, Setsegue_usuario] = useState(false)
    const [hashtags, setHashtags] = useState()


    async function recomendarUsuarios() {
        const idUserSalvo = await AsyncStorage.getItem('idUser');
        const url = `http://localhost:8000/api/cursei/user/sugerirUsuario/${idUserSalvo}/5`;
        Response = await axios.get(url)
        setUsuarios(Response.data)
    }
    async function recomendarHashtags() {
        const idUserSalvo = await AsyncStorage.getItem('idUser');
        const url = `http://localhost:8000/api/cursei/explorar/recomendarHashtags/${idUserSalvo}`;
        Response = await axios.get(url)
        setHashtags(Response.data)
    }
    async function seguir(id) {

        const idUserSalvo = await AsyncStorage.getItem('idUser');
        if (!idUserSalvo) {
            navigation.navigate('Login')
        }

        const url = 'http://localhost:8000/api/posts/interacoes/seguir';
        var seguidor = new FormData();
        seguidor.append('idUser', idUserSalvo)
        seguidor.append('userPost', id)
        var result = await axios.post(url, seguidor)



        if (result.data == 'deseguido') {
            Setsegue_usuario(false)
            const novosUsuarios = usuarios.map(user => {
                if (user.id === id) {
                    return { ...user, seguido: false };
                }
                return user;
            });
            setUsuarios(novosUsuarios);
        } else {
            Setsegue_usuario(true)
            const novosUsuarios = usuarios.map(user => {
                if (user.id === id) {
                    return { ...user, seguido: true };
                }
                return user;
            });
            setUsuarios(novosUsuarios);
        }
    }

    useEffect(() => {
        recomendarUsuarios();
        recomendarHashtags();
    }, []);
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.ScrollCont}>
                <View style={styles.contentContainer}>

                    {/* Tendências */}
                    <View style={styles.containerTredings}>
                        <View style={styles.containerTitle}>
                            <Text style={styles.title}>Assuntos para você</Text>
                        </View>

                        <FlatList
                            data={hashtags}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => (
                                <View style={styles.trendigItem}>
                                    <Text style={styles.subTitle}>Para você</Text>

                                    <View style={styles.trendigRow}>
                                        <Text style={styles.trendigName}>{item.nomeHashtag}</Text>
                                        <View style={{ height: 20, alignItems: 'center', justifyContent: 'center' }}>
                                            <Configuracoes />
                                        </View>
                                    </View>

                                </View>
                            )}
                        />


                    </View>

                    {/* Sugestão de usuários */}
                    <View style={styles.sugestao}>
                        <View style={styles.containerTitle}>
                            <Text style={styles.title}>Quem seguir</Text>
                        </View>

                        <FlatList
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

                                        <Image source={{ uri: `http://localhost:8000/img/user/fotoPerfil/${item.img_user}` }} style={styles.imgLogo} />
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
                    </View>


                    <View style={styles.containerPost}>
                        <View style={styles.containerTitlePost}>
                            <Text style={styles.title}>Postagens para você</Text>
                        </View>

                        <Post tipo="maisCurtidos" />


                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};
