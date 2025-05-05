import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TabNav from './TabNav';
import Login from '../Screens/Login';
import Cadastro from '../Screens/Cadastro';
import Interesse from '../Screens/Interesse';
import Conversa from '../Components/Chat/src/screens/Conversa';
import AddConversa from '../Components/Chat/src/screens/AdicionarConversa';
import Notificacoes from '../Components/Chat/src/screens/Notificacoes';


const Stack = createNativeStackNavigator();

export default function StackRoutes() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AddConversa"
        component={AddConversa}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Home"
        component={TabNav}
        options={{
          headerShown: false,
        }}
      />

      

      <Stack.Screen
        name="Perfil"
        component={TabNav}
        options={{
          //configuração Cabeçalho
          headerStyle: { backgroundColor: "#32CD32" },
          headerTintColor: "#FFFFFF",
        }}
      />

      <Stack.Screen
        name="Cadastro"
        component={Cadastro}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Interesse"
        component={Interesse}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Conversa"
        component={Conversa}
        options={{
          headerShown: false,
        }}
      />


      <Stack.Screen
        name="Notificacoes"
        component={Notificacoes}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>

  );
} 