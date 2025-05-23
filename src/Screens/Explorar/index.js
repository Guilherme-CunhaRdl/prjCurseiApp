import React, { useState } from 'react';
import { SafeAreaView, View, Text, ScrollView, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './styles';
import TopTabs from '../../Routes/TopTab';
import { useNavigation, useRoute } from "@react-navigation/native";
import ModalPostagem from '../../Components/ModalPostagem';
import host from '../../global';
export default function Explorar() {
    const navigation = useNavigation();

    const [termoPesquisado, setTermoPesquisado] = useState('');


    const pesquisar = () => {
        if (termoPesquisado.trim() === '') return;

        console.log('Buscar por:', termoPesquisado);
        navigation.navigate('Pesquisar', { termoPesquisado: termoPesquisado });
    };
    return (
        <SafeAreaView style={styles.container}>
            {/* Feed Content */}
            <ScrollView style={styles.ScrollCont}>
                {/*Header*/}
                <View style={styles.Header}>
                    <View style={styles.explorarContainer}>
                        <Text style={styles.explorarTitle}>Explorar</Text>
                    </View>
                    {/*Barra de Pesquisa*/}
                    <View style={styles.barraContainer}>
                        <View style={styles.barraPesquisa}>
                            <Ionicons style={styles.inputIcon} name="search-outline"></Ionicons>
                            <TextInput
                                style={styles.input}
                                placeholder="Seu futuro a uma pesquisa..."
                                autoCapitalize="none"
                                value={termoPesquisado}
                                onChangeText={setTermoPesquisado}
                                onSubmitEditing={pesquisar}
                            />
                        </View>
                    </View>

                    {/*Opções de Navegação*/}
                    <View style={styles.opcoesContainer}>
                        <TopTabs />
                    </View>
                </View>
                    

            </ScrollView>
              <ModalPostagem tipo='post' />
        </SafeAreaView>
    );
};

