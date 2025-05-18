import { SafeAreaView, View, Text, ScrollView, TouchableOpacity, Image, StatusBar, Pressable, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './styles';
import { FlatList } from 'react-native-web';
import Post from "../../Components/Post";
import blackStory from '../../../assets/blackStory.png'
import React, { useState, useEffect } from 'react';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import Configuracoes from '../../Components/Configurações/configuracoes'
import colors from '../../colors';
import ModalPostagem from "../../Components/ModalPostagem";

const DATA = [
    {
        id: Math.random().toString(36).substring(2, 27),
        photoURL: require('./python.jpg'),
        nome: 'Python'
    },
    {
        id: Math.random().toString(36).substring(2, 27),
        photoURL: require('./viajem.png'),
        nome: 'Viajem'
    },
    {
        id: Math.random().toString(36).substring(2, 27),
        photoURL: require('./html8.jpg'),
        nome: 'HTML'
    },
    {
        id: Math.random().toString(36).substring(2, 27),
        photoURL: require('./helloKitty.png'),
        nome: 'Hello Kitty'
    },

]


export default function Perfil() {
    const route = useRoute();
    const rotavalores = route.params;
    const navigation = useNavigation();
    const [banner, setBanner] = useState('');
    const [userImg, setUserImg] = useState('');
    const [nome, setNome] = useState('');
    const [user, setUser] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [instituicao, setInstituicao] = useState('');
    const [bio, setBio] = useState('');
    const [idUser, setIdUser] = useState();
    const [seguidores, setSeguidores] = useState('')
    const [seguindo, setSeguindo] = useState('')
    const [loading, setLoading] = useState(true);
    const [focoIcone, setFocoIcone] = useState('posts')
    const [perfilProprio, setPerfilProprio] = useState(false)
    const [segue_usuario, Setsegue_usuario] = useState(false)
    const [postsCount, setPostsCount] = useState('')
    const alterarFoco = (icone) => {
        setFocoIcone(icone)
    }

    async function carregarPerfil() {
        const idUserSalvo = await AsyncStorage.getItem('idUser');

        if (rotavalores) {
            var idPerfil = rotavalores.idUserPerfil;
        } else {
            var idPerfil = idUserSalvo
        }
        try {

            setIdUser(idPerfil);
            const resultados = await axios.get(`http://localhost:8000/api/cursei/user/${idPerfil}`);
            var data = resultados.data;

            setNome(data.User.nome_user);
            setUser(data.User.arroba_user);
            setEmail(data.User.email_user);
            setSenha(data.User.senha_user);
            setBio(data.User.bio_user);
            setUserImg(data.User.img_user);
            setBanner(data.User.banner_user);
            setSeguidores(data.User.seguidor_count)
            setSeguindo(data.User.seguindo_count)
            setPostsCount(data.User.posts_count)
            setInstituicao(data.User.instituicao)
            if (idUserSalvo == idPerfil) {
                setPerfilProprio(true);
            }
            var segue = await axios.get(`http://localhost:8000/api/cursei/user/verificarSeSegue/${idUserSalvo}/${idPerfil}`)
            if (segue.data.data) {
                Setsegue_usuario(true)
            }
        } catch (error) {
            console.error('Erro ao buscar perfil:', error);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 1500)
        }
    }

    async function seguir() {

        const idUserSalvo = await AsyncStorage.getItem('idUser');
        if (!idUserSalvo) {
            navigation.navigate('Login')
        }

        const url = 'http://localhost:8000/api/posts/interacoes/seguir';
        var seguidor = new FormData();
        seguidor.append('idUser', idUserSalvo)
        seguidor.append('userPost', idUser)
        var result = await axios.post(url, seguidor)

        const seguidoresAtual = parseInt(seguidores)

        if (result.data == 'deseguido') {
            Setsegue_usuario(false)
            setSeguidores(seguidores - 1)
        } else {

            setSeguidores(seguidores + 1)

            Setsegue_usuario(true)
        }
    }




    useEffect(() => {

        carregarPerfil()


    }, []);
    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#fff" }}>
                <ActivityIndicator size="large" color="#3498db" />
            </SafeAreaView>
        );
    }
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.containerCont}>
                {/*Container da Imagem de Fundo do Header */}
                <View style={styles.header}>
                    <Image
                        style={styles.banner}
                        source={banner !== null ? { uri: `http://localhost:8000/img/user/bannerPerfil/${banner}` } : require('../../../assets/backGroundDeslogado.jpg')}
                    />
                </View>
                {/*Container do Perfil */}
                <View style={styles.perfilContainer}>

                    <View style={styles.itensContainer}>
                        <View style={styles.imgContainer}>
                            <Image
                                style={styles.userImg}
                                source={userImg !== null ? { uri: `http://localhost:8000/img/user/fotoPerfil/${userImg}` } : require('../../../assets/userDeslogado.png')}
                            />
                        </View>


                        {/*Container do Informações do Usúario */}
                        <View style={styles.infoContainer}>
                            <View style={styles.infoUser}>
                                <View style={styles.boxNomeUser}>

                                    <Text style={styles.nomeUser}>{nome}</Text>
                                    {instituicao == 1 ? (
                                        <Ionicons style={styles.instIcon} name="business-outline"></Ionicons>
                                    ) : null}
                                </View>

                                <View>
                                    <Text style={styles.arrobaUser}>@{user}</Text>
                                </View>


                            </View>

                        </View>

                    </View>
                </View>

                {/*Container Seguidores */}
                <View style={styles.containerBioSeguidores}>
                    <View style={styles.bioUser}>
                        <Text style={styles.textBioUser}>{bio}</Text>
                    </View>
                    <View style={styles.boxSeguidores}>
                        <Pressable style={styles.seguidores} onPress={() => {
                            navigation.navigate('SeguindoSeguidores', {
                                idUserPerfil: idUser,
                                titulo: user,
                                pagina: 'seguidores',
                            })
                        }}>
                            <Text style={styles.numSeg}>{seguidores}</Text>
                            <Text style={styles.textSeguidores}>Seguidores</Text>
                        </Pressable>

                        <Pressable style={styles.seguindo} onPress={() => {
                            navigation.navigate('SeguindoSeguidores', {
                                idUserPerfil: idUser,
                                titulo: user,
                                pagina: 'seguindo',
                            })
                        }}>
                            <Text style={styles.numSeg}>{seguindo}</Text>
                            <Text style={styles.textSeguindo}>Seguindo</Text>
                        </Pressable>
                        <View style={styles.seguindo}>
                            <Text style={styles.numSeg}>{postsCount}</Text>
                            <Text style={styles.textSeguindo}>Posts</Text>
                        </View>
                    </View>
                </View>


                {perfilProprio ? (
                    <View style={styles.editarContainer}>
                        <View style={[styles.buttonContainer, { gap: 0 }]}>
                            <Pressable style={styles.editarButton}>
                                <Text style={styles.textEditarPerf}>Editar Perfil</Text>
                            </Pressable>

                            <Pressable onPress={() => navigation.navigate('Configurações')} >
                                <Ionicons style={styles.settingIcon} name="settings-outline"></Ionicons>
                            </Pressable>

                        </View>



                    </View>
                ) :
                    <View style={styles.editarContainer}>
                        <View style={styles.buttonContainer}>
                            {segue_usuario ? (
                                <Pressable style={styles.buttonVazado} onPress={seguir}>
                                    <Text style={{ color: '#00000' }}>Seguindo</Text>
                                </Pressable>
                            ) :
                                <Pressable style={styles.buttonCompleto} onPress={() => seguir()} >
                                    <Text style={{ color: '#fff' }}>Seguir</Text>
                                </Pressable>
                            }
                            <Pressable style={styles.buttonVazado}>
                                <Text >Mensagem</Text>

                            </Pressable>

                            <Configuracoes
                                arroba={user}
                                userPerfil={idUser}
                                tipo='perfil'
                            />
                        </View>
                    </View>
                }
                {/*View Storys*/}
                <View style={styles.storysContainer}>
                    <FlatList
                        horizontal={true}
                        data={DATA}
                        keyExtractor={(item) => item.id}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <View style={styles.storys}>
                                <Pressable style={styles.circuloStorys}>
                                    <View
                                        style={[styles.imgLogo]}
                                    >
                                        <Image style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '50%' }} source={item.photoURL} />
                                    </View>
                                </Pressable>

                                <View style={styles.nomeStorys}>
                                    <Text style={styles.textStorys}>{item.nome}</Text>
                                </View>
                            </View>
                        )}
                    />
                </View>

                {/*Barra de Navegação*/}
                <View style={styles.barraContainer}>
                    <Pressable onPress={() => alterarFoco('posts')} style={[styles.opcao, focoIcone === 'posts' ? styles.opcaoAtiva : styles.opcaoInativa]}>
                        <Ionicons style={[styles.opcaoIcon, focoIcone === 'posts' ? styles.IconeAtivo : styles.iconeInativo]} name="grid-outline"></Ionicons>
                    </Pressable>

                    <Pressable onPress={() => alterarFoco('imagem')} style={[styles.opcao, focoIcone === 'imagem' ? styles.opcaoAtiva : styles.opcaoInativa]}>
                        <Ionicons style={[styles.opcaoIcon, focoIcone === 'imagem' ? styles.IconeAtivo : styles.iconeInativo]} name="image-outline"></Ionicons>
                    </Pressable>

                    <Pressable onPress={() => alterarFoco('reposts')} style={[styles.opcao, focoIcone === 'reposts' ? styles.opcaoAtiva : styles.opcaoInativa]}>
                        <Ionicons style={[styles.opcaoIcon, focoIcone === 'reposts' ? styles.IconeAtivo : styles.iconeInativo]} name="repeat-outline"></Ionicons>
                    </Pressable>
                    {instituicao == 1 ? (

                        <Pressable onPress={() => alterarFoco('curteis')} style={[styles.opcao, focoIcone === 'curteis' ? styles.opcaoAtiva : styles.opcaoInativa]}>
                            <Ionicons style={[styles.opcaoIcon, focoIcone === 'curteis' ? styles.IconeAtivo : styles.iconeInativo]} name="id-card-outline"></Ionicons>
                        </Pressable>
                    ) : null}
                </View>
                {/*Posts*/}
                {focoIcone === 'reposts' ? (
                    <View style={styles.postContainer}>
                        <Post key="post-1" idUser={idUser} tipo="reposts" />
                    </View>
                ) : focoIcone =='imagem'?(
                    <View style={styles.postContainer}>
                        <Post key="post-2" idUser={idUser} tipo="normais"/>
                    </View>
                ): <View style={styles.postContainer}>
                        <Post key="post-3" idUser={idUser} />
                    </View>}






            </ScrollView>
            <ModalPostagem tipo='post' tela='perfil' />
        </SafeAreaView>
    )
};