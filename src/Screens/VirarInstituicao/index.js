import React, { useEffect, useState } from 'react';
import {
    View,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    ScrollView
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './styles';
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function VirarInstituicao() {
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


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            <View>
                <Text >Nome da instituição</Text>
                <TextInput style={styles.inputs}  />
                <Text>Telefone</Text>
                <TextInput style={styles.inputs}  />
                <Text>CNPJ</Text>
                <TextInput style={styles.inputs}  />
                <Text>Nome do responsável</Text>
                <TextInput style={styles.inputs}  />
                <Text>Documentos pessoais do representante</Text>
                <TextInput style={styles.inputs}  />
                <Text>CEP</Text>
                <TextInput style={styles.inputs}
                     value={form.cep}
                    onChangeText={(text) => handleChange('cep', text)} />
                <Text>Logradouro</Text>
                <TextInput style={styles.inputs}
                     value={form.logradouro}
                    onChangeText={(text) => handleChange('logradouro', text)} />
                <Text>Número</Text>
                <TextInput style={styles.inputs}
                     value={form.num_logradouro}
                    onChangeText={(text) => handleChange('num_logradouro', text)}
                    keyboardType="numeric"
                />
                <Text>Bairro</Text>
                <TextInput style={styles.inputs}
                     value={form.bairro}
                    onChangeText={(text) => handleChange('bairro', text)}
                />
                <Text>Cidade</Text>
                <TextInput style={styles.inputs}
                     value={form.cidade}
                    onChangeText={(text) => handleChange('cidade', text)} />
                <Text>Estado</Text>
                <TextInput style={styles.inputs}
                     value={form.estado}
                    onChangeText={(text) => handleChange('estado', text)} />
                <Text>Complemento</Text>
                <TextInput style={styles.inputs}
                     value={form.complemento}
                    onChangeText={(text) => handleChange('complemento', text)} />
            </View>

        </SafeAreaView>
    );
}