import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  TextInput,
  Pressable
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import styles from './styles';

import { useNavigation } from "@react-navigation/native";

export default function Interesse() {
  const [interessesSelecionados, setInteressesSelecionados] = useState([]);

  const interesses = [
    'Tecnologia', 'Saúde', 'Design', 'Artes',
    'Engenharia', 'Esportes', 'Ciências', 'Línguas'
  ];

  const toggleInteresse = (item) => {
    if (interessesSelecionados.includes(item)) {
      setInteressesSelecionados(interessesSelecionados.filter(i => i !== item));
    } else {
      setInteressesSelecionados([...interessesSelecionados, item]);
    }
  };

  const navigation = useNavigation();


  return (
    <View style={styles.container}>
      <View style={styles.capa}>
        {/** <Image
        source={require('')}
        />*/}
      </View>

      <View >
        <Image style={styles.user}
          source={require('../../../assets/user.png')}
        />
      </View>

      <View style={styles.cadastro}>
        <Text style={styles.titulo}>Seus Interesses</Text>
        <Text style={styles.subtitulo}>Selecione pelo menos 3 para personalizar sua experiência</Text>

        <View style={styles.grid}>
          {interesses.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.interesseButton,
                interessesSelecionados.includes(item) && styles.interesseSelecionado
              ]}
              onPress={() => toggleInteresse(item)}
            >
              <View style={styles.iconContainer}>
                <Icon
                  name="award"
                  size={16}
                  color={interessesSelecionados.includes(item) ? '#fff' : '#4B97FF'}
                />
              </View>
              <Text style={[
                styles.interesseText,
                interessesSelecionados.includes(item) && styles.textoSelecionado
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Pressable style={styles.btFinalizar}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.buttomText}>Finalizar Cadastro</Text>
        </Pressable>

        <Pressable style={styles.btVoltar}
          onPress={() => navigation.navigate('Cadastro')}
        >
          <Icon name="arrow-left" size={16} color="#4B97FF" />
          <Text style={styles.voltarText}>Voltar</Text>
        </Pressable>
      </View>
    </View>
  );
}