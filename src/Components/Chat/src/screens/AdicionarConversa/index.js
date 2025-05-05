import styles from "./styles";
import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  Pressable,
  ScrollView,
} from "react-native";
import {
  Appbar,
  IconButton,
  Provider as PaperProvider,
  SegmentedButtons,
} from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from "../../../../../colors";

export default function AddConversa() {
  const navigation = useNavigation();


    const [focoInput, setFocoInput] = useState(false)

    const alterarFoco = (campo) =>{
        setFocoInput(campo)
    }

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <View style={styles.container}>
          <Appbar.Header style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={require("../../img/voltar.png")}
                style={styles.iconSmall}
              />
            </TouchableOpacity>
            <Appbar.Content
              title="Nova Mensagem"
              titleStyle={{ color: "black", fontWeight: 600, fontSize: 20 }}
            />
          </Appbar.Header>

            <View style={styles.customSearchbar}>
                        <Image
                          source={require('../../img/search.png')} 
                          style={styles.searchIcon}
                        />
                        {/*Barra de pesquisa que troquei pq o do Paper é chei de viadage pra personalizar*/}
                        <TextInput
                          placeholder="Buscar Usuario..."
                          placeholderTextColor="#A7A7A7"
                          onFocus={() => alterarFoco('buscar')}
                           underlineColorAndroid="transparent"
                          style={[styles.customSearchInput,  focoInput === 'buscar' && {borderWidth: 0, borderColor: 'transparent'} ]}
                        />
            </View> 
            
            <View>
                <View>

                </View>
                <View style={styles.containerAddGrupo}>
                <View style={styles.boxAddGrupo}>
                    <View style={styles.conteudoIcone}>
                        <View style={styles.boxIcone}>
                            <Icon style={styles.iconeAdd} name='chat-plus-outline' />
                        </View>
                    </View>
                    <View style={styles.conteudoTexto}>
                        <View style={{paddingTop: 7}}>
                            <Text style={{fontWeight: 500}}>Adicionar novo Grupo</Text>
                        </View>
                        <View >
                            <Text style={{fontSize: 12, color: colors.cinza, paddingRight: 30}}>Adicione uma nova conversa ao seu Bate Papo!</Text>
                        </View>
                    </View>
                </View>
                </View>
                <View style={styles.containerAddUsuario}>
                <View style={{width: '100%', paddingLeft: 25}}>
                  <Text style={{fontWeight: 500}}>Seguidores</Text>
                </View>
                <View style={styles.boxAddUsuario}>
                    <View style={[styles.conteudoIcone, {marginRight: 8}]}>
                        <View style={styles.boxIcone}>
                            <Image style={styles.imgUsuario} source={require("../../../../../../assets/fabricaLogo.jpeg")} />
                        </View>
                    </View>
                    <View style={styles.conteudoTexto}>
                        <View style={{paddingTop: 7}}>
                            <Text style={{fontWeight: 500}}>Sla</Text>
                        </View>
                        <View >
                            <Text style={{fontSize: 12, color: colors.cinza}}>@Sla</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.boxAddUsuario}>
                    <View style={[styles.conteudoIcone, {marginRight: 8}]}>
                        <View style={styles.boxIcone}>
                            <Image style={styles.imgUsuario} source={require("../../../../../../assets/itauLogo.png")} />
                        </View>
                    </View>
                    <View style={styles.conteudoTexto}>
                        <View style={{paddingTop: 7}}>
                            <Text style={{fontWeight: 500}}>Itau</Text>
                        </View>
                        <View >
                            <Text style={{fontSize: 12, color: colors.cinza}}>@Itau</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.boxAddUsuario}>
                    <View style={[styles.conteudoIcone, {marginRight: 8}]}>
                        <View style={styles.boxIcone}>
                            <Image style={styles.imgUsuario} source={require("../../../../../../assets/etecLogo.jpg")} />
                        </View>
                    </View>
                    <View style={styles.conteudoTexto}>
                        <View style={{paddingTop: 7}}>
                            <Text style={{fontWeight: 500}}>Etec</Text>
                        </View>
                        <View >
                            <Text style={{fontSize: 12, color: colors.cinza}}>@Arroba</Text>
                        </View>
                    </View>
                </View>

                <View style={{width: '100%', paddingLeft: 25, marginTop: 20}}>
                  <Text style={{fontWeight: 500}}>Sugestões</Text>
                </View>
                <View style={styles.boxAddUsuario}>
                    <View style={[styles.conteudoIcone, {marginRight: 8}]}>
                        <View style={styles.boxIcone}>
                            <Image style={styles.imgUsuario} source={require("../../../../../../assets/fabricaLogo.jpeg")} />
                        </View>
                    </View>
                    <View style={styles.conteudoTexto}>
                        <View style={{paddingTop: 7}}>
                            <Text style={{fontWeight: 500}}>Sla</Text>
                        </View>
                        <View >
                            <Text style={{fontSize: 12, color: colors.cinza}}>@Sla</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.boxAddUsuario}>
                    <View style={[styles.conteudoIcone, {marginRight: 8}]}>
                        <View style={styles.boxIcone}>
                            <Image style={styles.imgUsuario} source={require("../../../../../../assets/itauLogo.png")} />
                        </View>
                    </View>
                    <View style={styles.conteudoTexto}>
                        <View style={{paddingTop: 7}}>
                            <Text style={{fontWeight: 500}}>Itau</Text>
                        </View>
                        <View >
                            <Text style={{fontSize: 12, color: colors.cinza}}>@Itau</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.boxAddUsuario}>
                    <View style={[styles.conteudoIcone, {marginRight: 8}]}>
                        <View style={styles.boxIcone}>
                            <Image style={styles.imgUsuario} source={require("../../../../../../assets/etecLogo.jpg")} />
                        </View>
                    </View>
                    <View style={styles.conteudoTexto}>
                        <View style={{paddingTop: 7}}>
                            <Text style={{fontWeight: 500}}>Etec</Text>
                        </View>
                        <View >
                            <Text style={{fontSize: 12, color: colors.cinza}}>@Arroba</Text>
                        </View>
                    </View>
                </View>

                </View>
            </View>

        </View> 
      </PaperProvider>
    </SafeAreaProvider>
  );
}
