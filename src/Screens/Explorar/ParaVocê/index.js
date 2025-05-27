import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity, Pressable, Image } from 'react-native';
import styles from './styles';
import User from '../../../../assets/userIMG.png';
import Configuracoes from '../../../Components/Configurações/configuracoes';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import Post from '../../../Components/Post';
import host from '../../../global';
import { SafeAreaView } from 'react-native-safe-area-context';




export default function ParaVoce() {
    const navigation = useNavigation();
    const [usuarios, setUsuarios] = useState()
    const [segue_usuario, Setsegue_usuario] = useState(false)
    const [hashtags, setHashtags] = useState()


    async function recomendarUsuarios() {
        const idUserSalvo = await AsyncStorage.getItem('idUser');
        const url = `http://${host}:8000/api/cursei/user/sugerirUsuario/${idUserSalvo}/5`;
        const Response = await axios.get(url)
        setUsuarios(Response.data)
    }
    async function recomendarHashtags() {
        const idUserSalvo = await AsyncStorage.getItem('idUser');
        const url = `http://${host}:8000/api/cursei/explorar/recomendarHashtags/${idUserSalvo}`;
        const Response = await axios.get(url)
        setHashtags(Response.data)
    }
    async function seguir(id) {

        const idUserSalvo = await AsyncStorage.getItem('idUser');
        if (!idUserSalvo) {
            navigation.navigate('Login')
        }

        const url = `http://${host}:8000/api/posts/interacoes/seguir`;
        const seguidor = new FormData();
        seguidor.append('idUser', idUserSalvo)
        seguidor.append('userPost', id)

        try {
            const result = await axios.post(url, seguidor, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })


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
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        recomendarUsuarios();
        recomendarHashtags();
    }, []);
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false} >

                {/* Tendências */}
                <View style={styles.containerTredings}>
                    <View style={styles.containerTitle}>
                        <Text style={styles.title}>Assuntos para você</Text>
                    </View>

                    {hashtags?.map(item => (
                        <View style={styles.trendigItem} key={item.id}>
                            <Text style={styles.subTitle}>Para você</Text>
                            <Pressable onPress={() => navigation.navigate('Pesquisar', { termoPesquisado: item.nomeHashtag })}>

                                <View style={styles.trendigRow}>
                                    <Text style={styles.trendigName}>{item.nomeHashtag}</Text>
                                    <View style={{ height: 20, alignItems: 'center', justifyContent: 'center' }}>
                                        <Configuracoes />
                                    </View>
                                </View>
                            </Pressable>

                        </View>
                    ))}
                </View>

                {/* Sugestão de usuários */}
                <View style={styles.sugestao}>
                    <View style={styles.containerTitle}>
                        <Text style={styles.title}>Quem seguir</Text>
                    </View>

                    {usuarios?.map(item => (
                        <View style={styles.userContainer} key={item.id}>
                            <Pressable
                                style={styles.userImgContainer}
                                onPress={() => navigation.navigate('Perfil', { idUserPerfil: item.id, titulo: item.arroba_user })}
                            >
                                <Image
                                    source={{ uri: `http://${host}:8000/img/user/fotoPerfil/${item.img_user}` }}
                                    style={styles.imgLogo}
                                />
                            </Pressable>

                            <Pressable
                                style={styles.containerNomeUser}
                                onPress={() => navigation.navigate('Perfil', { idUserPerfil: item.id, titulo: item.arroba_user })}
                            >
                                <Text style={styles.nomeUser}>{item.nome_user}</Text>
                                <Text style={styles.arrobaUser}>@{item.arroba_user}</Text>
                            </Pressable>

                            <View style={styles.buttonFollowContainer}>
                                <Pressable
                                    style={item.seguido ? styles.buttonFollowActive : styles.buttonFollow}
                                    onPress={() => seguir(item.id)}
                                >
                                    <Text style={item.seguido ? styles.titleButtonActive : styles.titleButton}>
                                        {item.seguido ? 'Seguido' : 'Seguir'}
                                    </Text>
                                </Pressable>
                            </View>
                        </View>
                    ))}

                   
                </View>

                {/* Posts */}
                <View style={styles.containerPost}>
                    <View style={styles.containerTitlePost}>
                        <Text style={styles.title}>Postagens para você</Text>
                    </View>

                    <Post tipo="maisCurtidos" />
                </View>

            </ScrollView>
        </View>
    );
};
