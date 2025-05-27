
import { LogBox, Text, View, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { useTema } from '../context/themeContext';
import Home from '../Screens/Home';
import Perfil from '../Screens/Perfil';
import Login from '../Screens/Login';
import Curtei from '../Screens/Curtei';
import Explorar from '../Screens/Explorar';
import TopTabs from './TopTab';

import Configuracoes from '../Components/Configurações/configuracoes'
import DenunciaConcluida from '../Components/Configurações/denunciaConcluida';
import Conversa from '../Components/Chat/src/screens/Conversa';
import Mensagens from '../Components/Chat/src/screens/Mensagens';
import host from '../global';

const Tab = createBottomTabNavigator();

async function ViewPost() {

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
      <Text>ViewPost</Text>
    </View>
  )
}
const TabNav = () => {
  const { tema} = useTema();
  const [imgPerfil, setImgPerfil] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('imgUser').then((img) => {
      setImgPerfil(img);
    });
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: tema.barra,
          borderTopColor: 'transparent',
          height: 60,
        },
        tabBarActiveTintColor: tema.iconeAtivo,
        tabBarInactiveTintColor: tema.iconeInativo,
        tabBarIcon: ({ focused, color, size }) => {
          let nomeIcone;

          if (route.name === 'home') {
            nomeIcone = focused ? 'home' : 'home-outline';
          } else if (route.name === 'pesquisa') {
            nomeIcone = focused ? 'search' : 'search-outline';
          } else if (route.name === 'post') {
            nomeIcone = 'chatbubbles-outline';

            return <Ionicons name={nomeIcone} size={size} color={color} />;
          } else if (route.name === 'albums') {
            nomeIcone = focused ? 'albums' : 'albums-outline';
            return <Ionicons name={nomeIcone} size={size} color={color} />;
          } else if (route.name === 'user') {
          } else if (route.name === 'add') {
            nomeIcone = focused ? 'add' : 'add-outline';
          }

          if (route.name === 'user') {
            return (
              <Image
                source={
                  imgPerfil !== null
                    ? { uri: `http://${host}:8000/img/user/fotoPerfil/${imgPerfil}` }
                    : require('../../assets/userDeslogado.png')
                }
                style={{
                  marginTop: 3,
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  borderWidth: 2,
                  borderColor: focused ? tema.iconeAtivo : 'transparent',
                }}
              />
            );
          }

          return <Ionicons name={nomeIcone} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name='home' component={Home} />
      <Tab.Screen name='post' component={Mensagens} />
      <Tab.Screen name='albums' component={Curtei} />
      <Tab.Screen name='pesquisa' component={Explorar} />
      <Tab.Screen name='user' component={Perfil} />
    </Tab.Navigator>
  );
};

export default TabNav
