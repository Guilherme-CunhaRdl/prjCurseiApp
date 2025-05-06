import React from "react";
import {
  SafeAreaView,
  View,
  Text,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";

export default function ConfigsUser() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.configs}>

        {/* Sua conta */}
        <View style={{ gap: 2 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap:10 }}>
            <AntDesign name="user" style={{ color: "#448FFF", fontSize: 25, marginRight: 8 }} />
            <Text style={styles.textoTitulo}>Sua conta</Text>
          </View>
          <Text style={styles.textoDescricao}>Veja as informações sobre sua conta.</Text>
        </View>


        <View style={{ gap: 2 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap:10 }}>
            <Feather name="lock" style={{ color: "#448FFF", fontSize: 25, marginRight: 8 }} />
            <Text style={styles.textoTitulo}>Segurança</Text>
          </View>
          <Text style={styles.textoDescricao}>Gerencie a segurança de sua conta.</Text>
        </View>

        <View style={{ gap: 2 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap:10 }}>
            <Feather name="shield" style={{ color: "#448FFF", fontSize: 25, marginRight: 8 }} />
            <Text style={styles.textoTitulo}>Privacidade</Text>
          </View>
          <Text style={styles.textoDescricao}>Gerencie as informações que vê e compartilha.</Text>
        </View>


        <View style={{ gap: 2 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap:10 }}>
            <Feather name="bell" style={{ color: "#448FFF", fontSize: 25, marginRight: 8 }} />
            <Text style={styles.textoTitulo}>Notificações</Text>
          </View>
          <Text style={styles.textoDescricao}>Configure as notificações que recebe.</Text>
        </View>


        <View style={{ gap: 2 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap:10 }}>
            <FontAwesome6 name="hand" style={{ color: "#448FFF", fontSize: 25, marginRight: 8 }} />
            <Text style={styles.textoTitulo}>Acessibilidade e idiomas</Text>
          </View>
          <Text style={styles.textoDescricao}>
            Configure a forma de como o conteúdo será apresentado pra você.
          </Text>
        </View>


        <View style={{ gap: 2  }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap:10 }}>
            <FontAwesome6 name="school-flag" style={{ color: "#F29500", fontSize: 25, marginRight: 8 }} />
            <Text style={styles.textoTituloInstitucional}>Conta institucional</Text>
          </View>
          <Text style={styles.textoDescricao}>
            Torne-se uma Instituição em nosso aplicativo.
          </Text>
        </View>

      </View>
    </SafeAreaView>
  );
}
