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
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import host from '../../global';
import { useTema } from "../../context/themeContext";

export default function AlterarUser() {
  const [userData, setUserData] = useState({ nome: '', email: '', arroba: '' });
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [modalNome, setModalNome] = useState(false);
  const [modalArroba, setModalArroba] = useState(false);
  const [modalEmail, setModalEmail] = useState(false);

  const [nomeValue, setNomeValue] = useState('');
  const [arrobaValue, setArrobaValue] = useState('');
  const [emailValue, setEmailValue] = useState('');

  const { tema } = useTema();
  console.log(tema)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const idUserSalvo = await AsyncStorage.getItem('idUser');
        if (idUserSalvo) {
          setUserId(idUserSalvo);
          const response = await axios.get(`http://${host}:8000/api/cursei/user/${idUserSalvo}`);
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
        setTimeout(() => setLoading(false), 500);
      }
    };
    fetchUserData();
  }, []);

  const handleSave = async (field, value, setModal) => {
    try {
      const data = {};
      data[field] = value;
      await axios.post(`http://${host}:8000/api/cursei/user/${userId}`, data);
      setUserData(prev => ({ ...prev, [field.replace('_user', '')]: value }));
      setModal(false);
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.loadingContainer, { backgroundColor: tema.fundo }]}>
        <ActivityIndicator size="large" color={tema.azul} />
      </SafeAreaView>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: tema.fundo }]}>
      <TouchableOpacity
        style={styles.item}
        onPress={() => { setNomeValue(userData.nome); setModalNome(true); }}>
        <View>
          <Text style={[styles.label, { color: tema.texto }]}>Nome do usuário</Text>
          <Text style={[styles.value, { color: tema.descricao }]}>{userData.nome}</Text>
        </View>
        <MaterialIcons name="keyboard-arrow-right" size={24} color={tema.descricao} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        onPress={() => { setArrobaValue(userData.arroba); setModalArroba(true); }}>
        <View>
          <Text style={[styles.label, { color: tema.texto }]}>Arroba</Text>
          <Text style={[styles.value, { color: tema.descricao }]}>{userData.arroba}</Text>
        </View>
        <MaterialIcons name="keyboard-arrow-right" size={24} color={tema.descricao} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        onPress={() => { setEmailValue(userData.email); setModalEmail(true); }}>
        <View>
          <Text style={[styles.label, { color: tema.texto }]}>Email do usuário</Text>
          <Text style={[styles.value, { color: tema.descricao }]}>{userData.email}</Text>
        </View>
        <MaterialIcons name="keyboard-arrow-right" size={24} color={tema.descricao} />
      </TouchableOpacity>

      {/* MODAIS */}
      <UserModal
        visible={modalNome}
        title="Edite seu nome"
        value={nomeValue}
        onChange={setNomeValue}
        onCancel={() => setModalNome(false)}
        onSave={() => handleSave('nome_user', nomeValue, setModalNome)}
        tema={tema}
      />

      <UserModal
        visible={modalArroba}
        title="Edite seu @"
        value={arrobaValue}
        onChange={setArrobaValue}
        onCancel={() => setModalArroba(false)}
        onSave={() => handleSave('arroba_user', arrobaValue, setModalArroba)}
        tema={tema}
      />

      <UserModal
        visible={modalEmail}
        title="Mude o email vinculado à sua conta"
        value={emailValue}
        onChange={setEmailValue}
        onCancel={() => setModalEmail(false)}
        onSave={() => handleSave('email_user', emailValue, setModalEmail)}
        tema={tema}
      />
    </ScrollView>
  );
}

function UserModal({ visible, title, value, onChange, onCancel, onSave, tema }) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onCancel}>
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { backgroundColor: tema.modalFundo }]}>
          <Text style={[styles.modalTitle, { color: tema.texto }]}>{title}</Text>
          <TextInput
            style={[styles.input, { backgroundColor: tema.fundo, color: tema.texto }]}
            value={value}
            onChangeText={onChange}
            autoFocus
            placeholderTextColor={tema.descricao}
          />
          <View style={styles.buttonRow}>
            <Pressable style={[styles.botao, { backgroundColor: tema.azul }]} onPress={onCancel}>
              <Text style={[styles.buttonText, { color: tema.textoBotao }]}>Cancelar</Text>
            </Pressable>
            <Pressable style={[styles.botao, { backgroundColor: tema.azul }]} onPress={onSave}>
              <Text style={[styles.buttonText, { color: tema.textoBotao }]}>Salvar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontWeight: '600',
  },
  value: {
    fontSize: 13,
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
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
    marginBottom: 15,
    fontSize: 16,
    padding: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  botao: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
