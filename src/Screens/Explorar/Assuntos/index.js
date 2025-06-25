import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, ScrollView, FlatList, TouchableOpacity,Pressable } from 'react-native';
import styles from './styles';
import Configuracoes from '../../../Components/Configurações/configuracoes';
import axios from 'axios';
import host from '../../../global';
import { useNavigation } from '@react-navigation/native';
import {useTema} from '../../../context/themeContext';
export default function Assuntos() {
  const [interesses, setInteresses] = useState([]);
    const navigation = useNavigation();
    const {tema} = useTema();
  useEffect(() => {
    const fetchAssuntos = async () => {
      try {
        const url = `http://${host}:8000/api/cursei/explorar/assuntosMomento`;
        const response = await axios.get(url);
        console.log(response.data);
        setInteresses(response.data);
      } catch (error) {
        console.error('Erro ao buscar os assuntos:', error);
      }
    };

    fetchAssuntos();
  }, []);

 return (
  <SafeAreaView style={[styles.container, { backgroundColor: tema.fundo }]}>
    <ScrollView
      style={styles.ScrollCont}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.containerTradings, { backgroundColor: tema.modalFundo }]}>
        <View style={styles.containerTitle}>
          <Text style={[styles.title, { color: tema.texto }]}>
            O que está acontecendo
          </Text>
        </View>
        <View style={[styles.separator, { backgroundColor: tema.barra }]} />

        {interesses?.map((item, index) => (
          <Pressable
            key={index}
            onPress={() =>
              navigation.navigate("Pesquisar", {
                termoPesquisado: item.hashtag,
              })
            }
          >
            <View style={styles.trendig}>
              <View style={styles.trendigHeader}>
                <Text style={[styles.subTitle, { color: tema.descricao }]}>
                  Tendência no Cursei
                </Text>
                <View
                  style={{
                    height: 20,
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <Configuracoes />
                </View>
              </View>

              <Text style={[styles.trendigName, { color: tema.texto }]}>
                {item.hashtag}
              </Text>
              <Text style={[styles.trendigNum, { color: tema.descricao }]}>
                {item.usos} Posts
              </Text>
            </View>

            <View style={[styles.separator, { backgroundColor: tema.barra }]} />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  </SafeAreaView>
);
} 