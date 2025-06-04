import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Modal,
    Alert,
    Pressable, ScrollView
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './styles';
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';
import { MaskedTextInput } from 'react-native-mask-text';
import AsyncStorage from '@react-native-async-storage/async-storage';
import host from '../../global';
import { useTema } from '../../context/themeContext';
export default function VirarInstituicao() {
    const [userId, setUserId] = useState(null);
    const [passo, setPasso] = useState(0);
    const [form, setForm] = useState({
        logradouro: '',
        num_logradouro: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: '',
        complemento: '',
        cnpj: '',
        nome_representante: '',
        documentos_representante: '',
        telefone: '',
    });
    const [modalVisible, setModalVisible] = useState(false); // Estado para o modal
    const [modalJaSolicitada, setModalJaSolicitadaVisible] = useState(false);
    const tema = useTema()
    const navigation = useNavigation(); // Hook para navegação

    

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const id = await AsyncStorage.getItem('idUser');
                if (id) {
                    setUserId(id);
                }
            } catch (error) {
                console.error('Erro ao buscar idUser do AsyncStorage:', error);
            }
        };

        const verificarInstituicaoSolicitada = async () => {
            try {
                const id = await AsyncStorage.getItem('idUser');
                const response = await axios.get(`http://${host}:8000/api/cursei/instituicao/verificarInstituicao/${id}`);
                if (response.data.sucesso === true) {
                    console.log('Instituição já solicitada.');
                  //  Alert.alert(
                  //      'Instituição já solicitada',
                  //      'Você já solicitou seu cadastro como instituição. Por favor, aguarde enquanto analisamos seus dados.'
                  // );

                    setModalJaSolicitadaVisible(true);
                }
                else {
                    console.log('Instituição ainda não solicitada.');
                    setModalJaSolicitadaVisible(false);
                }
            } catch (error) {
                console.log(error)

            }
        };


        fetchUserId();
        verificarInstituicaoSolicitada();
    }, []);

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
                Alert.alert('CEP inválido.');
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
            nome_representante: form.nome_representante,
            documentos_representante: form.documentos_representante,
            telefone: form.telefone,
            logradouro: form.logradouro,
            num_logradouro: form.num_logradouro,
            bairro: form.bairro,
            cidade: form.cidade,
            estado: form.estado,
            cep: form.cep,
            complemento: form.complemento,
            cnpj: form.cnpj,
            user_id: userId,
        };

        try {
            const response = await axios.post(`http://${host}:8000/api/instituicao`, dadosInstituicao, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log(response.data);

            // Limpa o formulário após o envio
            setForm({
                logradouro: '',
                num_logradouro: '',
                bairro: '',
                cidade: '',
                estado: '',
                cep: '',
                complemento: '',
                cnpj: '',
                nome_representante: '',
                documentos_representante: '',
                telefone: '',
            });

            // Exibe o modal
            setModalVisible(true);
        } catch (error) {
            console.error('Erro ao enviar dados:', error.response?.data || error.message);
        }
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setModalJaSolicitadaVisible(false);
        navigation.navigate('Configurações'); // Redireciona para a tela de configurações
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

            {/* Formulário */}
            {passo === 0 && (
                <View style={styles.formContainer}>
                    <View style={styles.tituloVirarInstituicao}>
                        <Ionicons
                            name="school-outline"
                            size={50}
                            color={tema.laranja}
                            style={{ marginRight: 10 }}
                        />
                        <Text style={[styles.textoTitulo, { color: tema.texto }]}>
                            Se torne uma instituição!
                        </Text>
                    </View>
                    <Text style={styles.textoVantagens}>Ao se tornar uma instituição, sua conta receberá vantagens exclusivas e receberá o selo de instituição no aplicativo. </Text>


                    <Text style={styles.tituloInputs}>CNPJ</Text>
                    <MaskedTextInput
                        mask="99.999.999/9999-99"
                        keyboardType='numeric'
                        style={[styles.inputs, { color: tema.texto, borderColor: tema.cinza }]}
                        placeholder="XX.XXX.XXX/0001-XX"
                        placeholderTextColor={tema.descricao}
                        value={form.cnpj}
                        onChangeText={(text) => handleChange('cnpj', text)}
                    />
                    <Text style={[styles.tituloInputs, { color: tema.texto }]}>Telefone</Text>
                    <MaskedTextInput
                        mask="(99) 99999-9999"
                        style={[styles.inputs, { color: tema.texto, borderColor: tema.cinza }]}
                        keyboardType='numeric'
                        placeholder="(XX) XXXXX-XXXX"
                        placeholderTextColor={tema.descricao}
                        value={form.telefone}
                        onChangeText={(text) => handleChange('telefone', text)}
                    />
                    <Text style={[styles.tituloInputs, { color: tema.texto }]}>Nome do representante</Text>
                    <TextInput
                        style={[styles.inputs, { color: tema.texto, borderColor: tema.cinza }]}
                        value={form.nome_representante}
                        onChangeText={(text) => handleChange('nome_representante', text)}
                    />
                    <Text style={[styles.tituloInputs, { color: tema.texto }]}>Documentos pessoais do representante</Text>
                    <MaskedTextInput
                        mask="999.999.999-99"
                        style={[styles.inputs, { color: tema.texto, borderColor: tema.cinza }]}
                        placeholder="XXX.XXX.XXX-XX"
                        placeholderTextColor={tema.descricao}
                        keyboardType='numeric'
                        value={form.documentos_representante}
                        onChangeText={(text) => handleChange('documentos_representante', text)}
                    />

                    <TouchableOpacity style={styles.botaoEnviar} onPress={() => setPasso(1)}>
                        <Text style={styles.textoBotao}>Próximo</Text>
                    </TouchableOpacity>
                </View>
            )}
    
            {passo === 1 && (
                <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.formContainer}>
                    <Text style={[styles.tituloInputs, { color: tema.texto }]}>CEP</Text>
                    <MaskedTextInput
                        mask="99999999"
                        keyboardType='numeric'
                        placeholder='XXXXX-XXX'
                        style={[styles.inputs, { color: tema.texto, borderColor: tema.cinza }]}
                        placeholderTextColor={tema.descricao}
                        value={form.cep}
                        onChangeText={(text) => handleChange('cep', text)}
                    />
                    <Text style={[styles.tituloInputs, { color: tema.texto }]}>Logradouro</Text>
                    <TextInput
                        style={[styles.inputs, { color: tema.texto, borderColor: tema.cinza }]}
                        value={form.logradouro}
                        onChangeText={(text) => handleChange('logradouro', text)}
                    />
                    <Text style={[styles.tituloInputs, { color: tema.texto }]}>Número</Text>
                    <TextInput
                        style={[styles.inputs, { color: tema.texto, borderColor: tema.cinza }]}
                        value={form.num_logradouro}
                        onChangeText={(text) => handleChange('num_logradouro', text)}
                        keyboardType="numeric"
                    />
                    <Text style={[styles.tituloInputs, { color: tema.texto }]}>Bairro</Text>
                    <TextInput
                        style={[styles.inputs, { color: tema.texto, borderColor: tema.cinza }]}
                        value={form.bairro}
                        onChangeText={(text) => handleChange('bairro', text)}
                    />
                    <Text style={[styles.tituloInputs, { color: tema.texto }]}>Cidade</Text>
                    <TextInput
                        style={[styles.inputs, { color: tema.texto, borderColor: tema.cinza }]}
                        value={form.cidade}
                        onChangeText={(text) => handleChange('cidade', text)}
                    />
                    <Text style={[styles.tituloInputs, { color: tema.texto }]}>Estado</Text>
                    <TextInput
                        style={[styles.inputs, { color: tema.texto, borderColor: tema.cinza }]}
                        value={form.estado}
                        onChangeText={(text) => handleChange('estado', text)}
                    />
                    <Text style={[styles.tituloInputs, { color: tema.texto }]}>Complemento</Text>
                    <TextInput
                        style={[styles.inputs, { color: tema.texto, borderColor: tema.cinza }]}
                        value={form.complemento}
                        onChangeText={(text) => handleChange('complemento', text)}
                    />
                    <View style={styles.viewBotaoEnviarPasso2}>
                        <TouchableOpacity style={[styles.botaoEnviarPasso2, { backgroundColor: tema.laranja }]} onPress={() => setPasso(0)}>
                            <Text style={[styles.textoBotao, { color: tema.textoBotao }]}>Voltar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.botaoEnviarPasso2, { backgroundColor: tema.azul }]} onPress={handleSubmit}>
                            <Text style={[styles.textoBotao, { color: tema.textoBotao }]}>Confirmar</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            )}

            {/* Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleCloseModal}
            >
                <Pressable style={styles.modalContainer} onPress={handleCloseModal}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Sua conta entrou em análise</Text>
                        <Text style={styles.modalMessage}>
                            Estamos avaliando sua solicitação para transformar sua conta em uma conta institucional.

                        </Text>
                        <Text style={[styles.modalMessage, { color: tema.descricao }]}>
                            Entraremos em contato em breve com o resultado. Agradecemos pela confiança!
                        </Text>
                    </View>
                </Pressable>
            </Modal>
        </View >
    );
}    