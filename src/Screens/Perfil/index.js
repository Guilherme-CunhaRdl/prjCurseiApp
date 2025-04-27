import { SafeAreaView, View, Text, ScrollView, TouchableOpacity, Image, StatusBar, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './styles';
import { FlatList } from 'react-native-web';
import Post from "../../Components/Post";
import blackStory from '../../../assets/blackStory.png'
import React, { useState,useEffect } from 'react';
import axios from "axios";

const DATA = [
    {
        id: Math.random().toString(36).substring(2, 27),
        photoURL: blackStory,
        nome: ''
    },
    {
        id: Math.random().toString(36).substring(2, 27),
        photoURL: blackStory,
        nome: ''
    },
    {
        id: Math.random().toString(36).substring(2, 27),
        photoURL: blackStory,
        nome: ''
    },
    {
        id: Math.random().toString(36).substring(2, 27),
        photoURL: blackStory,
        nome: ''
    },
    {
        id: Math.random().toString(36).substring(2, 27),
        photoURL: blackStory,
        nome: ''
    },
]
export default function Perfil() {

    const [banner, setBanner] = useState('');
    const [userImg, setUserImg] = useState('');
    const [nome, setNome] = useState('');
    const [user, setUser] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [bio, setBio] = useState('');
    async function selectPerfil() {
        const resultados = await axios.get('http://localhost:8000/api/cursei/user/1');
        const data = resultados.data[0];
        console.log("22222",data)
        setNome(data.nome_user);
        setUser(data.arroba_user);
        setEmail(data.email_user);
        setSenha(data.senha_user);
        setBio(data.bio_user);
        setUserImg(data.img_user);
        setBanner(data.banner_user);
    }
    console.log("aa");
   useEffect(() => {
     selectPerfil();
   }, []);
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.containerCont}>
                {/*Container da Imagem de Fundo do Header */}
                <View style={styles.header}>
                    <Image
                        style={styles.banner}
                        source={{ uri: `http://localhost:8000/img/user/bannerPerfil/${banner}`}}
                    />
                </View>
                {/*Container do Perfil */}
                <View style={styles.perfilContainer}>
                    <View style={styles.itensContainer}>
                        <View style={styles.imgContainer}>
                            <Image
                                style={styles.userImg}
                                source={{ uri: `http://localhost:8000/img/user/fotoPerfil/${userImg}` }}
                            />
                        </View>

                        {/*Container do Informações do Usúario */}
                        <View style={styles.infoContainer}>
                            <View style={styles.infoUser}>
                                <View style={styles.userContainer}>
                                    <Text style={styles.nomeUser}>{nome}</Text>
                                </View>

                                <View>
                                    <Text style={styles.arrobaUser}>@{user}</Text>
                                </View>

                                <View>
                                    <Text style={styles.bioUser}>{bio}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/*Container Seguidores */}
                <View style={styles.seguidorContainer}>

                    <View style={styles.seguidores}>
                        <Text style={styles.numSeg}>60</Text>
                        <Text style={styles.textSeguidores}>Seguidores</Text>
                    </View>

                    <View style={styles.seguindo}>
                        <Text style={styles.numSeg}>43</Text>
                        <Text style={styles.textSeguindo}>Seguindo</Text>
                    </View>
                </View>


                <View style={styles.editarContainer}>
                    <View style={styles.buttonContainer}>
                        <Pressable style={styles.editarButton}>
                            <Text style={styles.editButton}>Editar Perfil</Text>
                        </Pressable>
                    </View>

                    <View style={styles.seguindo}>
                        <Ionicons style={styles.settingIcon} name="settings-outline"></Ionicons>
                    </View>
                </View>

                {/*View Storys*/}
                <View style={styles.storysContainer}>
                    <FlatList
                        horizontal={true}
                        data={DATA}
                        keyExtractor={item => item.id}
                        renderItem={item => (
                            <View style={styles.storys}>
                                <Pressable style={styles.circuloStorys}>
                                    <Image
                                        style={styles.imgLogo}
                                        source={item.item.photoURL}
                                    />
                                </Pressable>

                                <View style={styles.nomeStorys}>
                                    <Text style={styles.textStorys}>{item.item.nome}</Text>
                                </View>
                            </View>
                        )}
                    />
                </View>

                {/*Barra de Navegação*/}
                <View style={styles.barraContainer}>
                    <View style={styles.opcao}>
                        <Ionicons style={styles.opcaoIcon} name="grid-outline"></Ionicons>
                    </View>

                    <View style={styles.opcao}>
                        <Ionicons style={styles.opcaoIcon} name="image-outline"></Ionicons>
                    </View>

                    <View style={styles.opcao}>
                        <Ionicons style={styles.opcaoIcon} name="repeat-outline"></Ionicons>
                    </View>

                    <View style={styles.opcao}>
                        <Ionicons style={styles.opcaoIcon} name="id-card-outline"></Ionicons>
                    </View>
                </View>
                {/*Posts*/}
                <View style={styles.postContainer}>
                    <Post />
                </View>




            </ScrollView>
        </SafeAreaView>
    )
};