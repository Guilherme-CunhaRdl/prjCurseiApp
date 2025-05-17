import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import TabNav from "./TabNav";
import Home from "../Screens/Home";
import Login from "../Screens/Login";
import { SafeAreaView, View, Text, ScrollView, TouchableOpacity, Image, StatusBar, Pressable } from 'react-native';

import Seguindo from "../Screens/SeguindoSeguidores/Seguindo";
import Seguidores from "../Screens/SeguindoSeguidores/Seguidores"
const Top = createMaterialTopTabNavigator();

const SeguidoresSeguindoTab = ({ idPerfil,arroba,pagina}) => {
  return (
    <Top.Navigator initialRouteName={pagina === 'seguidores' ? 'Seguidores' : 'Seguindo'}>
      <Top.Screen
        name="Seguindo"
        children={() => <Seguindo idPerfil={idPerfil} arroba={arroba} />}
      />
      <Top.Screen
        name="Seguidores"
        children={() => <Seguidores idPerfil={idPerfil} arroba={arroba}/>}
      />
    </Top.Navigator>
  );
};
export default SeguidoresSeguindoTab