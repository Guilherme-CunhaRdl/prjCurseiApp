import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

export default function DoisFatores({ route, navigation }) {
  const { userId } = route.params;
  const [codigo, setCodigo] = useState('');

  const verificarCodigo = async () => {
    try {
      const response = await axios.post(`http://localhost:8000/api/cursei/user/verificar-codigo/${userId}`, {
        codigo,
      });

      if (response.data.success) {
        navigation.replace('Home');
      } else {
        Alert.alert('Erro', 'Código incorreto');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Falha ao verificar código');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Digite o código que enviamos para seu e-mail</Text>
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        value={codigo}
        onChangeText={setCodigo}
        maxLength={4}
      />
      <Button title="Verificar" onPress={verificarCodigo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  label: { fontSize: 16, marginBottom: 12 },
  input: {
    borderWidth: 1, borderColor: '#ccc',
    padding: 10, marginBottom: 20,
    fontSize: 18, borderRadius: 5
  }
});
