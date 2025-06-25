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
          <Feather name="moon" style={styles.icone} />
          <Text style={styles.textoTitulo}>Tema escuro (beta)</Text>
        </View>
        <Switch
          value={modoEscuro}
          onValueChange={alternarTema}
          trackColor={{ false: tema.switchTrack, true: tema.switchTrack }}
          thumbColor={modoEscuro ? tema.switchThumbEscuro : tema.switchThumbClaro}
        />
      </View>

      {/* Conta */}
      <TouchableOpacity style={{ gap: 2 }} onPress={() => navigation.navigate('Informações da conta')}>
        <View style={styles.grupoIconeTexto}>
          <AntDesign name="user" style={[styles.icone, { color: tema.azul }]} />
          <Text style={[styles.textoTitulo, { color: tema.azul }]}>Sua conta</Text>
        </View>
        <Text style={styles.textoDescricao}>Veja e altere as informações da sua conta.</Text>
      </TouchableOpacity>

      {/* Segurança */}
      <TouchableOpacity style={{ gap: 2 }} onPress={() => navigation.navigate('Segurança')}>
        <View style={styles.grupoIconeTexto}>
          <Feather name="lock" style={[styles.icone, { color: tema.azul }]} />
          <Text style={styles.textoTitulo}>Segurança</Text>
        </View>
        <Text style={styles.textoDescricao}>Gerencie a segurança de sua conta.</Text>
      </TouchableOpacity>

      {/* Conta institucional */}
      <TouchableOpacity style={{ gap: 2 }} onPress={() => navigation.navigate("Conta Institucional")}>
        <View style={styles.grupoIconeTexto}>
          <FontAwesome6 name="school-flag" style={[styles.icone, { color: tema.laranja }]} />
          <Text style={styles.textoTituloInstitucional}>Conta institucional</Text>
        </View>
        <Text style={styles.textoDescricao}>
          Torne-se uma Instituição em nosso aplicativo.
        </Text>
      </TouchableOpacity>

      {/* Logoff */}
      <TouchableOpacity style={{ gap: 2 }} onPress={fazerLogoff}>
        <View style={styles.grupoIconeTexto}>
          <FontAwesome6 name="door-open" style={[styles.icone, { color: tema.vermelho }]} />
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