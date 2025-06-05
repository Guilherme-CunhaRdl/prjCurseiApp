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
  const [userData, setUserData] = useState({ senha: '', email: '', arroba: '' });
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [modalSenha, setModalSenha] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [modalArroba, setModalArroba] = useState(false);
  const [modalEmail, setModalEmail] = useState(false);

  const [arrobaValue, setArrobaValue] = useState('');
  const [emailValue, setEmailValue] = useState('');

  const { tema } = useTema();

  useEffect(() => {
    console.log('[DEBUG] Iniciando busca de dados do usuário');
  
    const fetchUserData = async () => {
      try {
        const id = await AsyncStorage.getItem('idUser');
        console.log(`[DEBUG] ID do usuário local: ${id}`);
  
        if (!id) {
          console.warn('[AVISO] Nenhum ID de usuário encontrado no storage');
          return;
        }
  
        const url = `http://${host}:8000/api/cursei/user/puxar/${id}`;
        console.log(`[DEBUG] Endpoint chamado: ${url}`);
  
        const response = await axios.get(url);
        console.log('[DEBUG] Resposta completa da API:', JSON.stringify(response.data, null, 2));
  
        const userData = response.data.User;
        if (!userData) {
          throw new Error('Estrutura de dados inválida - user não encontrado na resposta');
        }
  
        console.log('[DEBUG] Dados brutos recebidos:', {
          nome_user: userData.nome_user,
          senha_user: userData.senha_user,
          email_user: userData.email_user,
          arroba_user: userData.arroba_user
        });
  
        setUserData({
          senha: userData.senha_user,
          email: userData.email_user,
          arroba: userData.arroba_user,
        });
  
      } catch (error) {
        console.error('[ERRO] Detalhes do erro:', {
          mensagem: error.message,
          url: error.config?.url,
          status: error.response?.status,
          dados: error.response?.data
        });
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserData();
  }, [host]);
  
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

  const handleSenhaUpdate = async () => {
    try {
      const response = await axios.get(`http://${host}:8000/api/cursei/user/${userId}`);
      const hash = response.data.User.senha_user;

      const senhaCorreta = await bcrypt.compare(senhaAtual, hash);

      if (!senhaCorreta) {
        alert('Senha atual incorreta.');
        return;
      }

      await axios.post(`http://${host}:8000/api/cursei/user/${userId}`, {
        senha_user: novaSenha,
      });

      alert('Senha alterada com sucesso!');
      setModalSenha(false);
      setSenhaAtual('');
      setNovaSenha('');
    } catch (error) {
      console.error('Erro ao atualizar a senha:', error);
      alert('Erro ao atualizar a senha. Tente novamente.');
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

      <TouchableOpacity
        style={styles.item}
        onPress={() => setModalSenha(true)}>
        <View>
          <Text style={[styles.label, { color: tema.texto }]}>Senha</Text>
          <Text style={[styles.value, { color: tema.descricao }]}>********</Text>
        </View>
        <MaterialIcons name="keyboard-arrow-right" size={24} color={tema.descricao} />
      </TouchableOpacity>

      {/* MODAIS */}
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

      <Modal visible={modalSenha} animationType="slide" transparent onRequestClose={() => setModalSenha(false)}>
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: tema.modalFundo }]}>
            <Text style={[styles.modalTitle, { color: tema.texto }]}>Altere sua senha</Text>

            <TextInput
              style={[styles.input, { backgroundColor: tema.fundo, color: tema.texto }]}
              placeholder="Senha atual"
              placeholderTextColor={tema.descricao}
              secureTextEntry
              value={senhaAtual}
              onChangeText={setSenhaAtual}
            />
            <TextInput
              style={[styles.input, { backgroundColor: tema.fundo, color: tema.texto }]}
              placeholder="Nova senha"
              placeholderTextColor={tema.descricao}
              secureTextEntry
              value={novaSenha}
              onChangeText={setNovaSenha}
            />

            <View style={styles.buttonRow}>
              <Pressable style={[styles.botao, { backgroundColor: tema.azul }]} onPress={() => setModalSenha(false)}>
                <Text style={[styles.buttonText, { color: tema.textoBotao }]}>Cancelar</Text>
              </Pressable>
              <Pressable style={[styles.botao, { backgroundColor: tema.azul }]} onPress={handleSenhaUpdate}>
                <Text style={[styles.buttonText, { color: tema.textoBotao }]}>Salvar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
