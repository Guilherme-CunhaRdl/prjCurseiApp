import React from 'react';
import { SafeAreaView, View, Text, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import styles from './styles';
import Configuracoes from '../../../Components/Configurações/configuracoes';

const DATA = [
  { id: Math.random().toString(36).substring(2, 27), trendig: "#CURSEINOTA10", numPosts: "100k posts" },
  { id: Math.random().toString(36).substring(2, 27), trendig: "#TONACURSEI", numPosts: "200k posts" },
  { id: Math.random().toString(36).substring(2, 27), trendig: "#CURSODEQUALIDADE", numPosts: "150k posts" },
  { id: Math.random().toString(36).substring(2, 27), trendig: "#VEMPRACURSEI", numPosts: "90k posts" },
  { id: Math.random().toString(36).substring(2, 27), trendig: "#TOP1CURSEI", numPosts: "120k posts" },
  { id: Math.random().toString(36).substring(2, 27), trendig: "#CURSEI2025", numPosts: "80k posts" },
];

export default function Assuntos() {
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
              data={DATA}
              keyExtractor={item => item.id}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              renderItem={({ item }) => (
                <View style={styles.trendig}>
                  <View style={styles.trendigHeader}>
                    <Text style={styles.subTitle}>Tendência no Cursei</Text>
                    <View style={{height:20, alignItems:'center', justifyContent:'flex-start'}}>
                        <Configuracoes/>
                    </View>
                  </View>

                  <Text style={styles.trendigName}>{item.trendig}</Text>
                  <Text style={styles.trendigNum}>{item.numPosts}</Text>
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
};
