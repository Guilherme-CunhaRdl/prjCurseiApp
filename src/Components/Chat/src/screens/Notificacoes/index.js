
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator ,RefreshControl, TouchableOpacity} from 'react-native';
import { Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Home from '../../../../../Screens/Home';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Icon from "react-native-vector-icons/Feather";
import host from '../../../../../global';


export default function Notificacoes() {
  const [loading, setLoading] = useState(true);
  const [notificacoes, setNotificacoes] = useState({ recentes: [], antigas: [], muitoAntigas: [] });
  const [refreshing, setRefreshing] = useState(false); // Estado para o refresh

  dayjs.extend(relativeTime);
  dayjs.locale('pt-br')
  async function buscarNotificacoes() {
    const idUserSalvo = await AsyncStorage.getItem('idUser');
    Response = await axios.get(`http://${host}:8000/api/cursei/user/notificacao/${idUserSalvo}/0`)
    setNotificacoes({
      recentes: (Response.data.ultimos_7_dias),
      antigas: (Response.data.ultimos_30_dias),
      muitoAntigas: (Response.data.notificacoes_antigas)
    })

    setLoading(false)
  }
  useEffect(() => {
    buscarNotificacoes();
  }, []);


  useEffect(() => {
    console.log("recente", notificacoes.recentes);
  }, [notificacoes]);

  const formatarTempoInsercao = (seconds) => {
    return dayjs().subtract(seconds, 'seconds').fromNow();
  };
  async function recarregarNotificacoes() {
    setRefreshing(true)
    await buscarNotificacoes().finally(() => setRefreshing(false))
  }


  const navigation = useNavigation();
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.notificacao} key={item.id}  onPress={() => navigation.navigate('Perfil', { idUserPerfil: item.idUsuario, titulo: item.arroba })}>
      <Image source={{ uri: `http://${host}:8000/img/user/fotoPerfil/${item.img_user}` }} style={styles.avatar} />
      <View style={styles.textoContainer}>
        <Text style={styles.nome}>
          {item.usuario}
          <Text style={styles.tempo}>      {formatarTempoInsercao(item.tempo_inserido)}</Text>
        </Text>
        <Text style={styles.texto}>
          {item.tipo === 'curtida'
            ? 'Curtiu seu post'
            : item.tipo === 'comentario'
              ? `Comentou no seu post:` 
              : item.tipo ==='seguido'?
               'Começou a te seguir.'
              : 'Repostou seu Post'
              }

          <Text style={{ fontWeight: 'normal' }}> {item.mensagem}</Text>
        </Text>
      </View>
      {item.tipo == 'curtida' ? (
        <Icon name="heart" size={25} color="#F22E2E" />

      ) : item.tipo == 'comentario' ? (
        <Icon name="message-circle" size={25} color="#448FFF" />
      )  : item.tipo ==='seguido'? <Icon name="user-plus" size={25} color="#00E923" />
      :  <Icon name="repeat" size={25} color="#666" />
    }


    </TouchableOpacity>
  );


  return (


    <View style={styles.container}>


      <Appbar.Header style={{ backgroundColor: '#fff', elevation: 0 }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Notificações" titleStyle={{ textAlign: 'center', fontWeight: 600 }} />
        <View style={{ width: 48 }} />
      </Appbar.Header>

      {loading ? (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#fff", position: 'fixed', zIndex: 99, width: '100%', height: '100%', backgroundColor: 'transparency' }}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
      ) :
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={recarregarNotificacoes}
              colors={["#3498db"]}
              tintColor="#3498db"
            />
          }
          ListHeaderComponent={
            <>
              {notificacoes.recentes.length != 0 ?(
                <Text style={styles.titulo}>Últimos 7 dias  </Text>
              ):null}
              {notificacoes.recentes.map(item => renderItem({ item }))}
               {notificacoes.antigas.length != 0 ?(
              <Text style={styles.titulo}>Últimos 30 dias</Text>
               ):null}
              {notificacoes.antigas.map(item => renderItem({ item }))}
               {notificacoes.muitoAntigas.length != 0 ?(
              <Text style={styles.titulo}>Notificações Antigas</Text>
               ):null}
              {notificacoes.muitoAntigas.map(item => renderItem({ item }))}
            </>
          }
        />
      }

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
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 7,

  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  textoContainer: { flex: 1 },
  nome: { fontWeight: '600', fontSize: 15 },
  texto: { fontWeight: '500', color: '#000' },
  tempo: { fontSize: 12, color: '#999' },

  iconeImg: {
    width: 20,
    height: 20,
    marginLeft: 8,
    marginTop: 4,
    resizeMode: 'contain',

  },

});
