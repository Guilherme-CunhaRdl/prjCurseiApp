
import { LogBox, Text, View, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';

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


const Tab = createBottomTabNavigator();

async function ViewPost() {

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
      <Text>ViewPost</Text>
    </View>
  )
}
const TabNav = () => {
  const [imgPefil, setImgPerfil] = useState('')
  async function carregarImg() {
    const img = await AsyncStorage.getItem('imgUser')
    setImgPerfil(img)

  }
  carregarImg()
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: { display: 'flex' },
        tabBarIcon: ({ focused, color, size }) => {
          let nomeIcone;

          if (route.name === 'home') {
            nomeIcone = focused ? 'home' : 'home-outline';
            return <Ionicons name={nomeIcone} size={size} color={color} />;
          } else if (route.name === 'pesquisa') {
            nomeIcone = focused ? 'search' : 'search-outline';
            return <Ionicons name={nomeIcone} size={size} color={color} />;
          } else if (route.name === 'post') {
            nomeIcone = 'chatbubbles-outline';
            return <Ionicons name={nomeIcone} size={size} color={color} />;
          } else if (route.name === 'add') {
            nomeIcone = focused ? 'add' : 'add-outline';
            return <Ionicons name={nomeIcone} size={size} color={color} />;
          } else if (route.name === 'user') {
            return (
              <Image
                source={imgPefil !== null ? { uri: `http://localhost:8000/img/user/fotoPerfil/${imgPefil}` } : require('../../assets/userDeslogado.png')} 
                style={{
                  marginTop:3,
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  borderWidth: focused ? 1 : 1,
                  borderColor: focused ? color : 'transparent',
                 
                }}
              />
            );
          }
        }
      })}
    >
      <Tab.Screen name='home' component={Home} />
      <Tab.Screen name='post' component={Mensagens} />
      <Tab.Screen name='add' component={Curtei} />
      <Tab.Screen name='pesquisa' component={Explorar} />
      <Tab.Screen name='user' component={Perfil} />

    </Tab.Navigator>
  );
}
export default TabNav
