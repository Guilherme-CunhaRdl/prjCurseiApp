  import React, { useState, useEffect } from 'react';
  import { View, Text, StyleSheet } from 'react-native';
  import { Switch } from 'react-native-paper';
  import { SafeAreaView } from 'react-native-safe-area-context';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import axios from 'axios';

  export default function SegurancaUser() {
    const [userId, setUserId] = useState('');
    const [doisFatoresAtivo, setDoisFatoresAtivo] = useState(false);
    const [protecaoSenha, setProtecaoSenha] = useState(false);

    useEffect(() => {
      const carregarId = async () => {
        const id = await AsyncStorage.getItem('idUser');
        if (id) setUserId(id);
      };
      carregarId();
    }, []);

    const ativarAutenticacao = async (novoValor) => {
      try {
        await axios.post(`http://localhost:8000/api/cursei/user/autenticacao/${userId}`, {
          dois_fatores_user: novoValor
        }); 
        setDoisFatoresAtivo(novoValor);
      } catch (error) {
        console.error('Erro ao atualizar autenticação:', error);
      }
    };

    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.descricao}>
          Gerencie a segurança da sua conta da melhor forma.
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Autenticação em duas etapas</Text>
          <View style={styles.row}>
            <Text style={styles.sectionDescricao}>
              Para evitar acesso não autorizado, proteja sua conta exigindo um segundo método de autenticação, além da sua senha.
            </Text>
            <Switch
              value={doisFatoresAtivo}
              onValueChange={ativarAutenticacao}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Proteção de senha</Text>
          <View style={styles.row}>
            <Text style={styles.sectionDescricao}>
              Para melhorar sua proteção, você precisará confirmar seu número de celular ou endereço de e-mail para redefinir a senha.
            </Text>
            <Switch
              value={protecaoSenha}
              onValueChange={() => setProtecaoSenha(!protecaoSenha)}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 16,
    },
    descricao: {
      color: '#777',
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
      color: '#787F89'
    },
    sectionDescricao: {
      color: '#555',
      fontSize: 13,
      flex: 1,
      marginRight: 10,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  });
