
import { SafeAreaView, StyleSheet, Text, View, StatusBar, Image, TouchableOpacity,ActivityIndicator } from 'react-native';
import host from '../../global';
import { useTema } from '../../context/themeContext';
import getStyles from './styles';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from 'react-native';
import { Linking } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import axios from 'axios';

export default function evento() {
  const navigation = useNavigation();
  const route = useRoute();
  const rotavalores = route.params;
  const [capa, setCapa] = useState('');
  const [titulo, setTitulo] = useState('');
  const [imgPerfil, setImgPerfil] = useState('');
  const [nome, setNome] = useState('');
  const [arroba, setArroba] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [link, setLink] = useState('');
  const [descricao, setDescricao] = useState('');
  const [idUser, setIdUser] = useState('');
  const [loading, setLoading] = useState(true);
  const [proprio, setproprio] = useState(false);
  const [ativo,setAtivo] = useState (false);
  const { tema } = useTema();
  const styles = getStyles(tema);

  async function abrirLink(link) {
  
    Linking.openURL(link)
  }
  function converterParaDataBR(dataISO) {
  if (!dataISO || dataISO.length !== 10) return ''; // validação básica

  const [ano, mes, dia] = dataISO.split('-');
  return `${dia}/${mes}/${ano}`;
}
  async function carregarEvento() {
    const idEvento = rotavalores.eventoId;
    
    response = await axios.get(`http://${host}:8000/api/cursei/evento/${idEvento}`)
    setCapa(response.data[0].conteudo_post);
    setTitulo(response.data[0].descricao_post);
    setImgPerfil(response.data[0].img_user);
    setNome(response.data[0].nome_user);
    setArroba(response.data[0].arroba_user);
    setDataInicio(converterParaDataBR(response.data[0].data_inicio_evento));
    setDataFim(converterParaDataBR(response.data[0].data_fim_evento));
    setLink(response.data[0].link_evento);
    setDescricao(response.data[0].desc_evento);
    setIdUser(response.data[0].id_user);
    setLoading(false)
    console.log(idEvento)
    const idUserSalvo = await AsyncStorage.getItem('idUser');

    if(idUserSalvo == response.data[0].id_user){
      setproprio(true)
      console.log("1")
    }
  }
  useEffect(() => {
    carregarEvento()
  }, []);
  async function lembrete() {
      const idUserSalvo = await AsyncStorage.getItem('idUser');
      try{
        axios.get(`http://${host}:8000/api/cursei/lembreteEvento/${rotavalores.eventoId}/${idUserSalvo}`)
        if(ativo){
          setAtivo(false)
        }else{
          setAtivo(true)
        }
      }catch{
        alert(ERRO)
      }
  }
  if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: tema.fundo }}>
                <ActivityIndicator size="large" color={tema.azul} />
            </SafeAreaView>
        );
    }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f2f2f2" />
      <ScrollView style={styles.content}>
        <View style={styles.contCapa}>
          <Image style={styles.capa}
            source={{ uri: `http://${host}:8000/img/user/imgPosts/${capa}` }}
          />
        </View>
        <View style={styles.infoCont}>
          <View style={styles.tituloCont}>
            <Text style={styles.titulo}>{titulo}</Text>
          </View>
          <View style={styles.infosCont}>
            <View style={styles.infosBox}>
              <View style={styles.imgPerfilCont}>
                <Image style={styles.imgPerfil}
                  source={{ uri: `http://${host}:8000/img/user/fotoPerfil/${imgPerfil}` }}
                />
              </View>
              <View style={styles.IntsInfo}>
                <Text style={styles.nome}>{nome}</Text>
                <Text style={styles.arroba}>@{arroba}</Text>
              </View>
            </View>
            <View style={styles.infosBox}>
              <View style={styles.iconeInfosCont}>
                <Ionicons
                  style={[styles.icon]}
                  name="calendar-clear-outline"
                />
              </View>
              <View style={styles.IntsInfo}>
                <Text style={styles.data}>{dataInicio} até {dataFim}</Text>
              </View>
            </View>
            <View style={styles.infosBox}>
              <View style={styles.iconeInfosCont}>
                <Ionicons
                  style={[styles.icon]}
                  name="link-outline"

                />
              </View>
              <TouchableOpacity style={styles.IntsInfo} onPress={() => abrirLink(link)}>
                <Text style={styles.link}
                  numberOfLines={1}
                  ellipsizeMode="tail">{link}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.buttonsCont}>
            {!proprio ?(
             <TouchableOpacity style={ativo? styles.buttonVazio:styles.buttonAzul} onPress={lembrete}>
              <Text style={{ fontSize: 15, fontWeight: 'bold',  color: ativo ? tema.azul : '#fff'  }}>  {ativo ? 'Desativar lembrete' : 'Ativar lembrete'}</Text>
            </TouchableOpacity> 

            ):null}
            <TouchableOpacity style={[styles.buttonVazio , !proprio ? null :{ width: '100%' }]} onPress={() => abrirLink(link)}>
              <Text style={{ fontSize: 15, fontWeight: 'bold', color: tema.azul }}> Saber mais</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.maisInfo}>
          <Text style={styles.textMaisInfo}>
            Mais informações
          </Text>
          <Text style={styles.desc}>
              {descricao}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

};




