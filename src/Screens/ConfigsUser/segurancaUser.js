import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Switch } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export default function SegurancaUser() {
  const [protecaoSenha, setProtecaoSenha] = useState(false);
  const navigation = useNavigation;
  const ativarAutenticacao = async () => {
    try {
      await axios.post(`http://localhost:8000/api/cursei/user/autenticacao/${userId}`, {
        
      });
    } catch (error) {
      console.error('Desgraça:', error);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.descricao}>
        Gerencie a segurança da sua conta da melhor forma.
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Autenticação em duas etapas</Text>
        <Text style={styles.sectionDescricao}>
          Para evitar acesso não autorizado, proteja sua conta exigindo um segundo método de autenticação, além da sua senha.
        </Text>
        <Pressable onPress={{}}><Text style={styles.link}>Ativar autenticação em duas etapas</Text></Pressable>
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
    fontWeight: 600,
    fontSize: 16,
    marginBottom: 4,
    color: '#787F89'
  },
  sectionDescricao: {
    color: '#555',
    fontSize: 13,
    flex: 1,
  },
  link: {
    color: '#448FFF',
    marginTop: 8,
    fontSize: 13,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
