import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { Appbar } from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import Home from '../../../../../Screens/Home';

const notificacoes = {
  recentes: [
    {
      id: '1',
      tipo: 'like',
      nome: 'EL CHAVO DEL OCHO',
      texto: 'Curtiu seu post: Itaú é doidera cara...',
      tempo: '1h',
    },
    {
      id: '2',
      tipo: 'comentario',
      nome: 'EL CHAVO DEL OCHO',
      texto: 'Curtiu comentou no seu post: Seria melhor ter ido ver o filme do pelé!',
      tempo: '1h',
    },
    {
      id: '3',
      tipo: 'seguir',
      nome: 'EL CHAVO DEL OCHO',
      texto: 'Começou a te seguir.',
      tempo: '1h',
    },
  ],
  antigas: [
    {
      id: '4',
      tipo: 'like',
      nome: 'EL CHAVO DEL OCHO',
      texto: 'Curtiu seu post: Itaú é doidera cara...',
      tempo: '1h',
    },
    {
      id: '5',
      tipo: 'comentario',
      nome: 'EL CHAVO DEL OCHO',
      texto: 'Curtiu comentou no seu post: Seria melhor ter ido ver o filme do pelé!',
      tempo: '1h',
    },
  ],
};

const icones = {
  like: require('../../img/like.png'),
  comentario: require('../../img/comment.png'),
  seguir: require('../../img/follow.png'),
};


export default function Notificacoes() {
  const navigation = useNavigation();
  const renderItem = ({ item }) => (
    <View style={styles.notificacao}>
      <Image source={require('../../img/metalbat.jpg')} style={styles.avatar} />
      <View style={styles.textoContainer}>
        <Text style={styles.nome}>
          {item.nome} <Text style={styles.texto}>{item.texto}</Text>
        </Text>
        <Text style={styles.tempo}>{item.tempo}</Text>
      </View>
      <Image source={icones[item.tipo]} style={styles.iconeImg} />
    </View>
  );
  

  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: '#fff', elevation: 0 }}>
        <Appbar.BackAction onPress={ () => navigation.goBack()}/>
        <Appbar.Content title="Notificações" titleStyle={{ textAlign: 'center', fontWeight: 600 }} />
        <View style={{ width: 48 }} />
      </Appbar.Header>

      <FlatList
        ListHeaderComponent={
          <>
            <Text style={styles.titulo}>Últimos 7 dias</Text>
            {notificacoes.recentes.map(item => renderItem({ item }))}
            <Text style={styles.titulo}>Últimos 30 dias</Text>
            {notificacoes.recentes.map(item => renderItem({ item }))}
            <Text style={styles.titulo}>Notificações Antigas</Text>
            {notificacoes.antigas.map(item => renderItem({ item }))}
          </>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  titulo: {
    fontSize: 20,
    fontWeight: 600,
    marginTop: 16,
    marginLeft: 16,
    padding: 2
  },
  notificacao: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 7
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  textoContainer: { flex: 1 },
  nome: { fontWeight: '600' },
  texto: { fontWeight: 'normal', color: '#000' },
  tempo: { fontSize: 12, color: '#999' },

  iconeImg: {
    width: 20,
    height: 20,
    marginLeft: 8,
    marginTop: 4,
    resizeMode: 'contain'
  },
  
});
