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
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalSenha, setModalSenha] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [modalArroba, setModalArroba] = useState(false);
  const [modalEmail, setModalEmail] = useState(false);
  const [usuario, setUsuario] = useState({
    id: '',
    arroba_user: '',
    email_user: '',
    senha_user: '',
  });
  const [erroSenha, setErroSenha] = useState('');
  const [arrobaValue, setArrobaValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const { tema } = useTema();

  const verificarEmailExistente = async (email) => {
    try {
      const resposta = await axios.get(`http://${host}:8000/api/verificar-email?email=${email}`);
      return resposta.data.existe;
    } catch (erro) {
      console.error('Erro ao verificar email:', erro);
      return false;
    }
  };

  const verificarUsuarioExistente = async (usuario) => {
    try {
      const resposta = await axios.get(`http://${host}:8000/api/verificar-usuario?usuario=${usuario}`);
      return resposta.data.existe;
    } catch (erro) {
      console.error('Erro ao verificar usuário:', erro);
      return false;
    }
  };

  useEffect(() => {
    const carregarUsuario = async () => {
      const id = await AsyncStorage.getItem('idUser');
      setUserId(id);
      try {
        const response = await axios.post(`http://${host}:8000/api/cursei/user/selecionarUser/${id}`);
        setUsuario(response.data.User);
        setLoading(false);
      } catch (erro) {
        console.error('Erro ao carregar usuário:', erro);
      }
    };

    carregarUsuario();
  }, []);

  const handleSave = async (field, value, setModal) => {
    try {
      if (value === usuario[`${field}_user`]) {
        setModal(false);
        return;
      }

      let existe = false;
      if (field === 'arroba') {
        existe = await verificarUsuarioExistente(value);
      } else if (field === 'email') {
        existe = await verificarEmailExistente(value);
      }

      if (existe) {
        alert(`Este ${field === 'arroba' ? '@' : 'email'} já está em uso. Por favor, escolha outro.`);
        return;
      }

      // Atualizar dados
      const data = {};
      data[`${field}_user`] = value;

      await axios.post(`http://${host}:8000/api/cursei/user/atualizar/${userId}`, data);

      setUsuario(prev => ({ ...prev, [`${field}_user`]: value }));
      setModal(false);
    } catch (error) {
      alert('Erro ao atualizar. Verifique os dados e tente novamente.');
    }
  };

  const handleSenhaUpdate = async () => {
    setErroSenha('');

    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      setErroSenha('Preencha todos os campos.');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setErroSenha('As senhas novas não coincidem.');
      return;
    }

    try {
      const response = await axios.post(`http://${host}:8000/api/cursei/user/alterarSenha/${userId}`, {
        senha_atual: senhaAtual,
        nova_senha: novaSenha,
      });

      if (response.data.success) {
        alert('Senha alterada com sucesso!');
        setModalSenha(false);
        setSenhaAtual('');
        setNovaSenha('');
        setConfirmarSenha('');
      } else {
        setErroSenha(response.data.message || 'Erro ao alterar a senha.');
      }
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      setErroSenha('Erro na requisição.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.loadingContainer, { backgroundColor: tema.fundo }]}>
        <ActivityIndicator size="large" color={tema.azul} />
      </SafeAreaView>
    );
  }

  if (!usuario) {
    return null;
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: tema.fundo }]}>
      <TouchableOpacity
        style={styles.item}
        onPress={() => { setArrobaValue(usuario.arroba_user); setModalArroba(true); }}>
        <View>
          <Text style={[styles.label, { color: tema.texto }]}>@</Text>
          <Text style={[styles.value, { color: tema.descricao }]}>@{usuario.arroba_user}</Text>
        </View>
        <MaterialIcons name="keyboard-arrow-right" size={24} color={tema.descricao} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        onPress={() => { setEmailValue(usuario.email_user); setModalEmail(true); }}>
        <View>
          <Text style={[styles.label, { color: tema.texto }]}>Email</Text>
          <Text style={[styles.value, { color: tema.descricao }]}>{usuario.email_user}</Text>
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
        subtitle="Altere seu @ para um que ainda não está em uso"
        value={arrobaValue}
        onChange={setArrobaValue}
        onCancel={() => setModalArroba(false)}
        onSave={() => handleSave('arroba', arrobaValue, setModalArroba)}
        tema={tema}
        placeholder="Digite seu novo @ (sem o símbolo)"
      />

      <UserModal
        visible={modalEmail}
        title="Alterar email"
        subtitle="Altere o email vinculado a sua conta"
        value={emailValue}
        onChange={setEmailValue}
        onCancel={() => setModalEmail(false)}
        onSave={() => handleSave('email', emailValue, setModalEmail)}
        tema={tema}
        placeholder="Digite seu novo email"
        keyboardType="email-address"
      />

      <Modal visible={modalSenha} animationType="slide" transparent onRequestClose={() => setModalSenha(false)}>
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: tema.modalFundo, height: '50%' }]}>
            <Text style={[styles.modalTitle, { color: tema.texto }]}>Alterar senha</Text>
            <Text style={[styles.modalSubTitle, { color: tema.descricao }]}>Confirme a senha atual e a altere para uma nova</Text>

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
            
            <TextInput
              style={[styles.input, { backgroundColor: tema.fundo, color: tema.texto }]}
              placeholder="Confirmar nova senha"
              placeholderTextColor={tema.descricao}
              secureTextEntry
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
            />
            
            {erroSenha ? <Text style={styles.erroText}>{erroSenha}</Text> : null}

            <View style={styles.buttonRow}>
              <Pressable 
                style={[styles.botao, { backgroundColor: tema.azul }]} 
                onPress={() => {
                  setModalSenha(false);
                  setErroSenha('');
                }}>
                <Text style={[styles.buttonText, { color: tema.textoBotao }]}>Cancelar</Text>
              </Pressable>
              <Pressable 
                style={[styles.botao, { backgroundColor: tema.azul }]} 
                onPress={handleSenhaUpdate}>
                <Text style={[styles.buttonText, { color: tema.textoBotao }]}>Salvar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

function UserModal({ 
  visible, 
  title,
  subtitle, 
  value, 
  onChange, 
  onCancel, 
  onSave, 
  tema, 
  placeholder = "", 
  keyboardType = "default" 
}) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onCancel}>
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { backgroundColor: tema.modalFundo }]}>
          <Text style={[styles.modalTitle, { color: tema.texto }]}>{title}</Text>
          <Text style={[styles.modalSubTitle, { color: tema.descricao }]}>{subtitle}</Text>
          <TextInput
            style={[styles.input, { backgroundColor: tema.fundo, color: tema.texto }]}
            value={value}
            onChangeText={onChange}
            autoFocus
            placeholder={placeholder}
            placeholderTextColor={tema.descricao}
            keyboardType={keyboardType}
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
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    height: '30%',
    padding: 30,
    borderRadius: 15,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
    modalSubTitle: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center'
  },
  
  input: {
    height: 50,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 25,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  botao: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: '45%',
    alignItems: 'center',
    backgroundColor: '#eee',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  erroText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 14,
  },
});
