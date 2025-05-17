import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, ScrollView, FlatList, TouchableOpacity, TextInput, Image, Pressable,ActivityIndicator } from 'react-native';
import styles from './styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";

import axios from 'axios';


export default function Seguindo({idPerfil,arroba}) {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [usuarios, setUsuarios] = useState()

 useEffect(() => {
   const buscarUsuarios = async() =>{
    url = `http://localhost:8000/api/cursei/user/seguidoresSeguindo/${idPerfil}/seguidores`
    response = await axios.get(url)
    setUsuarios(response.data)
    setLoading(false)
  }
   buscarUsuarios()

  }, []);
  
  useEffect(() => {
    console.log("Estado atualizado:", usuarios);
  }, [usuarios]);
  return (
    <ScrollView style={styles.container} horizontal={false}>
      
      <View style={styles.barraContainer}>
        <View style={styles.barraPesquisa}>
          <Ionicons style={styles.inputIcon} name="search-outline"></Ionicons>
          <TextInput
            style={styles.input}
            placeholder="Procurar"
            autoCapitalize="none"
          />
        </View>
      </View>
      <Text style={styles.titulo}>Seguidores de @{arroba}</Text>
      <View style={styles.listaDeContas}>
         {loading ? (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#fff", position: 'fixed', zIndex: 99, width: '100%', height: '45%' }}>
                    <ActivityIndicator size="large" color="#3498db" />
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
              <Pressable style={styles.contaDireita}  onPress={() =>{
                  navigation.navigate('Perfil', {
                    idUserPerfil: item.id,
                    titulo: item.arroba_user
                  })}}>
                <Image source={{ uri: `http://localhost:8000/img/user/fotoPerfil/${item.img_user}` }} style={styles.fotoUsuario} />
                <View style={styles.infoUser}>
                  <Text style={styles.nomeUser}>{item.nome_user}</Text>
                  <Text style={styles.arroba}>@{item.arroba_user}</Text>
                </View>
              </Pressable>
              <Pressable style={styles.btnX}>
                <Ionicons style={styles.btnXicon} name="close-outline"></Ionicons>
              </Pressable>
            </View>
            )
          }} />
       </View>
      </View>

    </ScrollView>
  );
}
