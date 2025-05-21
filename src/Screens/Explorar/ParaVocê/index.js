import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, ScrollView, FlatList, TouchableOpacity, Pressable, Image } from 'react-native';
import styles from './styles';
import User from '../../../../assets/userIMG.png';
import Configuracoes from '../../../Components/Configurações/configuracoes';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const DATA = [
    { id: '1', trendig: "#CURSEINOTA10", numPosts: "100k posts" },
    { id: '2', trendig: "#TONACURSEI", numPosts: "200k posts" },
    { id: '3', trendig: "#CURSODEQUALIDADE", numPosts: "100k posts" },
    { id: '4', trendig: "#CURSODEQUALIDADE", numPosts: "100k posts" },
];



export default function ParaVoce() {
    const [usuarios, setUsuarios] = useState()
    const [segue_usuario, Setsegue_usuario] = useState(false)


    async function recomendarUsuarios() {
        const idUserSalvo = await AsyncStorage.getItem('idUser');
        const url = `http://localhost:8000/api/cursei/user/sugerirUsuario/${idUserSalvo}/5`;
        Response = await axios.get(url)
        setUsuarios(Response.data)
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
    }, []);
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.ScrollCont}>
                <View style={styles.contentContainer}>

                    {/* Tendências */}
                    <View style={styles.containerTredings}>
                        <View style={styles.containerTitle}>
                            <Text style={styles.title}>O que está acontecendo</Text>
                        </View>

                        <FlatList
                            data={DATA}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => (
                                <View style={styles.trendigItem}>
                                    <Text style={styles.subTitle}>Tendência no Cursei</Text>

                                    <View style={styles.trendigRow}>
                                        <Text style={styles.trendigName}>{item.trendig}</Text>
                                        <View style={{ height: 20, alignItems: 'center', justifyContent: 'center' }}>
                                            <Configuracoes />
                                        </View>
                                    </View>

                                    <Text style={styles.trendigNum}>{item.numPosts}</Text>
                                </View>
                            )}
                        />

                        <View style={styles.containerMS}>
                            <Text style={styles.titleMS}>Mostrar Mais</Text>
                        </View>
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
                                    <View style={styles.userImgContainer}>
                                        <Image source={{ uri: `http://localhost:8000/img/user/fotoPerfil/${item.img_user}` }} style={styles.imgLogo} />
                                    </View>

                                    <View style={styles.containerNomeUser}>
                                        <Text style={styles.nomeUser}>{item.nome_user}</Text>
                                        <Text style={styles.arrobaUser}>@{item.arroba_user}</Text>
                                    </View>

                                    <View style={styles.buttonFollowContainer}>
                                        <Pressable
                                            style={item.seguido ? styles.buttonFollowActive : styles.buttonFollow}
                                            onPress={() => seguir(item.id)}
                                        >
                                            <Text style={item.seguido ? styles.titleButtonActive:styles.titleButton}>{item.seguido ?('Seguido'):'Seguir'}</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            )}
                        />

                        <View style={styles.containerMS}>
                            <Text style={styles.titleMS}>Mostrar Mais</Text>
                        </View>
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
};
