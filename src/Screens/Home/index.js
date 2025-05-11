// App.js
import React, { useState,useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Pressable,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from "./styles";
import etecLogo from "../../../assets/etecLogo.jpg";
import { FlatList } from "react-native";
import adicionarLogo from "../../../assets/adicionarLogo.png";
import fabricaLogo from "../../../assets/fabricaLogo.jpeg";
import Post from "../../Components/Post";
import ModalPostagem from "../../Components/ModalPostagem";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const DATA = [
  {
    id: Math.random().toString(36).substring(2, 27),
    photoURL: adicionarLogo,
    nome: "Seu Story", 
  },
  {
    id: Math.random().toString(36).substring(2, 27),
    photoURL: 'https://th.bing.com/th/id/OIP.YmtJRv73dOTsmE6c2alf9AHaHa?rs=1&pid=ImgDetMain',
    nome: "Bradesco",
  },
  {
    id: Math.random().toString(36).substring(2, 27),
    photoURL: etecLogo,
    nome: "Etec",
  },
  {
    id: Math.random().toString(36).substring(2, 27),
    photoURL: fabricaLogo,
    nome: "Cultura",
  },
  {
    id: Math.random().toString(36).substring(2, 27),
    photoURL: 'https://th.bing.com/th/id/OIP.5YdHzgQhfS1mFfUOpVXeUAHaHa?rs=1&pid=ImgDetMain', 
    nome: "X",
  },
  {
    id: Math.random().toString(36).substring(2, 27),
    photoURL: 'https://akamai.sscdn.co/uploadfile/letras/fotos/c/a/5/2/ca52b9aff9234ab34a4f36fa8acdf91f.jpg',
    nome: "Plumas",
  },
];

export default function Home() {
  const navigation = useNavigation();
  async function verificarInteresses() {
    const idUserSalvo = await AsyncStorage.getItem('idUser');
    Response = await axios.get(`http://localhost:8000/api/user/verificarInteresses/${idUserSalvo}`)
    if(!Response.data.resultado){
      navigation.navigate('Interesse')
    }
  }


  useEffect(() => {
  verificarInteresses()
  }, []);


  return (
    <SafeAreaView style={styles.container}>
      {/* Feed Content */}
      <View style={styles.ContainerCont}>
        {/*Header*/}
        <View style={styles.Header}>
          {/*View informações user*/}
          <View style={styles.userContainer}>
            <View style={styles.infoUser}>
              <Text style={styles.textUser}>Olá, Usuário(a)!</Text>
              <View style={styles.notifyContainer}>
                <Pressable style={styles.notifyUser}
                  onPress={() => navigation.navigate('Notificacoes')}>
                  <Ionicons
                    style={styles.notifyIcon}
                    name="notifications-outline"
                  ></Ionicons>
                </Pressable>
                <View style={styles.logoCursei}>
                  <Image
                    style={styles.curseiIcon}
                    source={require("../../../assets/curseiLogo.png")}
                  />
                </View>
              </View>
            </View>
            <View style={styles.msgUser}>
              <Text style={styles.textInicio}>Bem Vindo de Volta</Text>
            </View>
          </View>
          {/*View Storys*/}
          <View style={styles.storysContainer}>
            <FlatList
              horizontal={true}
              data={DATA}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              renderItem={(item) => (
                <View style={styles.storys}>
                  <Pressable style={styles.circuloStorys}>
                    <Image style={styles.imgLogo} source={item.item.photoURL} />
                  </Pressable>
                  <View>
                    <Text style={styles.nomeStorys}>{item.item.nome}</Text>
                  </View>
                </View>
              )}
            />
          </View>
        </View>
        <View style={styles.feedContainer}>
          {/*Posts*/}
          <View style={styles.postContainer}>
            <Post/>
          </View>
        </View>
      </View>
      {/* Send Button */}
   <ModalPostagem/>
    </SafeAreaView>
  );
}