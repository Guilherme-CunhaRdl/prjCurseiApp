import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, StatusBar, Image, TouchableOpacity } from 'react-native';
import host from '../../global';
import { useTema } from '../../context/themeContext';
import getStyles from './styles';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from 'react-native';
import { Linking } from 'react-native';

export default function Home() {
  const { tema } = useTema();
  const styles = getStyles(tema);
  async function abrirLink() {
    link ='https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwjZr4m4vdaNAxWVrJUCHXktILsQFnoECBIQAQ&url=https%3A%2F%2Fwww.cps.sp.gov.br%2Fetec%2F&usg=AOvVaw2EW8I6Y_NyQx8pW6g-1fnQ&opi=89978449'
    console.log(link)
    Linking.openURL(link)
  }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f2f2f2" />
      <ScrollView style={styles.content}>
        <View style={styles.contCapa}>
          <Image style={styles.capa}
            source={{ uri: `https://i.ytimg.com/vi/8BAMAXmlTEc/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBPgkX4fJG375vA5g8WgeTCs5CyXA` }}
          />
        </View>
        <View style={styles.infoCont}>
          <View style={styles.tituloCont}>
            <Text style={styles.titulo}>Inscrições para os cursos da Etec de Guaianasses</Text>
          </View>
          <View style={styles.infosCont}>
            <View style={styles.infosBox}>
              <View style={styles.imgPerfilCont}>
                <Image style={styles.imgPerfil}
                  source={{ uri: `https://i.ytimg.com/vi/8BAMAXmlTEc/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBPgkX4fJG375vA5g8WgeTCs5CyXA` }}
                />
              </View>
              <View style={styles.IntsInfo}>
                <Text style={styles.nome}>Ituau teste</Text>
                <Text style={styles.arroba}>@viado</Text>
              </View>
            </View>
            <View style={styles.infosBox}>
              <View style={styles.iconeInfosCont}>
                <Ionicons
                  style={[styles.icon]}
                  name="calendar-clear-outline"
                />
              </View>
              <View style={styles.IntsInfo}>
                <Text style={styles.data}>20/05/2025 as 20:00 até 20/05/2025 as 20:00</Text>
              </View>
            </View>
            <View style={styles.infosBox}>
              <View style={styles.iconeInfosCont}>
                <Ionicons
                  style={[styles.icon]}
                  name="link-outline"

                />
              </View>
              <TouchableOpacity style={styles.IntsInfo} onPress={()=>abrirLink()}>
                <Text style={styles.link}
                  numberOfLines={1}
                  ellipsizeMode="tail">http://localhost/phpmyadmin/index.php?route=/sql&pos=0&db=bdcursei&table=tb_user</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.buttonsCont}>
            <TouchableOpacity style={styles.buttonAzul}>
              <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#fff' }}> Ativar lembrete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonVazio}>
              <Text style={{ fontSize: 15, fontWeight: 'bold', color: tema.azul }}> Saber mais</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.maisInfo}>
          <Text style={styles.textMaisInfo}>
            Mais informações
          </Text>
          <Text style={styles.desc}>
            🎓 Inscrições Abertas para a ETEC!

            Chegou a hora de dar o primeiro passo rumo ao seu futuro! As inscrições para os cursos técnicos da ETEC já estão abertas. São diversas opções em áreas como TI, Administração, Saúde, Design e muito mais. Não perca essa oportunidade!
🗓️ Inscreva-se até 24 de junho
                      </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

};




