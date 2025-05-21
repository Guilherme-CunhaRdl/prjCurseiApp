import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TextInput, Pressable, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Post from '../../../Components/Post';
import styles from './styles';
import { Ionicons } from '@expo/vector-icons';

export default function TelaPesquisa() {
    const route = useRoute();
    const { termoPesquisado } = route.params || {};
    const navigation = useNavigation();

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // riannnnnnnnnnnnnnnnnnnnnnnnnnnnn
    // mn eu conseguir fazer funfa ,fiz rapidinho só pra testar mas acho que dá pra fazer algo bem mais foda ,tipo o do insta que tem o pra você que é users e post ,contas,reels,post, etc tlg 
    // tudo isso baseado no que o user pesquisou ,acho que essa é a call ,isso é algo que pode dá um b.osinho posso te ajudar se quiser
    // mas fiz o bagulho de posts bem rapidinho só pra testar


    // useEffect(() => {
    //     async function buscarConteudo() {
    //         try {
    //             const response = await axios.post('http://localhost:8000/api/cursei/explorar/buscar', {
    //                 termoPesquisado: termoPesquisado,
    //             });

    //             setPosts(response.data.posts); // pega os posts encontrados
    //         } catch (error) {
    //             console.error('Erro ao buscar dados:', error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     }

    //     buscarConteudo();
    // }, [termoPesquisado]);

    return (
        <View style={styles.container}>
            <View style={styles.ScrollCont}>
                <View style={styles.Header}>
                    <View style={styles.explorarContainer}>
                        <Text style={styles.explorarTitle}>Explorar</Text>
                    </View>
                    <View style={styles.barraContainer}>
                        <View style={styles.barraPesquisa}>
                            <Pressable onPress={navigation.goBack}>
                                <Ionicons style={styles.inputIcon} name="arrow-back" />
                            </Pressable>
                            <TextInput
                                style={styles.input}
                                placeholder="Seu futuro a uma pesquisa..."
                                value={termoPesquisado}
                                editable={false}
                            />
                        </View>
                    </View>
                </View>
                
                
            </View>
            <ScrollView  style={styles.containerPost}>
                  {loading ? (
                    <ActivityIndicator size="large" color="#000" />
                ) : (
                
                        <Post pesquisa ={termoPesquisado}/>
                    
                )}
                </ScrollView>
        </View>
    );
}
