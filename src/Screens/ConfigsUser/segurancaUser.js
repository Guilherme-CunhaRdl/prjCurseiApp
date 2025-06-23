import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Switch } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import host from '../../global';
import { useTema } from '../../context/themeContext';

const API_BASE_URL = `http://${host}:8000`;

export default function SegurancaUser() {
  const { tema } = useTema();

  const [userId, setUserId] = useState(null);
  const [doisFatoresAtivo, setDoisFatoresAtivo] = useState(false);
  const [protecaoSenha, setProtecaoSenha] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const carregarDadosUsuario = async () => {
      try {
        const id = await AsyncStorage.getItem('idUser');
        setUserId(id);

        const response = await axios.post(`http://localhost:8000/api/cursei/user/selecionarUser/${id}`);
        console.log(response.data.User);
        const valorDoisFatores = usuario.dois_fatores_user;

        // Corrigindo o tipo para booleano
        const doisFatoresBoolean = valorDoisFatores === true || valorDoisFatores === 1 || valorDoisFatores === 'true';
        setDoisFatoresAtivo(doisFatoresBoolean);

      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        Alert.alert('Erro', 'Não foi possível carregar as configurações de segurança');
      } finally {
        setLoading(false);
      }
    };

    carregarDadosUsuario();
  }, []);

  const ativarAutenticacao = async (novoValor) => {
    if (!userId) return;

    setUpdating(true);
    try {
      const response = await axios.post(
        `http://localhost:8000/api/cursei/user/autenticacao/${userId}`,
        { dois_fatores_user: novoValor }
      );

      if (response.data.success) {
        setDoisFatoresAtivo(novoValor);
        Alert.alert('Sucesso', response.data.message || 'Configuração atualizada');
      } else {
        throw new Error(response.data.message || 'Erro na resposta da API');
      }
    } catch (error) {
      console.error('Erro completo:', error.response || error);
      setDoisFatoresAtivo(!novoValor);
      Alert.alert('Erro', error.response?.data?.message || error.message || 'Falha na comunicação');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.center, { flex: 1, backgroundColor: tema.fundo }]}>
        <ActivityIndicator size="large" color={tema.texto} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: tema.fundo }]}>
      <Text style={[styles.descricao, { color: tema.descricao }]}>
        Gerencie a segurança da sua conta da melhor forma.
      </Text>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: tema.texto }]}>
          Autenticação em duas etapas
        </Text>
        <View style={styles.row}>
          <Text style={[styles.sectionDescricao, { color: tema.descricao }]}>
            Para evitar acesso não autorizado, proteja sua conta exigindo um segundo método de autenticação, além da sua senha.
          </Text>
          {updating ? (
            <ActivityIndicator color={tema.texto} />
          ) : (
            <Switch
              value={doisFatoresAtivo}
              onValueChange={ativarAutenticacao}
              disabled={updating}
              color={tema.botao}
            />
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: tema.texto }]}>
          Proteção de senha
        </Text>
        <View style={styles.row}>
          <Text style={[styles.sectionDescricao, { color: tema.descricao }]}>
            Para melhorar sua proteção, você precisará confirmar seu número de celular ou endereço de e-mail para redefinir a senha.
          </Text>
          <Switch
            value={protecaoSenha}
            onValueChange={() => setProtecaoSenha(!protecaoSenha)}
            disabled={updating}
            color={tema.botao}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  descricao: {
    fontSize: 13,
    marginBottom: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
  },
  sectionDescricao: {
    fontSize: 13,
    flex: 1,
    marginRight: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
