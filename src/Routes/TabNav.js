import * as React from 'react';
import { LogBox, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Home from '../Screens/Home';
import Perfil from '../Screens/Perfil';
import Login from '../Screens/Login';
import Curseels from '../Screens/Curtei';
import Explorar from '../Screens/Explorar';
import TopTabs from './TopTab';

import Configuracoes from '../Components/Configurações/configuracoes'
import DenunciaConcluida from '../Components/Configurações/denunciaConcluida';
import Conversa from '../Components/Chat/src/screens/Conversa';
import Mensagens from '../Components/Chat/src/screens/Mensagens';


const Tab = createBottomTabNavigator();

function ViewPost() {
  return (
    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
      <Text>ViewPost</Text>
    </View>
  )
}
const TabNav = () => {
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
          } else if (route.name === 'pesquisa') {
            nomeIcone = focused ? 'search' : 'search-outline'
          } else if (route.name === 'post') {
            nomeIcone = focused ? 'paper-plane' : 'paper-plane-outline'
          }
          else if (route.name === 'add') {
            nomeIcone = focused ? 'add' : 'add-outline'
          }
          else if (route.name === 'user') {
            nomeIcone = focused ? 'person-circle' : 'person-circle-outline'
          }

          return <Ionicons name={nomeIcone} size={size} color={color} />

        }
      })
      }
    >
      <Tab.Screen name='home' component={Home} />
      <Tab.Screen name='post' component={Mensagens} />
      <Tab.Screen name='add' component={Curseels} />
      <Tab.Screen name='pesquisa' component={Explorar} />
      <Tab.Screen name='user' component={Perfil} />

    </Tab.Navigator>
  );
}
export default TabNav
