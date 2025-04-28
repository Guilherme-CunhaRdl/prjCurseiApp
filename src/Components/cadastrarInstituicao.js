import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import axios from 'axios';

export default function CadastroInstituicaoModal({ visible, onClose, onSubmit, userId }) {
  const [form, setForm] = useState({
    logradouro: '',
    num_logradouro: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
    complemento: '',
    cnpj: '',
  });

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });

    if (field === 'cep' && value.length === 8) {
      buscarCEP(value);
    }
  };

  const buscarCEP = async (cep) => {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      const data = response.data;

      if (data.erro) {
        Alert.alert('CEP inválido');
      } else {
        setForm((prevForm) => ({
          ...prevForm,
          logradouro: data.logradouro || '',
          bairro: data.bairro || '',
          cidade: data.localidade || '',
          estado: data.uf || '',
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    const dadosInstituicao = {
      logradouro: form.logradouro,
      num_logradouro: form.num_logradouro,
      bairro: form.bairro,
      cidade: form.cidade,
      estado: form.estado,
      cep: form.cep,
      complemento: form.complemento,
      cnpj: form.cnpj,
      user_id: userId, // <<< associa o usuário aqui!

    };

    try {
      const response = await axios.post('http://localhost:8000/api/instituicao', dadosInstituicao, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(response.data);
      onSubmit(form);
      onClose();
      setForm({
        logradouro: '',
        num_logradouro: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: '',
        complemento: '',
        cnpj: '',
      });
    } catch (error) {
      console.error('Erro ao enviar dados:', error.response?.data || error.message);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
                <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                <Text style={styles.title}>Cadastro de instituição</Text>

                <TextInput
                    style={styles.input}
                    placeholder="CNPJ"
                    value={form.cnpj}
                    onChangeText={(text) => handleChange('cnpj', text)}
                    keyboardType="numeric"
                />

                <TextInput
                    style={styles.input}
                    placeholder="CEP"
                    value={form.cep}
                    onChangeText={(text) => handleChange('cep', text)}
                    keyboardType="numeric"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Logradouro"
                    value={form.logradouro}
                    onChangeText={(text) => handleChange('logradouro', text)}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Número"
                    value={form.num_logradouro}
                    onChangeText={(text) => handleChange('num_logradouro', text)}
                    keyboardType="numeric"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Bairro"
                    value={form.bairro}
                    onChangeText={(text) => handleChange('bairro', text)}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Cidade"
                    value={form.cidade}
                    onChangeText={(text) => handleChange('cidade', text)}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Estado"
                    value={form.estado}
                    onChangeText={(text) => handleChange('estado', text)}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Complemento"
                    value={form.complemento}
                    onChangeText={(text) => handleChange('complemento', text)}
                />

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Cadastrar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
                    <Text style={styles.buttonText}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
                </View>
                </View>

    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    width: '90%',
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    padding: 10,
    borderRadius: 7,
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    backgroundColor: '#007bff',
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 7,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
