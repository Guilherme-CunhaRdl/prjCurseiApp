import React from 'react';
import { SafeAreaView, View, Text, ScrollView, Image, Pressable, FlatList } from 'react-native';
import styles from './styles';
import User from '../../../../assets/userIMG.png';
import Configuracoes from '../../../Components/Configurações/configuracoes';

const DATA = [
    { id: '1', trendig: "#CURSEINOTA10", numPosts: "100k posts" },
    { id: '2', trendig: "#TONACURSEI", numPosts: "200k posts" },
    { id: '3', trendig: "#CURSODEQUALIDADE", numPosts: "100k posts" },
    { id: '4', trendig: "#CURSODEQUALIDADE", numPosts: "100k posts" },
];

const USERS = [
    { id: Math.random().toString(36).substring(2, 27), name: "Lucas Monteiro", arroba: "@lucas.mont", photoURL: User },
    { id: Math.random().toString(36).substring(2, 27), name: "Vitoria Matos", arroba: "@vic.matoss", photoURL: User },
    { id: Math.random().toString(36).substring(2, 27), name: "Bruno Andrade", arroba: "@bruno_and", photoURL: User },
    { id: Math.random().toString(36).substring(2, 27), name: "Isabela Rocha", arroba: "@isabela.rocha", photoURL: User },
    { id: Math.random().toString(36).substring(2, 27), name: "Carlos Souza", arroba: "@carlosz", photoURL: User },
];

export default function ParaVoce() {
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
                                        <View style={{height:20, alignItems:'center', justifyContent:'center'}}>
                                            <Configuracoes/>
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
                            data={USERS}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => (
                                <View style={styles.userContainer}>
                                    <View style={styles.userImgContainer}>
                                        <Image source={item.photoURL} style={styles.imgLogo} />
                                    </View>

                                    <View style={styles.containerNomeUser}>
                                        <Text style={styles.nomeUser}>{item.name}</Text>
                                        <Text style={styles.arrobaUser}>{item.arroba}</Text>
                                    </View>

                                    <View style={styles.buttonFollowContainer}>
                                        <Pressable style={styles.buttonFollow}>
                                            <Text style={styles.titleButton}>Seguir</Text>
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
