import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTema } from '../context/themeContext';

import TabNav from './TabNav';
import Login from '../Screens/Login';
import Cadastro from '../Screens/Cadastro';
import Interesse from '../Screens/Interesse';
import Conversa from '../Components/Chat/src/screens/Conversa';
import AddConversa from '../Components/Chat/src/screens/AdicionarConversa';
import Notificacoes from '../Components/Chat/src/screens/Notificacoes';
import ConfigsUser from '../Screens/ConfigsUser';
import VirarInstituicao from '../Screens/VirarInstituicao';
import Seguranca from '../Screens/ConfigsUser/segurancaUser.js';
import alterarUser from '../Screens/ConfigsUser/alterarUser.js';
import Perfil from '../Screens/Perfil';
import Splash from '../Components/splesh.js';
import DoisFatores from '../Screens/Login/doisfatores.js';
import CriarCurteis from '../Screens/Curtei/CriarCurteis.js';
import postUnico from '../Screens/PostUnico';
import TelaPesquisa from '../Screens/Explorar/TelaPesquisa/index.js';
import host from '../global.js';
import SeguindoSeguidores from '../Screens/SeguindoSeguidores';
import Story from '../Screens/Story/index.js';
import CriarStorys from '../Screens/Story/CriarStorys.js';
import Destaques from '../Screens/Destaque/index.js';
import CriarDestaques from '../Screens/Destaque/CriarDestaques.js';
import Evento from '../Screens/evento';
import SelecionarCapa from '../Screens/Destaque/SelecionarCapa.js';
import videoDestaque from '../Screens/Destaque/index.js';
import PlayerCurtel from '../Components/PlayerCurtei.js';

const Stack = createNativeStackNavigator();

export default function StackRoutes() {
    const { tema } = useTema();

  return (
    <Stack.Navigator
          screenOptions={{
        headerStyle: {
          backgroundColor: tema.fundo,
        },
        headerTitleStyle: {
          color: tema.texto,
        },
        headerTintColor: tema.texto, 
      }}

    >
   
       <Stack.Screen
        name="Splash"
        component={Splash}
        options={{
          headerShown: false,
        }}
      />

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
        name="PlayerCurtel" 
        component={PlayerCurtel} 
        options={{ headerShown: false }} 
      />

      <Stack.Screen
        name="Home"
        component={TabNav}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="user"
        component={Perfil}
        options={{
          headerShown: false,
        }}
      />


      <Stack.Screen
        name="Perfil"
        component={Perfil}
        options={({ route }) => ({
          title: route.params?.titulo || "Perfil",
          headerShown: false,
        })}
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

      <Stack.Screen
        name="Configurações"
        component={ConfigsUser}
      />

      <Stack.Screen
        name="Conta Institucional"
        component={VirarInstituicao}
      />
      <Stack.Screen
        name="Segurança"
        component={Seguranca}

      />
      <Stack.Screen
        name="Informações da conta"
        component={alterarUser}

        />

      <Stack.Screen
        name="DoisFatores"
        component={DoisFatores}

      />

      <Stack.Screen
        name="CriarCurteis"
        component={CriarCurteis}
        options={{
          headerTitle: () => (
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#000'
            }}>
              Crie um Curtei!
            </Text>
          ),
          headerTitleAlign: 'center',
        }}
      />
      
      <Stack.Screen
        name="CriarStorys"
        component={CriarStorys}
        options={{
          headerTitle: () => (
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#000'
            }}>
              Crie um Story!
            </Text>
          ),
          headerTitleAlign: 'center',
        }}
      />

      <Stack.Screen
        name="Story"
        component={Story}
        options={{
          headerShown: false,
        }}
      />



      <Stack.Screen
        name="SeguindoSeguidores"
        component={SeguindoSeguidores}
        options={({ route }) => ({
          title: route.params?.titulo || "Perfil",
          headerShown: true,
        })}
      />
      <Stack.Screen
        name="PostUnico"
        component={postUnico}
        options={({ route }) => ({
          title: `post de @${route.params?.titulo}` || "Perfil", 
          headerShown: true,
        })}
      />

      <Stack.Screen
        name="Pesquisar"
        component={TelaPesquisa}
        options={{
          headerShown: false,
          
        }}
      />

      <Stack.Screen
        name="Destaques"
        component={Destaques}
        options={{
          headerShown: false,
          
        }}
      />
      <Stack.Screen
        name="videoDestaque"
        component={videoDestaque}
        options={{
          headerShown: false,
          
        }}
      />

      <Stack.Screen
        name="SelecionarCapa"
        component={SelecionarCapa}
        options={{
          headerTitle: () => (
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#000'
            }}>
              Selecione uma capa para o seu destaque!
            </Text>
          ),
          headerTitleAlign: 'center',
        }}
      />

    <Stack.Screen
      name="CriarDestaques"
      component={CriarDestaques}
      options={({ navigation, route }) => ({
        headerTitle: () => (
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000' }}>
            Adicione um Destaque!
          </Text>
        ),
        headerTitleAlign: 'center',
        headerRight: () => (
          route.params?.selectedCount > 0 && (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('SelecionarCapa', {
                  selectedItems: route.params.selectedItems,
                  itemsData: route.params.itemsData,
                });
              }}
            >
              <Text style={{ color: '#3897f0', fontWeight: '600' }}>
                Próximo ({route.params.selectedCount})
              </Text>
            </TouchableOpacity>
          )
        )
      })}
    />

      <Stack.Screen
        name="Evento"
        component={Evento}
           options={({ route }) => ({
          title: `Evento de @${route.params?.titulo}` || "Perfil",
          headerShown: true,
        })}
      />

    </Stack.Navigator>

  );
}