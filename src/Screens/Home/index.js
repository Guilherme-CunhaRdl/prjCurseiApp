// App.js
import React from "react";
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
import { FlatList } from "react-native-web";
import userIMG from "../../../assets/userIMG.png";
import itauLogo from "../../../assets/itauLogo.png";
import etecLogo from "../../../assets/etecLogo.jpg";
import fabricaLogo from "../../../assets/fabricaLogo.jpeg";
import Post from "../../Components/Post";

import { useNavigation } from "@react-navigation/native";

const DATA = [
  {
    id: Math.random().toString(36).substring(2, 27),
    photoURL: userIMG,
    nome: "Seu Story",
  },
  {
    id: Math.random().toString(36).substring(2, 27),
    photoURL: itauLogo,
    nome: "Itau",
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
    photoURL: userIMG,
  },
  {
    id: Math.random().toString(36).substring(2, 27),
    photoURL: userIMG,
  },
];

export default function Home() {

  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      {/* Feed Content */}
      <ScrollView style={styles.ContainerCont}>
        {/*Header*/}
        <View style={styles.Header}>
          {/*View informações user*/}
          <View style={styles.userContainer}>
            <View style={styles.infoUser}>
              <Text style={styles.textUser}>Olá, Usuário(a)!</Text>
              <View style={styles.notifyContainer}>
                <Pressable style={styles.notifyUser}
                  onPress={() => navigation.navigate('Notificacoes')}
                >
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
              keyExtractor={(item) => item.id}
              renderItem={(item) => (
                <View style={styles.storys}>
                  <Pressable style={styles.circuloStorys}>
                    <Image style={styles.imgLogo} source={item.item.photoURL} />
                  </Pressable>
                  <View style={styles.nomeStorys}>
                    <Text>{item.item.nome}</Text>
                  </View>
                </View>
              )}
            />
          </View>
        </View>
        <View style={styles.feedContainer}>
          {/*Posts*/}
          <View style={styles.postContainer}>
            <Post />
          </View>
        </View>
      </ScrollView>
      {/* Send Button */}
      <TouchableOpacity style={styles.sendButton}>
        <Icon name="send" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
