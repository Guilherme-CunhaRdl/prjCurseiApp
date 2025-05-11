import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import styles from './styles';
import Configuracoes from '../../../Components/Configurações/configuracoes';
import axios from 'axios';

export default function Assuntos() {
  const [interesses, setInteresses] = useState([]);

  useEffect(() => {
    const fetchAssuntos = async () => {
      try {
        const url = 'http://127.0.0.1:8000/api/cursei/explorar/assuntosMomento';
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
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.ScrollCont}>
        <View style={styles.contentContainer}>
          <View style={styles.containerTradings}>
            <View style={styles.containerTitle}>
              <Text style={styles.title}>O que está acontecendo</Text>
            </View>
            <View style={styles.separator} />
            <FlatList
              data={interesses}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              renderItem={({ item }) => (
                <View style={styles.trendig}>
                  <View style={styles.trendigHeader}>
                    <Text style={styles.subTitle}>Tendência no Cursei</Text>
                    <View style={{ height: 20, alignItems: 'center', justifyContent: 'flex-start' }}>
                      <Configuracoes />
                    </View>
                  </View>

                  <Text style={styles.trendigName}>{item.hashtag}</Text>
                  <Text style={styles.trendigNum}>{item.usos} usos</Text>
                </View>
              )}
            />

            <TouchableOpacity style={styles.containerMS}>
              <Text style={styles.titleMS}>Mostrar mais</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
  