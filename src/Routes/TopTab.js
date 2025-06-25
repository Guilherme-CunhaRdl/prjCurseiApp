import React from 'react';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ParaVoce from "../Screens/Explorar/ParaVocê";
import Assuntos from "../Screens/Explorar/Assuntos";
import { useTema } from '../context/themeContext';

const Top = createMaterialTopTabNavigator();

const TopTabs = () => {
  const { tema } = useTema();

  return (
    <Top.Navigator
      screenOptions={{
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '600',
          textTransform: 'none',
          color: tema.texto, 
        },
        tabBarStyle: {
          backgroundColor: tema.fundo, 
        },
        tabBarIndicatorStyle: {
          backgroundColor: tema.azul, 
        },
      }}
    >
      <Top.Screen
        name="Para Você"
        component={ParaVoce}
      />
      <Top.Screen
        name="Assuntos do Momento"
        component={Assuntos}
      />
    </Top.Navigator>
  );
};

export default TopTabs;
