import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  TextInput,
  Pressable
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from "@react-navigation/native";
import host from '../../global';
export default function Interesse() {
  const [interessesSelecionados, setInteressesSelecionados] = useState([]);
  const [banner, setBanner] = useState('');
  const [userImg, setUserImg] = useState('');
  const interesses = [
    'Tecnologia', 'Saúde', 'Design', 'Artes',
    'Engenharia', 'Esportes', 'Ciências', 'Línguas','Administração','Marketing','Nutrição'
  ];

  const toggleInteresse = (item) => {
    if (interessesSelecionados.includes(item)) {
      setInteressesSelecionados(interessesSelecionados.filter(i => i !== item));
    } else {
      setInteressesSelecionados([...interessesSelecionados, item]);
    }

  };
  async function salvar() {
    console.log(interessesSelecionados)
    const idUserSalvo = await AsyncStorage.getItem('idUser');

    const InteressesUser ={
      idUser : idUserSalvo,
      escolhas :interessesSelecionados
    }
    Response = await axios.post(`http://${host}:8000/api/user/escolherInteresesses`,InteressesUser)
    if(Response.data.sucesso){
      navigation.navigate('Home')
    }
  }
  async function buscarUser() {
    const idUserSalvo = await AsyncStorage.getItem('idUser');
    const resultados = await axios.get(`http://${host}:8000/api/cursei/user/${idUserSalvo}/0`);
    console.log(resultados)
    var data = resultados.data;
    setUserImg(data.User.img_user);
    setBanner(data.User.banner_user);
  }

  const navigation = useNavigation();
  useEffect(() => {
    buscarUser()
    console.log(userImg)

  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.capa}>
        <Image
          style={styles.banner}
          source={banner !== null ? { uri: `http://${host}:8000/img/user/bannerPerfil/${banner}` } : require('../../../assets/itauLogo.png')}
        />
      </View>

      <View >
        <Image style={styles.user}

          source={userImg !== null ? { uri: `http://${host}:8000/img/user/fotoPerfil/${userImg}` } : require('../../../assets/jovem.jpeg')}
        />
      </View>

      <View style={styles.cadastro}>
        <Text style={styles.titulo}>Seus Interesses</Text>
        <Text style={styles.subtitulo}>Selecione pelo menos 1 para personalizar sua experiência</Text>

        <View style={styles.grid}>
          {interesses.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.interesseButton,
                interessesSelecionados.includes(item) && styles.interesseSelecionado
              ]}
              onPress={() => toggleInteresse(item)}
            >
              <View style={styles.iconContainer}>
                <Icon
                  name="award"
                  size={16}
                  color={interessesSelecionados.includes(item) ? '#fff' : '#4B97FF'}
                />
              </View>
              <Text style={[
                styles.interesseText,
                interessesSelecionados.includes(item) && styles.textoSelecionado
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {interessesSelecionados[0] ? (
          <Pressable style={styles.btFinalizar}
            onPress={() => salvar()}
          >
            <Text style={styles.buttomText}>Salvar</Text>
          </Pressable>


        ) : <Pressable style={[styles.btFinalizar, { opacity: 0.3 }]}
          onPress={() => salvar()}
        >
          <Text style={styles.buttomText}>Salvar</Text>
        </Pressable>}

        {/* <Pressable style={styles.btVoltar}
          onPress={() => navigation.navigate('Cadastro')}
        >
          <Icon name="arrow-left" size={16} color="#4B97FF" />
          <Text style={styles.voltarText}>Voltar</Text>
        </Pressable> */}
      </View>
    </ScrollView>
  );
}