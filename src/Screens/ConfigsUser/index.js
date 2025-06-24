import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Switch,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";

import { useTema } from "../../context/themeContext"; 
import criarEstilos from "./styles";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ConfigsUser() {
  const navigation = useNavigation();

  const { tema, modoEscuro, alternarTema } = useTema(); 
  const styles = criarEstilos(tema);

  const fazerLogoff = async () => {
    await AsyncStorage.clear();
    navigation.navigate("Login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.configs}>

        {/* Switch de Tema */}
        <View style={styles.linhaConfig}>
          <View style={styles.grupoIconeTexto}>
            <Feather name="moon" style={[styles.icone, { color: tema.icone }]} />
            <Text style={styles.textoTitulo}>Tema escuro</Text>
          </View>
          <Switch
            value={modoEscuro}
            onValueChange={alternarTema}
            trackColor={{ false: tema.switchTrack, true: tema.switchTrack }}
            thumbColor={modoEscuro ? tema.switchThumbEscuro : tema.switchThumbClaro}
          />
        </View>

        {/* Opções */}
        <TouchableOpacity style={{ gap: 2 }} onPress={() => navigation.navigate('Informações da conta')}>
          <View style={styles.grupoIconeTexto}>
            <AntDesign name="user" style={[styles.icone, { color: tema.azul }]} />
            <Text style={[styles.textoTitulo, { color: tema.azul, marginLeft: 8 }]}>Sua conta</Text>
          </View>
          <Text style={styles.textoDescricao}>Veja e altere as informações da sua conta.</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ gap: 2 }} onPress={() => navigation.navigate('Segurança')}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Feather name="lock" style={{ color: tema.azul, fontSize: 25, marginRight: 8 }} />
            <Text style={styles.textoTitulo}>Segurança</Text>
          </View>
          <Text style={styles.textoDescricao}>Gerencie a segurança de sua conta.</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ gap: 2 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Feather name="shield" style={{ color: tema.azul, fontSize: 25, marginRight: 8 }} />
            <Text style={styles.textoTitulo}>Privacidade</Text>
          </View>
          <Text style={styles.textoDescricao}>Gerencie as informações que vê e compartilha.</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ gap: 2 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Feather name="bell" style={{ color: tema.azul, fontSize: 25, marginRight: 8 }} />
            <Text style={styles.textoTitulo}>Notificações</Text>
          </View>
          <Text style={styles.textoDescricao}>Configure as notificações que recebe.</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ gap: 2 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <FontAwesome6 name="hand" style={{ color: tema.azul, fontSize: 25, marginRight: 8 }} />
            <Text style={styles.textoTitulo}>Acessibilidade e idiomas</Text>
          </View>
          <Text style={styles.textoDescricao}>
            Configure a forma de como o conteúdo será apresentado pra você.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ gap: 2 }} onPress={() => navigation.navigate("Conta Institucional")}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <FontAwesome6 name="school-flag" style={{ color: tema.laranja, fontSize: 25, marginRight: 8 }} />
            <Text style={styles.textoTituloInstitucional}>Conta institucional</Text>
          </View>
          <Text style={styles.textoDescricao}>
            Torne-se uma Instituição em nosso aplicativo.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ gap: 2 }} onPress={fazerLogoff}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <FontAwesome6 name="door-open" style={{ color: tema.vermelho, fontSize: 25, marginRight: 8 }} />
            <Text style={styles.textoTituloLogoff}>Logoff</Text>
          </View>
          <Text style={styles.textoDescricao}>
            Você sairá da sua conta.
          </Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}
