import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import SeguidoresSeguindoTab from '../../Routes/SeguidoresSeguindoTab';
import axios from 'axios';
import styles from './styles';

export default function ModalSeguidoresSeguindo() {
     const route = useRoute();
     const rotavalores = route.params;
    var idPerfil = rotavalores.idUserPerfil;
var arroba = rotavalores.titulo;
var pagina = rotavalores.pagina;
  return (
    <SafeAreaView style={styles.container}>
        <SeguidoresSeguindoTab idPerfil={idPerfil} arroba={arroba} pagina={pagina}/>
    </SafeAreaView>
  );
}
  