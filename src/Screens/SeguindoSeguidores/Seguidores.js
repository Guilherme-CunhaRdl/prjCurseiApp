import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, ScrollView, FlatList, TouchableOpacity, TextInput, Image, Pressable, ActivityIndicator } from 'react-native';
import styles from './styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import host from '../../global';

import axios from 'axios';


export default function Seguindo({ idPerfil, arroba }) {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [usuarios, setUsuarios] = useState()
  const [perfilProprio, setPerfilProprio] = useState(false)
  const [pesquisa, setPesquisa] = useState('')

  async function removerSeguidor(idUserPerfil) {
    const idUserSalvo = await AsyncStorage.getItem('idUser');
    result = await axios.get(`http://${host}:8000/api/cursei/user/deseguirOuTirarSeguidor/${idUserSalvo}/${idUserPerfil}/removerSeguidor`)
    if (result.data.sucesso) {
      const removerUser = usuarios.filter(item => item.id !== idUserPerfil);
      setUsuarios(removerUser)
    }
  }



  useEffect(() => {
    console.log("Estado atualizado:", usuarios);
  }, [usuarios]);

  useEffect(() => {
        const buscarUsuarios = async () => {
          setLoading(true)
      url = `http://${host}:8000/api/cursei/user/seguidoresSeguindo/${idPerfil}/seguidores`
      response = await axios.get(url)
      setUsuarios(response.data)
      setLoading(false)
      const idUserSalvo = await AsyncStorage.getItem('idUser');
      if (idUserSalvo == idPerfil) {
        setPerfilProprio(true)
      }

 
    }
    const timer = setTimeout(() => {
      if(pesquisa.length>0){
      
        pesquisar(pesquisa); 
      }else{
        buscarUsuarios()
      }
    }, 500); 

    return () => clearTimeout(timer); // Limpa o timer se o usuário continuar digitando
  }, [pesquisa]);
    async function pesquisar(text) {
      
      setLoading(true)
      response = await axios.get(`http://${host}:8000/api/cursei/user/deseguirOuTirarSeguidor/${text}/${idPerfil}/pesquisarSeguidores`)
      setLoading(false)
      setUsuarios(response.data.data)
    }
   
  



  return (
    <View style={styles.container} horizontal={false}>

      <View style={styles.barraContainer}>
        <View style={styles.barraPesquisa}>
          <Ionicons style={styles.inputIcon} name="search-outline"></Ionicons>
          <TextInput
            style={styles.input}
            placeholder="Procurar"
            autoCapitalize="none"
            value={pesquisa}
            onChangeText={setPesquisa}
          />
        </View>
      </View>
      <Text style={styles.titulo}>
        Seguidores de @{arroba} ({usuarios?.length || 0})
      </Text>
      <View style={styles.listaDeContas}>
        {loading ? (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#fff", position: 'fixed', zIndex: 99, width: '100%',height: '70%',backgroundColor:'transparency' }}>
          <ActivityIndicator size="large" color="#3498db" />
        </View>
        ) : null}
                   {usuarios?.length === 0 ? (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#fff", position: 'fixed', zIndex: 99, width: '100%', height: '45%' }}>
                  <Text style={{fontSize:20,color:'#666',fontWeight:600}}>Nenhum usuario encontrado</Text>
                </View>
                ) : null}
        
        <View style={styles.FlatList}>
          <FlatList
            data={usuarios}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              return (
                <View style={styles.conta}>
                  <TouchableOpacity style={styles.contaDireita} onPress={() => {
                    navigation.navigate('Perfil', {
                      idUserPerfil: item.id,
                      titulo: item.arroba_user
                    })
                  }}>
                    <Image source={{ uri: `http://${host}:8000/img/user/fotoPerfil/${item.img_user}` }} style={styles.fotoUsuario} />
                    <View style={styles.infoUser}>
                      <Text style={styles.nomeUser}>{item.nome_user}</Text>
                      <Text style={styles.arroba}>@{item.arroba_user}</Text>
                    </View>
                  </TouchableOpacity>
                  {perfilProprio ? (
                    <TouchableOpacity style={styles.btnX} onPress={() => removerSeguidor(item.id)}>
                      <Ionicons style={styles.btnXicon} name="close-outline"></Ionicons>
                    </TouchableOpacity>

                  ) : null}
                </View>
              )
            }} />
        </View>
      </View>

    </View>
  );
}
