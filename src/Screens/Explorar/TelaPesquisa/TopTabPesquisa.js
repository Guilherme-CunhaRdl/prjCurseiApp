import React, { useEffect, useState } from 'react';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Post from "../../../Components/Post";
import { useRoute, useNavigation } from '@react-navigation/native';
import { ScrollView, ActivityIndicator } from 'react-native';
import styles from './styles';
import { View, Text, FlatList, Pressable, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import host from '../../../global';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../../../colors';
import {useTema} from '../../../context/themeContext';

const Top = createMaterialTopTabNavigator();

const TopTabs = ({ termoPesquisado }) => {
    
    const [loading, setLoading] = useState(false);
    const [usuarios, setUsuarios] = useState();
    const [instituicoes, setInstituicoes] = useState();

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

    const [segue_usuario, Setsegue_usuario] = useState(false)

    async function procurarUsuarios(navigation) {
        try {
            const idUserSalvo = await AsyncStorage.getItem('idUser');
            const url = `http://${host}:8000/api/cursei/user/procurarUsuario/${encodeURIComponent(termoPesquisado)}/${idUserSalvo}`;
            console.log(url)
            const response = await axios.get(url);
           // console.log("Resposta completa:", response.data);

            // Acesse a propriedade 'data' da resposta
            setUsuarios(response.data.data); // Note o .data.data (um do axios, outro do seu backend)

            //console.log("Dados dos usuários:", response.data.data);
        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
        }
    }
    async function procurarInstituicoes(navigation) {
        try {
            const url = `http://${host}:8000/api/cursei/instituicao/procurarInstituicao/${encodeURIComponent(termoPesquisado)}`;
            const response = await axios.get(url);
           // console.log("Resposta completa:", response.data);

            // Acesse a propriedade 'data' da resposta
            setInstituicoes(response.data.data); // Note o .data.data (um do axios, outro do seu backend)

           // console.log("Dados das instituições:", response.data.data);
        } catch (error) {
            console.error("Erro ao buscar instituições:", error);
        }
    }

    useEffect(() => {
        if (termoPesquisado && termoPesquisado.trim() !== '') {
            setLoading(true);
            Promise.all([
                procurarUsuarios(),
                procurarInstituicoes()
            ]).finally(() => setLoading(false));
        }
    }, [termoPesquisado]); // <-- Observa mudanças no termo
    const {tema} = useTema();

return (
  <Top.Navigator
    screenOptions={{
      tabBarScrollEnabled: true,
      tabBarStyle: { backgroundColor: tema.fundo },
      tabBarIndicatorStyle: { backgroundColor: tema.azul },
      tabBarLabelStyle: {
        fontSize: 14,
        fontWeight: '600',
        color: tema.texto,
        textTransform: 'none',
      },
    }}
  >
    <Top.Screen
      name="Em Destaque"
      children={() => (
        <ScrollView style={[styles.containerPost, { backgroundColor: tema.fundo }]}>
          {loading ? (
            <ActivityIndicator size="large" color={tema.texto} />
          ) : (
            <Post pesquisa={termoPesquisado} />
          )}
        </ScrollView>
      )}
    />

    <Top.Screen
      name="Mais Recentes"
      children={() => (
        <ScrollView style={[styles.containerPost, { backgroundColor: tema.fundo }]}>
          {loading ? (
            <ActivityIndicator size="large" color={tema.texto} />
          ) : (
            <Post pesquisaMaisRecente={termoPesquisado} />
          )}
        </ScrollView>
      )}
    />

    <Top.Screen
      name="Usuários"
      children={() => (
        <View style={[styles.sugestao, { backgroundColor: tema.fundo }]}>
          <FlatList
            nestedScrollEnabled
            data={usuarios}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <View style={[styles.userContainer, { borderTopColor: tema.barra }]}>
                <Pressable
                  style={styles.userImgContainer}
                  onPress={() =>
                    navigation.navigate('Perfil', {
                      idUserPerfil: item.id,
                      titulo: item.arroba_user,
                    })
                  }
                >
                  <Image
                    source={{ uri: `http://${host}:8000/img/user/fotoPerfil/${item.img_user}` }}
                    style={styles.imgLogo}
                  />
                </Pressable>

                <Pressable
                  style={styles.containerNomeUser}
                  onPress={() =>
                    navigation.navigate('Perfil', {
                      idUserPerfil: item.id,
                      titulo: item.arroba_user,
                    })
                  }
                >
                  <Text style={[styles.nomeUser, { color: tema.texto }]}>
                    {item.nome_user}
                    {item.instituicao === 1 && (
                      <Ionicons color={tema.azul} size={20} name="school-outline" />
                    )}
                  </Text>
                  <Text style={[styles.arrobaUser, { color: tema.descricao }]}>
                    @{item.arroba_user}
                  </Text>
                </Pressable>

                <View style={styles.buttonFollowContainer}>
                  <Pressable
                    style={
                      item.seguido
                        ? [styles.buttonFollowActive, { backgroundColor: tema.azul }]
                        : [styles.buttonFollow, { borderColor: tema.azul }]
                    }
                    onPress={() => seguir(item.id)}
                  >
                    <Text
                      style={
                        item.seguido
                          ? [styles.titleButtonActive, { color: tema.textoBotao }]
                          : [styles.titleButton, { color: tema.azul }]
                      }
                    >
                      {item.seguido ? 'Seguido' : 'Seguir'}
                    </Text>
                  </Pressable>
                </View>
              </View>
            )}
          />
        </View>
      )}
    />

    <Top.Screen
      name="Instituições"
      children={() => (
        <View style={[styles.sugestao, { backgroundColor: tema.fundo }]}>
          <FlatList
            nestedScrollEnabled
            data={instituicoes}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <View style={[styles.userContainer, { borderTopColor: tema.barra }]}>
                <Pressable
                  style={styles.userImgContainer}
                  onPress={() =>
                    navigation.navigate('Perfil', {
                      idUserPerfil: item.id,
                      titulo: item.arroba_user,
                    })
                  }
                >
                  <Image
                    source={{ uri: `http://${host}:8000/img/user/fotoPerfil/${item.img_user}` }}
                    style={styles.imgLogo}
                  />
                </Pressable>

                <Pressable
                  style={styles.containerNomeUser}
                  onPress={() =>
                    navigation.navigate('Perfil', {
                      idUserPerfil: item.id,
                      titulo: item.arroba_user,
                    })
                  }
                >
                  <Text style={[styles.nomeUser, { color: tema.texto }]}>
                    {item.nome_user}{' '}
                    <Ionicons color={tema.azul} size={20} name="school-outline" />
                  </Text>
                  <Text style={[styles.arrobaUser, { color: tema.descricao }]}>
                    @{item.arroba_user}
                  </Text>
                </Pressable>

                <View style={styles.buttonFollowContainer}>
                  <Pressable
                    style={
                      item.seguido
                        ? [styles.buttonFollowActive, { backgroundColor: tema.azul }]
                        : [styles.buttonFollow, { borderColor: tema.azul }]
                    }
                    onPress={() => seguir(item.id)}
                  >
                    <Text
                      style={
                        item.seguido
                          ? [styles.titleButtonActive, { color: tema.textoBotao }]
                          : [styles.titleButton, { color: tema.azul }]
                      }
                    >
                      {item.seguido ? 'Seguido' : 'Seguir'}
                    </Text>
                  </Pressable>
                </View>
              </View>
            )}
          />
        </View>
      )}
    />
  </Top.Navigator>
);

                                  };
                                  export default TopTabs;
