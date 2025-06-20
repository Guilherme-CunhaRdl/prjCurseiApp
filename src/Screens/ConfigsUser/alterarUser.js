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

  useEffect(() => {
    const carregarUsuario = async () => {
      const id = await AsyncStorage.getItem('idUser');
      setUserId(id);
      try {
        const response = await axios.post(`http://${host}:8000/api/cursei/user/selecionarUser/${id}`);
        setUsuario(response.data.User);
        console.log(usuario);
        console.log(senhaAtual);
        setLoading(false);
      } catch (erro) {
        console.error('Erro ao carregar usuário:', erro);
      }
    };

    carregarUsuario();
  }, []);
  console.log(usuario)
  const handleSave = async (field, value, setModal) => {
    try {
      const data = {};
      if (field === 'arroba') {
        data['arroba_user'] = value;
      } else if (field === 'email') {
        data['email_user'] = value;
      }
  
      await axios.post(`http://${host}:8000/api/cursei/user/atualizar/${userId}`, data);
  
      setUsuario(prev => ({ ...prev, [field + '_user']: value }));
      setModal(false);
    } catch (error) {
      console.error('Erro ao salvar:', error);
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
        onPress={() => { setArrobaValue(usuario.arroba); setModalArroba(true); }}>
        <View>
          <Text style={[styles.label, { color: tema.texto }]}>@</Text>
          <Text style={[styles.value, { color: tema.descricao }]}>@{usuario.arroba_user}</Text>
        </View>
        <MaterialIcons name="keyboard-arrow-right" size={24} color={tema.descricao} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        onPress={() => { setEmailValue(usuario.email); setModalEmail(true); }}>
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
        title="Editar arroba"
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
          <View style={[styles.modalContent, { backgroundColor: tema.modalFundo }]}>
            <Text style={[styles.modalTitle, { color: tema.texto }]}>Alterar senha</Text>

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
                style={[styles.botao, { backgroundColor: tema.cancelar }]} 
                onPress={() => {
                  setModalSenha(false);
                  setErroSenha('');
                }}>
                <Text style={[styles.buttonText, { color: tema.texto }]}>Cancelar</Text>
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
            <Pressable style={[styles.botao, { backgroundColor: tema.cancelar }]} onPress={onCancel}>
              <Text style={[styles.buttonText, { color: tema.texto }]}>Cancelar</Text>
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
    width: '80%',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  botao: {
    padding: 10,
    borderRadius: 5,
    minWidth: '45%',
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
  },
  erroText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});