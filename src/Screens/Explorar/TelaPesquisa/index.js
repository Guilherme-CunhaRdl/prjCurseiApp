
import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TextInput, Pressable, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Post from '../../../Components/Post';
import styles from './styles';
import { Ionicons } from '@expo/vector-icons';
import TopTabs from './TopTabPesquisa';
import { useTema } from '../../../context/themeContext';

export default function TelaPesquisa() {
    const route = useRoute();
    const [termoPesquisado, setTermoPesquisado] = useState(route.params?.termoPesquisado || '');
        const [termoAtivo, setTermoAtivo] = useState(route.params?.termoPesquisado || '');
    const {tema} = useTema();
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
        <View style={[styles.container, { backgroundColor: tema.fundo }]}>
          <SafeAreaView style={{ backgroundColor: tema.fundo }}>
            <View style={[styles.Header, { backgroundColor: tema.fundo }]}>
              <View style={styles.explorarContainer}>
                <Text style={[styles.explorarTitle, { color: tema.texto }]}>
                  Explorar
                </Text>
              </View>
              <View style={styles.barraContainer}>
                <View style={[styles.barraPesquisa, { backgroundColor: tema.cinza }]}>
                  <Pressable onPress={navigation.goBack}>
                    <Ionicons
                      style={[styles.inputIcon, { color: tema.icone }]}
                      name="arrow-back"
                    />
                  </Pressable>
                  <TextInput
                    style={[styles.input, { color: tema.texto }]}
                    value={termoPesquisado}
                    onChangeText={setTermoPesquisado}
                    onSubmitEditing={pesquisar}
                    placeholder="Buscar..."
                    placeholderTextColor={tema.descricao}
                    returnKeyType="search"
                  />
                </View>
              </View>
            </View>
          </SafeAreaView>
    
          {/* Conteúdo principal com TopTabs */}
          <View style={{ flex: 1 }}>
            <TopTabs termoPesquisado={termoAtivo} />
          </View>
        </View>
      );
    };