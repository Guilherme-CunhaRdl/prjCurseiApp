import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import host from '../../global';
import { useNavigation } from '@react-navigation/native';

export default function DoisFatores({route}) {
  const { email } = route.params;
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0); 
  const navigation = useNavigation();

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);


  useEffect(() => {
    send2FACode();
  }, []);

  const send2FACode = async () => {
    try {
      console.log('[DEBUG] Iniciando envio de código 2FA');
      console.log('Email:', email);
      console.log('Host:', host);
      
      setLoading(true);
      
      const apiUrl = `http://${host}:8000/api/2fa/enviarCodigo`;
      console.log('URL da API:', apiUrl);
      
      const response = await axios.post(apiUrl, { email });
      console.log('Resposta da API:', response.data);
      
      if (response.data && response.data.success) {
        console.log('[DEBUG] Código enviado com sucesso');
        Alert.alert('Sucesso', 'Código enviado para seu e-mail');
        setCountdown(60);
      } else {
        console.warn('[DEBUG] Resposta inesperada:', response.data);
        Alert.alert('Aviso', 'Resposta inesperada do servidor');
      }
    } catch (error) {
      console.error('[DEBUG] Erro completo:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
        request: error.request
      });
      
      let errorMessage = 'Falha ao enviar código';
      
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = 'Endpoint não encontrado (404)';
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        errorMessage = 'Sem resposta do servidor';
      }
      
      Alert.alert('Erro', errorMessage);
    } finally {
      console.log('[DEBUG] Finalizando processo de envio');
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!code || code.length !== 6) {
      Alert.alert('Erro', 'Por favor, insira um código válido de 6 dígitos');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`http://${host}:8000/api/2fa/verificarCodigo`, { 
        email, 
        code 
      });

      if (response.data.success) {
        const id = await AsyncStorage.getItem('idUser');
        const response = await axios.post(`http://${host}:8000/api/cursei/user/selecionarUser/${id}`);
        const usuario = response.data.User;
        console.log(usuario);
        await AsyncStorage.setItem('idUser', String(usuario.id));
        await AsyncStorage.setItem('logado', '1');
        await AsyncStorage.setItem('idInstituicao', response.data.id_instituicao);
        await AsyncStorage.setItem('imgUser', usuario.img_user);
        await AsyncStorage.setItem('arrobaUser', usuario.arroba_user);
        navigation.navigate('Home');
      }
    } catch (error) {
      Alert.alert('Erro', error.response?.data?.message || 'Código inválido');
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    if (countdown > 0) return;
    
    setResending(true);
    await send2FACode();
    setResending(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verificação em duas Etapas</Text>
      <Text style={styles.subtitle}>
        Enviamos um código de 6 dígitos para {email}
      </Text>
      
      <TextInput
        style={styles.input}
        placeholder="Código de verificação"
        keyboardType="number-pad"
        maxLength={6}
        value={code}
        onChangeText={setCode}
        autoFocus
      />
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={verifyCode}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Verificar</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.resendButton} 
        onPress={resendCode}
        disabled={resending || countdown > 0}
      >
        {resending ? (
          <ActivityIndicator color="#333" />
        ) : (
          <Text style={styles.resendText}>
            {countdown > 0 ? `Reenviar em ${countdown}s` : 'Reenviar código'}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
    color: '#666',
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 20,
    fontSize: 14,
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3, // para Android
    shadowColor: '#000', // para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  resendButton: {
    marginTop: 24,
    padding: 10,
    alignItems: 'center',
  },
  resendText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: '500',
  },
});
