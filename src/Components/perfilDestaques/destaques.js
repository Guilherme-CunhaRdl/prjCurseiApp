import { View, Text, Image, Pressable, ActivityIndicator, StyleSheet, Modal, Alert, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import { FlatList } from 'react-native';
import host from '../../global';
import { SafeAreaView } from 'react-native-safe-area-context';
import adicionarLogo from "../../../assets/adicionarLogo.png";
import Ionicons from 'react-native-vector-icons/Ionicons';

const Destaques = ({ navigation, adicionarLogo }) => {
    const route = useRoute();
    const rotavalores = route.params;
    const [idUser, setIdUser] = useState();
    const [loading, setLoading] = useState(true);
    const [perfilProprio, setPerfilProprio] = useState(false);
    const [destaques, setDestaques] = useState([]);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDestaque, setSelectedDestaque] = useState(null);

    async function carregarPerfil() {
        const idUserSalvo = await AsyncStorage.getItem('idUser');
        const idPerfil = rotavalores ? rotavalores.idUserPerfil : idUserSalvo;

        try {
            setIdUser(idPerfil);
            const resultados = await axios.get(`http://${host}:8000/api/cursei/user/${idPerfil}/${idUserSalvo}`);
            const data = resultados.data;
            if (idUserSalvo == idPerfil) {
                setPerfilProprio(true);
            }
        } catch (error) {
            console.error('Erro ao buscar perfil:', error);
        }
    }

    async function carregarDestaques() {
        try {
            if (!idUser) return;
            const response = await axios.get(`http://${host}:8000/api/destaques/${idUser}`);
            if (response.data && response.data.success && response.data.data) {
                setDestaques(response.data.data);
            } else {
                setDestaques([]);
            }
            setError(null);
        } catch (error) {
            setError('Falha ao carregar destaques');
            console.error('Erro ao buscar destaques:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            await carregarPerfil();
            await carregarDestaques();
        };
        fetchData();
    }, [idUser]);

    const excluirDestaque = async () => {
        if (!selectedDestaque) return;
        try {
            await axios.delete(`http://${host}:8000/api/destaques/${idUser}/${selectedDestaque}`);
            setDestaques(prev => prev.filter(d => d.id !== selectedDestaque));
            setModalVisible(false);
            
            // Adicione este alerta
            Alert.alert('Sucesso', 'Destaque excluído com sucesso!');
            
        } catch (error) {
            Alert.alert('Erro ao excluir destaque');
            console.error('Erro ao excluir destaque:', error);
        }
    };
    const editarDestaque = () => {
        if (!selectedDestaque) return;
        setModalVisible(false);
        navigation.navigate('EditarDestaque', { idDestaque: selectedDestaque });
    };

    const handleLongPress = (idDestaque) => {
        if (!perfilProprio) return;
        setSelectedDestaque(idDestaque);
        setModalVisible(true);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    const renderItem = ({ item }) => (
        <View style={styles.storys}>
            <Pressable 
                style={styles.circuloStorys} 
                onPress={() => navigation.navigate('videoDestaque', { idDestaque: item.id })}
                onLongPress={() => handleLongPress(item.id)}
            >
                <Image
                    style={styles.storyImage}
                    source={{ uri: item.foto_destaque || (item.stories && item.stories[0]?.url_completa) }}
                />
            </Pressable>
            <View style={styles.nomeStorys}>
                <Text style={styles.textStorys} numberOfLines={1}>{item.titulo_destaque}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.storysContainer}>
            <FlatList
                horizontal
                data={destaques}
                keyExtractor={(item) => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                ListHeaderComponent={
                    perfilProprio ? (
                        <View style={styles.storys}>
                            <Pressable
                                style={styles.circuloStorys}
                                onPress={() => navigation.navigate('CriarDestaques')}
                            >
                                <Image style={styles.addImage} source={adicionarLogo} />
                            </Pressable>
                            <View style={styles.nomeStorys}>
                                <Text style={styles.textStorys}>Novo</Text>
                            </View>
                        </View>
                    ) : null
                }
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
            />

            <Modal visible={modalVisible} transparent animationType="fade">
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.modalOverlay}
                    onPressOut={() => setModalVisible(false)}
                >
                    <TouchableOpacity activeOpacity={1} style={styles.modalContent} onPress={() => {}}>
                    <Text style={styles.modalTitle}>Gerenciar Destaque</Text>

                    <TouchableOpacity onPress={editarDestaque} style={styles.modalButton}>
                        <Text style={styles.modalButtonText}>Editar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={excluirDestaque}
                        style={[styles.modalButton, { backgroundColor: '#f44336' }]}
                    >
                        <Text style={styles.modalButtonText}>Excluir</Text>
                    </TouchableOpacity>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};


const styles = StyleSheet.create({
    storysContainer: {
        flexDirection: 'row',
        paddingVertical: 10,
    },
    listContent: {
        paddingHorizontal: 16,
    },
    storys: {
        alignItems: 'center',
        marginRight: 15,
        width: 60,
    },
    circuloStorys: {
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#E3E3E3',
        borderRadius: 30,
        height: 60,
        width: 60,
        borderWidth: 2,
    },
    storyImage: {
        width: '100%',
        height: '100%',
        borderRadius: 30,
    },
    addImage: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
    nomeStorys: {
        marginTop: 4,
        width: 60,
    },
    textStorys: {
        fontSize: 12,
        textAlign: 'center',
    },
    loadingContainer: {
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
    },
     modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '70%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    modalButton: {
        backgroundColor: '#3897f0',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginVertical: 5,
        width: '100%',
        alignItems: 'center'
    },
    modalButtonText: {
        color: 'white',
        fontWeight: 'bold'
    },
});

export default Destaques;