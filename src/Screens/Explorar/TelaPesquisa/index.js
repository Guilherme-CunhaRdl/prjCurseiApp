
import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TextInput, Pressable, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Post from '../../../Components/Post';
import styles from './styles';
import { Ionicons } from '@expo/vector-icons';
import TopTabs from './TopTabPesquisa';

export default function TelaPesquisa() {
    const route = useRoute();
    const [termoPesquisado, setTermoPesquisado] = useState(route.params?.termoPesquisado || '');
        const [termoAtivo, setTermoAtivo] = useState(route.params?.termoPesquisado || '');

    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
 const pesquisar = () => {
        if (termoPesquisado.trim() === '') return;
            setTermoAtivo(termoPesquisado);
        setLoading(true);
        // Aqui você pode adicionar lógica adicional se necessário
        // O TopTabs vai automaticamente atualizar quando termoPesquisado mudar
    };
    return (
        <View style={styles.container}>
            <SafeAreaView style={{backgroundColor: '#fff'}}> 
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
                            value={termoPesquisado}
                            onChangeText={setTermoPesquisado}
                            onSubmitEditing={pesquisar}
                            returnKeyType="search"
                            />
                        </View>
                    </View>
                </View>
            </SafeAreaView>

            {/* Conteúdo principal com TopTabs */}
            <View style={{flex: 1}}>
                <TopTabs termoPesquisado={termoAtivo} />
            </View>
        </View>
    );
}

