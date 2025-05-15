import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Modal,
  TextInput,
  Button,
  Pressable
  ,ActivityIndicator 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function AlterarUser() {
  const [userData, setUserData] = useState({
    nome: '',
    email: '',
    arroba: '',
  });
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [modalNome, setModalNome] = useState(false);
  const [modalArroba, setModalArroba] = useState(false);
  const [modalEmail, setModalEmail] = useState(false);

  const [nomeValue, setNomeValue] = useState('');
  const [arrobaValue, setArrobaValue] = useState('');
  const [emailValue, setEmailValue] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const idUserSalvo = await AsyncStorage.getItem('idUser');
        if (idUserSalvo) {
          setUserId(idUserSalvo);
          const response = await axios.get(`http://localhost:8000/api/cursei/user/${idUserSalvo}`);
          const data = response.data.User;
          setUserData({
            nome: data.nome_user,
            email: data.email_user,
            arroba: data.arroba_user,
          });
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };

    fetchUserData();
  }, []);

  const handleSaveNome = async () => {
    try {
      await axios.post(`http://localhost:8000/api/cursei/user/${userId}`, {
        nome_user: nomeValue,
      });
      setUserData(prev => ({ ...prev, nome: nomeValue }));
      setModalNome(false);
    } catch (error) {
      console.error('Desgraça:', error);
    }
  };

  const handleSaveArroba = async () => {
    try {
      await axios.post(`http://localhost:8000/api/cursei/user/${userId}`, {
        arroba_user: arrobaValue,
      });
      setUserData(prev => ({ ...prev, arroba: arrobaValue }));
      setModalArroba(false);
    } catch (error) {
      console.error('Desgraça:', error);
    }
  };

  const handleSaveEmail = async () => {
    try {
      await axios.post(`http://localhost:8000/api/cursei/user/${userId}`, {
        email_user: emailValue,
      });
      setUserData(prev => ({ ...prev, email: emailValue }));
      setModalEmail(false);
    } catch (error) {
      console.error('Desgraça:', error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' ,backgroundColor:"#fff"}}>
      <ActivityIndicator size="large" color="#3498db" />
</SafeAreaView> 
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.item}
        onPress={() => {
          setNomeValue(userData.nome);
          setModalNome(true);
        }}
      >
        <View>
          <Text style={styles.label}>Nome do usuário</Text>
          <Text style={styles.value}>{userData.nome}</Text>
        </View>
        <MaterialIcons name="keyboard-arrow-right" size={24} color="#999" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        onPress={() => {
          setArrobaValue(userData.arroba);
          setModalArroba(true);
        }}
      >
        <View>
          <Text style={styles.label}>Arroba</Text>
          <Text style={styles.value}>{userData.arroba}</Text>
        </View>
        <MaterialIcons name="keyboard-arrow-right" size={24} color="#999" />
      </TouchableOpacity>

      {/* Email */}
      <TouchableOpacity
        style={styles.item}
        onPress={() => {
          setEmailValue(userData.email);
          setModalEmail(true);
        }}
      >
        <View>
          <Text style={styles.label}>Email do usuário</Text>
          <Text style={styles.value}>{userData.email}</Text>
        </View>
        <MaterialIcons name="keyboard-arrow-right" size={24} color="#999" />
      </TouchableOpacity>
      

      {/* Modais separados */}
      {/* Modal Nome */}
      <Modal visible={modalNome} animationType="slide" transparent onRequestClose={() => setModalNome(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edite seu nome</Text>
            <TextInput
              style={styles.input}
              value={nomeValue}
              onChangeText={setNomeValue}
              autoFocus
            />
            <View style={styles.buttonRow}>
        <Pressable style={styles.cancelarBotao} onPress={() => setModalNome(false)}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </Pressable>
        <Pressable style={styles.salvarBotao} onPress={handleSaveNome}>
          <Text style={styles.buttonText}>Salvar</Text>
        </Pressable>
      </View>
          </View>
        </View>
      </Modal>

      {/* Modal Arroba */}
      <Modal visible={modalArroba} animationType="slide" transparent onRequestClose={() => setModalArroba(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edite seu @</Text>
            <TextInput
              style={styles.input}
              value={arrobaValue}
              onChangeText={setArrobaValue}
              autoFocus
            />
           <View style={styles.buttonRow}>
        <Pressable style={styles.cancelarBotao} onPress={() => setModalArroba(false)}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </Pressable>
        <Pressable style={styles.salvarBotao} onPress={handleSaveArroba}>
          <Text style={styles.buttonText}>Salvar</Text>
        </Pressable>
      </View>
          </View>
        </View>
      </Modal>

     {/* Modal Email */}
<Modal
  visible={modalEmail}
  animationType="slide"
  transparent
  onRequestClose={() => setModalEmail(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Mude o email vinculado a sua conta</Text>
      <TextInput
        style={styles.input}
        value={emailValue}
        onChangeText={setEmailValue}
        autoFocus
      />
      <View style={styles.buttonRow}>
        <Pressable style={styles.cancelarBotao} onPress={() => setModalEmail(false)}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </Pressable>
        <Pressable style={styles.salvarBotao} onPress={handleSaveEmail}>
          <Text style={styles.buttonText}>Salvar</Text>
        </Pressable>
      </View>
    </View>
  </View>
</Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  item: {
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  value: {
    fontSize: 13,
    color: '#555',
    marginTop: 2,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '80%',
    padding: 20,
    borderRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderRadius: 6,
    backgroundColor: '#EDEDED',
    marginBottom: 15,
    fontSize: 16,
    padding: 10
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    salvarBotao: {
      backgroundColor: '#448FFF',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      marginRight: 10,
    },
    cancelarBotao: {
      backgroundColor: '#448FFF',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    
});
