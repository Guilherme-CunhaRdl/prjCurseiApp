import React from 'react';
import { SafeAreaView, View, Text, ScrollView, TouchableOpacity, Image, StatusBar, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './styles';
import { FlatList } from 'react-native-web';
import User from '../../../../assets/userIMG.png'

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

export default function Assuntos() {

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
            </ScrollView>
        </SafeAreaView>
    );
};

