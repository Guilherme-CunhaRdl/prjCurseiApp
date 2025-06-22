import { View, Text, ScrollView, TouchableOpacity, Image, StatusBar, Pressable, ActivityIndicator, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './styles';
import { FlatList } from 'react-native';
import Post from "../../Components/Post";
import blackStory from '../../../assets/blackStory.png'
import React, { useState, useEffect } from 'react';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import Configuracoes from '../../Components/Configurações/configuracoes'
import {useTema} from '../../context/themeContext';
import ModalPostagem from "../../Components/ModalPostagem";
import ModalEditarPerfil from '../../Components/modalEditarPerfil';
import host from '../../global';
import { SafeAreaView } from 'react-native-safe-area-context';
import Destaques from '../../Components/perfilDestaques/destaques';
import adicionarLogo from "../../../assets/adicionarLogo.png";

import {
    Appbar,
    IconButton,
    Provider as PaperProvider,
    SegmentedButtons,
} from "react-native-paper";
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
    const [perfilBloqueado, setPerfilBloqueado] = useState(false)
    const [userBloqueado, setUserBloqueado] = useState(false)
    const [segue_usuario, Setsegue_usuario] = useState(false)
    const [modalEditarVisivel, setModalEditarVisivel] = useState(false);
    const [postsCount, setPostsCount] = useState('')
    const [refreshing, setRefreshing] = useState(false); // Estado para o refresh
    const {tema} = useTema();
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
            const resultados = await axios.get(`http://${host}:8000/api/cursei/user/${idPerfil}/${idUserSalvo}`);
            var data = resultados.data;
            console.log(data)
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
            setPerfilBloqueado(data.User.bloqueando)
            setUserBloqueado(data.User.bloqueado)
            if (idUserSalvo == idPerfil) {
                setPerfilProprio(true);
            }
            var segue = await axios.get(`http://${host}:8000/api/cursei/user/verificarSeSegue/${idUserSalvo}/${idPerfil}`)
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
    async function desbloquear() {
        const idUserSalvo = await AsyncStorage.getItem('idUser');
        const url = `http://${host}:8000/api/cursei/user/desbloquear/${idUser}/${idUserSalvo}`
        try {
            const response = await axios.get(url)
            if (response.data.sucesso) {
                setPerfilBloqueado(0)
            }
        } catch (error) {
            alert(error)
        }
    }
    async function seguir() {

        const idUserSalvo = await AsyncStorage.getItem('idUser');
        if (!idUserSalvo) {
            navigation.navigate('Login')
        }

        const url = `http://${host}:8000/api/posts/interacoes/seguir`;
        var seguidor = new FormData();
        seguidor.append('idUser', idUserSalvo)
        seguidor.append('userPost', idUser)
        const result = await axios.post(url, seguidor, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        console.log(segue_usuario)
        const seguidoresAtual = parseInt(seguidores)

        if (result.data == 'deseguido') {
            Setsegue_usuario(false)
            setSeguidores(seguidores - 1)
        } else {

            setSeguidores(seguidores + 1)

            Setsegue_usuario(true)
        }
    }


    const irParaChat = async () => {
        let idChatFinal;
        const idUserLogado = await AsyncStorage.getItem('idUser');
        try {
            const resposta = await axios.get(`http://${host}:8000/api/cursei/chat/adicionarChat/${idUserLogado}/${idUser}`);
            const chatExistente = resposta.data.seguidor;
            const idChatExistente = chatExistente ? chatExistente.id_chat : null;
            const dadosChat = {
                idUser1: idUserLogado,
                idUser2: idUser
            };


            idChatFinal = idChatExistente
            if (!idChatExistente) {
                const inserirDados = await axios.post(`http://${host}:8000/api/cursei/chat/adicionarChat/`, dadosChat);
                idChatFinal = inserirDados.data.id_chat;
            }

            console.log(idChatFinal)

        }
        catch (e) {
            console.log(e)
        } finally {
            navigation.navigate("Conversa", {
                idUserLogado: idUserLogado,
                idEnviador: idUserLogado,
                imgEnviador: userImg,
                nomeEnviador: nome,
                arrobaEnviador: user,
                idChat: idChatFinal,
            })
        }

    }
    async function recarregarPagina() {
        setRefreshing(true);
        var temporaria = focoIcone;
        setFocoIcone('')
        await carregarPerfil().finally(() => setRefreshing(false))
        setFocoIcone(temporaria)

    }
    useEffect(() => {

        carregarPerfil()


    }, []);
    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: tema.fundo }}>
                <ActivityIndicator size="large" color={tema.azul} />
            </SafeAreaView>
        );
    }
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: tema.fundo }]}>
            {!perfilProprio && (
                <View style={styles.headerTopo}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons size={22} name="arrow-back-outline" color={tema.azul} />
                    </TouchableOpacity>
                    <Text style={{ color: tema.texto, fontWeight: '600', fontSize: 20 }}>@{user}</Text>
                </View>
            )}
            <ScrollView
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
                contentContainerStyle={{ paddingBottom: 0 }}
                style={styles.containerCont}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={recarregarPagina}
                        tema={[tema.azul]}
                        tintColor={tema.azul}
                    />
                }
            >
                <View style={styles.header}>
                    <Image
                        style={styles.banner}
                        source={
                            banner !== null
                                ? { uri: `http://${host}:8000/img/user/bannerPerfil/${banner}` }
                                : require('../../../assets/backGroundDeslogado.jpg')
                        }
                    />
                </View>
    
                <View style={styles.perfilContainer}>
                    <View style={styles.itensContainer}>
                        <View style={[styles.imgContainer, {borderColor: tema.fundo}]}>
                            <Image
                                style={styles.userImg}
                                source={
                                    userImg !== null
                                        ? { uri: `http://${host}:8000/img/user/fotoPerfil/${userImg}` }
                                        : require('../../../assets/userDeslogado.png')
                                }
                            />
                        </View>
    
                        <View style={styles.infoContainer}>
                            <View style={styles.infoUser}>
                                <View style={styles.boxNomeUser}>
                                    <Text style={[styles.nomeUser, { color: tema.texto }]}>{nome}</Text>
                                    {instituicao == 1 && (
                                        <Ionicons style={[styles.instIcon, { color: tema.texto }]} name="school-outline" />
                                    )}
                                </View>
                                <Text style={[styles.arrobaUser, { color: tema.subTexto }]}>@{user}</Text>
                            </View>
                        </View>
                    </View>
                </View>
    
                <View style={styles.containerBioSeguidores}>
                    <View style={styles.bioUser}>
                        <Text style={[styles.textBioUser, { color: tema.texto }]}>{bio}</Text>
                    </View>
                    <View style={styles.boxSeguidores}>
                        <Pressable
                            style={styles.seguidores}
                            onPress={() =>
                                navigation.navigate('SeguindoSeguidores', {
                                    idUserPerfil: idUser,
                                    titulo: user,
                                    pagina: 'seguidores',
                                })
                            }
                        >
                            <Text style={[styles.numSeg, { color: tema.texto }]}>{seguidores}</Text>
                            <Text style={[styles.textSeguidores, { color: tema.subTexto }]}>Seguidores</Text>
                        </Pressable>
    
                        <Pressable
                            style={styles.seguindo}
                            onPress={() =>
                                navigation.navigate('SeguindoSeguidores', {
                                    idUserPerfil: idUser,
                                    titulo: user,
                                    pagina: 'seguindo',
                                })
                            }
                        >
                            <Text style={[styles.numSeg, { color: tema.texto }]}>{seguindo}</Text>
                            <Text style={[styles.textSeguindo, { color: tema.subTexto }]}>Seguindo</Text>
                        </Pressable>
    
                        <View style={styles.seguindo}>
                            <Text style={[styles.numSeg, { color: tema.texto }]}>{postsCount}</Text>
                            <Text style={[styles.textSeguindo, { color: tema.subTexto }]}>Posts</Text>
                        </View>
                    </View>
                </View>
    
                {perfilProprio ? (
                    <View style={styles.editarContainer}>
                        <View style={[styles.buttonContainer, { gap: 0 }]}>
                            <Pressable style={[styles.editarButton, { backgroundColor: tema.azul }]} onPress={() => setModalEditarVisivel(true)}>
                                <Text style={[styles.textEditarPerf, { color: tema.texto }]}>Editar Perfil</Text>
                            </Pressable>
    
                            <Pressable onPress={() => navigation.navigate('Configurações')}>
                                <Ionicons style={[styles.settingIcon, { color: tema.icone }]} name="settings-outline" />
                            </Pressable>
                        </View>
                    </View>
                ) : (
                    <View style={styles.editarContainer}>
                        <View style={styles.buttonContainer}>
                            {perfilBloqueado == 1 ? (
                                <Pressable style={[styles.buttonDesbloquear, { backgroundColor: tema.vermelho }]} onPress={desbloquear}>
                                    <Text style={{ color: tema.textoBotao, fontWeight: '500' }}>Desbloquear</Text>
                                </Pressable>
                            ) : segue_usuario ? (
                                <Pressable style={[styles.buttonVazado, { borderColor: tema.texto }]} onPress={seguir}>
                                    <Text style={{ color: tema.texto, fontWeight: '500' }}>Seguindo</Text>
                                </Pressable>
                            ) : (
                                <Pressable style={[styles.buttonCompleto, { backgroundColor: tema.azul }]} onPress={seguir}>
                                    <Text style={{ color: tema.textoBotao, fontWeight: '500' }}>Seguir</Text>
                                </Pressable>
                            )}
    
                            {!perfilBloqueado && (
                                <Pressable style={[styles.buttonVazado, { borderColor: tema.texto }]} onPress={irParaChat}>
                                    <Text style={{ color: tema.texto, fontWeight: '500' }}>Mensagem</Text>
                                </Pressable>
                            )}
    
                            <Configuracoes arroba={user} userPost={idUser} tipo="perfil" />
                        </View>
                    </View>
                )}
    
                {perfilBloqueado == 1 || instituicao == 1 ? (
                    <Destaques data={DATA} navigation={navigation} adicionarLogo={adicionarLogo} />
                ) : null}
    
                {perfilBloqueado !== 1 && (
                    <View style={[styles.barraContainer, { borderBottomColor: tema.barra }]}>
                        <Pressable onPress={() => alterarFoco('posts')} style={[styles.opcao, focoIcone === 'posts' ? styles.opcaoAtiva : styles.opcaoInativa]}>
                            <Ionicons
                                style={[styles.opcaoIcon, { color: focoIcone === 'posts' ? tema.iconeAtivo : tema.iconeInativo }]}
                                name="grid-outline"
                            />
                        </Pressable>
    
                        <Pressable onPress={() => alterarFoco('imagem')} style={[styles.opcao, focoIcone === 'imagem' ? styles.opcaoAtiva : styles.opcaoInativa]}>
                            <Ionicons
                                style={[styles.opcaoIcon, { color: focoIcone === 'imagem' ? tema.iconeAtivo : tema.iconeInativo }]}
                                name="image-outline"
                            />
                        </Pressable>
    
                        <Pressable onPress={() => alterarFoco('reposts')} style={[styles.opcao, focoIcone === 'reposts' ? styles.opcaoAtiva : styles.opcaoInativa]}>
                            <Ionicons
                                style={[styles.opcaoIcon, { color: focoIcone === 'reposts' ? tema.iconeAtivo : tema.iconeInativo }]}
                                name="repeat-outline"
                            />
                        </Pressable>
    
                        {instituicao == 1 && (
                            <Pressable onPress={() => alterarFoco('curteis')} style={[styles.opcao, focoIcone === 'curteis' ? styles.opcaoAtiva : styles.opcaoInativa]}>
                                <Ionicons
                                    style={[styles.opcaoIcon, { color: focoIcone === 'curteis' ? tema.iconeAtivo : tema.iconeInativo }]}
                                    name="id-card-outline"
                                />
                            </Pressable>
                        )}
                    </View>
                )}
    
                {perfilBloqueado !== 1 && (
                    focoIcone === 'reposts' ? (
                        <View style={styles.postContainer}>
                            <Post key="post-1" idUser={idUser} tipo="reposts" />
                        </View>
                    ) : focoIcone === 'imagem' ? (
                        <View style={styles.postContainer}>
                            <Post key="post-2" idUser={idUser} tipo="normais" />
                        </View>
                    ) : focoIcone === 'posts' ? (
                        <View style={styles.postContainer}>
                            <Post key="post-3" idUser={idUser} />
                        </View>
                    ) : focoIcone === 'curteis' ? (
                        <View style={styles.postContainer}>
                            <Post key="post-4" idUser={idUser} tipo="curteis" />
                        </View>
                    ) : null
                )}
            </ScrollView>
    
            <ModalPostagem tipo="post" tela="perfil" />
    
            <ModalEditarPerfil
                visivel={modalEditarVisivel}
                onClose={() => setModalEditarVisivel(false)}
                usuarioAtual={{
                    nome: nome,
                    bio: bio,
                    banner: banner,
                    foto: userImg
                }}
                onSaveSuccess={(dadosAtualizados) => {
                    setNome(dadosAtualizados.nome);
                    setBio(dadosAtualizados.bio);
                    if (dadosAtualizados.foto) setUserImg(dadosAtualizados.foto);
                    if (dadosAtualizados.banner) setBanner(dadosAtualizados.banner);
                }}
            />
        </SafeAreaView>
    );
            };    