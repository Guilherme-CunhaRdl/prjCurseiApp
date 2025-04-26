import React, { useState } from 'react';
import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './styles';
import Home from '../Home';
import Cadastro from '../Cadastro';

import { useNavigation } from "@react-navigation/native";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigation = useNavigation();

  {/*Link Login temporario*/ }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View style={styles.logoContainer}>
        <Image
          source={require('../../../assets/curseiLogo.png')}
          style={styles.logo}
        />
        <Text style={styles.welcomeText}>Bem-vindo de Volta</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Ionicons style={styles.inputIcon} name="mail"></Ionicons>
          <TextInput
            style={styles.input}
            placeholder="Coloque seu Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons style={styles.inputIcon} name="key"></Ionicons>
          <TextInput
            style={styles.input}
            placeholder="Coloque sua Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.visibilityIcon}
          >
            <Text>{showPassword ? <Ionicons style={styles.inputIcon} name="eye-off"></Ionicons> : <Ionicons style={styles.inputIcon} name="eye"></Ionicons>}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.loginButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.loginButtonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.forgotPasswordButton}>
          <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>ou continue com</Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialIconG}>G</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialIconF}>f</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Não tem uma conta? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Cadastro')}
          >
            <Text style={styles.signupLink}>Cadastra-se</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
