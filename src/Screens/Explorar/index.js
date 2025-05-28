import React, { useState } from 'react';
import {View, Text, ScrollView, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './styles';
import TopTabs from '../../Routes/TopTab';
import { useNavigation, useRoute } from "@react-navigation/native";
import ModalPostagem from '../../Components/ModalPostagem';
import host from '../../global';
import { SafeAreaView } from 'react-native-safe-area-context';
import {useTema} from '../../context/themeContext';
export default function Explorar() {
    const navigation = useNavigation();

    const [termoPesquisado, setTermoPesquisado] = useState('');
    const {tema} = useTema();

    const pesquisar = () => {
        if (termoPesquisado.trim() === '') return;

        console.log('Buscar por:', termoPesquisado);
        navigation.navigate('Pesquisar', { termoPesquisado: termoPesquisado });
    };
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: tema.fundo }]}>
          {/* Header */}
          <View style={[styles.Header, { backgroundColor: tema.fundo }]}>
            <View style={styles.explorarContainer}>
              <Text style={[styles.explorarTitle, { color: tema.texto }]}>Explorar</Text>
            </View>
    
            {/* Barra de Pesquisa */}
            <View style={[styles.barraContainer]}>
              <View style={[styles.barraPesquisa, { backgroundColor: tema.cinza }]}>
                <Ionicons
                  style={[styles.inputIcon, { color: tema.icone }]}
                  name="search-outline"
                />
                <TextInput
                  style={[styles.input, { color: tema.texto }]}
                  placeholder="Seu futuro a uma pesquisa..."
                  placeholderTextColor={tema.descricao}
                  autoCapitalize="none"
                  value={termoPesquisado}
                  onChangeText={setTermoPesquisado}
                  onSubmitEditing={pesquisar}
                />
              </View>
            </View>
    
            {/* Opções de Navegação */}
            <View style={styles.opcoesContainer}>
              <TopTabs />
            </View>
          </View>
    
          <ModalPostagem tipo="post" />
        </SafeAreaView>
      );
    };
    