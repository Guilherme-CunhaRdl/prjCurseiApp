import React from 'react';
import { SafeAreaView, View, Text, ScrollView, TextInput, Image, StatusBar, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './styles';
import { FlatList } from 'react-native-web';
import TopTabs from '../../Routes/TopTab';

const DATA = [
    {
        id: Math.random().toString(36).substring(2, 27),
        trendig: "#CURSEINOTA10",
        numPosts: "100k posts",
    },
]

export default function Explorar() {

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
                            />
                        </View>
                    </View>

                    {/*Opções de Navegação*/}
                    <View style={styles.opcoesContainer}>
                        <TopTabs />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

