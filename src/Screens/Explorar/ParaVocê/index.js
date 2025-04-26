import React from 'react';
import { SafeAreaView, View, Text, ScrollView, TouchableOpacity, Image, StatusBar, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './styles';
import { FlatList } from 'react-native-web';
import User from '../../../../assets/userIMG.png'
import Configuracoes from '../../../Components/Configurações/configuracoes';
import Post from '../../../Components/Post';

const DATA = [
    {
        id: Math.random().toString(36).substring(2, 27),
        trendig: "#CURSEINOTA10",
        numPosts: "100k posts",
    },
    {
        id: Math.random().toString(36).substring(2, 27),
        trendig: "#TONACURSEI",
        numPosts: "200k posts",
    },
    {
        id: Math.random().toString(36).substring(2, 27),
        trendig: "#CURSODEQUALIDADE",
        numPosts: "100k posts",
    },
    {
        id: Math.random().toString(36).substring(2, 27),
        trendig: "#CURSODEQUALIDADE",
        numPosts: "100k posts",
    },
]

const USERS = [
    {
        id: Math.random().toString(36).substring(2, 27),
        name: "Lucas Monteiro",
        arroba: "@lucas.mont",
        photoURL: User,
    },
    {
        id: Math.random().toString(36).substring(2, 27),
        name: "Vitoria Matos",
        arroba: "@vic.matoss",
        photoURL: User,
    },
]

export default function ParaVoce() {

    return (
        <SafeAreaView style={styles.container}>
            {/* Feed Content */}
            <ScrollView style={styles.ScrollCont}>
                <View style={styles.contentContainer}>
                    <View style={styles.containerTradings}>
                        <View style={styles.containerTitle}>
                            <Text style={styles.title}>O que está acontecendo</Text>
                        </View>
                        <FlatList
                            data={DATA}
                            keyExtractor={item => item.id}
                            renderItem={item => (



                                <View style={styles.trendig}>
                                    <View style={styles.containerSubTitle}>
                                        <Text style={styles.subTitle}>Tendência no Cursei</Text>
                                    </View>

                                    <View style={styles.containertrendigName}>
                                        <Text style={styles.trendigName}>{item.item.trendig}</Text>
                                        <View style={styles.containerConfg}>
                                            <Configuracoes />
                                        </View>
                                    </View>

                                    <View style={styles.containertrendigNum}>
                                        <Text style={styles.trendigNum}>{item.item.numPosts}</Text>
                                    </View>
                                </View>


                            )} />
                        <View style={styles.containerMS}>
                            <Text style={styles.titleMS}>Mostrar Mais</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.sugestaoContainer}>
                    <View style={styles.sugestao}>
                        <View style={styles.containerTitle}>
                            <Text style={styles.title}>Quem seguir</Text>
                        </View>
                        <FlatList
                            data={USERS}
                            keyExtractor={item => item.id}
                            renderItem={item => (



                                <View style={styles.userContainer}>
                                    <View style={styles.userImgContainer}>
                                        <Image
                                            style={styles.imgLogo}
                                            source={item.item.photoURL}
                                        />
                                    </View>


                                    <View style={styles.containerNomeUser}>
                                        <Text style={styles.nomeUser}>{item.item.name}</Text>

                                        <View style={styles.containerArrobaUser}>
                                            <Text style={styles.arrobaUser}>{item.item.arroba}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.buttonFollowContainer}>
                                        <Pressable style={styles.buttonFollow}>
                                            <Text style={styles.titleButton}>Seguir</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            )} />
                        <View style={styles.containerMSUser}>
                            <Text style={styles.titleMS}>Mostrar Mais</Text>
                        </View>
                    </View>

                </View>

                <View style={styles.titleContainer}>
                    <Text style={styles.titlePosts}>Posts do seu Interesse</Text>
                </View>

                <View style={styles.feedContainer}>
                    {/*Posts*/}
                    <View style={styles.postContainer}>
                        <Post />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

