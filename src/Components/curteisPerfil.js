import { View, Text, Image, Pressable, ActivityIndicator, StyleSheet, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import host from '../../global';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CurteisPerfil = ({ navigation }) => {
    const route = useRoute();
    const [idUser, setIdUser] = useState();
    const [loading, setLoading] = useState(true);
    const [curteis, setCurteis] = useState([]);

    useEffect(() => {
        const carregarDados = async () => {
            const idUserSalvo = await AsyncStorage.getItem('idUser');
            const idPerfil = route.params?.idUserPerfil || idUserSalvo;
            
            try {
                setIdUser(idPerfil);
                const response = await axios.get(`http://${host}:8000/api/curteis/${idPerfil}`);
                setCurteis(response.data?.data || []);
            } catch (error) {
                console.error('Erro ao buscar curtéis:', error);
            } finally {
                setLoading(false);
            }
        };

        carregarDados();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" />
            </View>
        );
    }

    const renderItem = ({ item }) => (
        <View style={styles.curtelItem}>
            <Pressable onPress={() => navigation.navigate('PlayerCurtel', { videoUrl: item.video_url })}>
                <Image
                    style={styles.curtelThumbnail}
                    source={{ uri: item.thumbnail_url || 'https://via.placeholder.com/120x160' }}
                />
                <View style={styles.playIcon}>
                    <Ionicons name="play-circle" size={24} color="white" />
                </View>
            </Pressable>
            <Text style={styles.curtelTitle} numberOfLines={1}>{item.titulo || 'Curtel'}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                horizontal
                data={curteis}
                renderItem={renderItem}
                keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 12,
    },
    listContainer: {
        paddingHorizontal: 16,
    },
    curtelItem: {
        width: 120,
        marginRight: 10,
        alignItems: 'center',
    },
    curtelThumbnail: {
        width: 120,
        height: 160,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
    },
    playIcon: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -12,
        marginTop: -12,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 12,
    },
    curtelTitle: {
        marginTop: 6,
        fontSize: 12,
        textAlign: 'center',
        color: '#333',
    },
    loadingContainer: {
        height: 160,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default CurteisPerfil;