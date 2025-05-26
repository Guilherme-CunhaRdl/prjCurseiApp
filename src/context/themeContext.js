import React, { createContext, useState, useEffect, useContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { temaClaro, temaEscuro } from '../themes';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [modoEscuro, setModoEscuro] = useState(false);
  const [tema, setTema] = useState(temaClaro);

  useEffect(() => {
    const carregarTema = async () => {
      const armazenado = await AsyncStorage.getItem('modoEscuro');
      const ehEscuro = armazenado === 'true';
      setModoEscuro(ehEscuro);
      setTema(ehEscuro ? temaEscuro : temaClaro);
    };
    carregarTema();
  }, []);

  const alternarTema = async () => {
    const novoModo = !modoEscuro;
    setModoEscuro(novoModo);
    setTema(novoModo ? temaEscuro : temaClaro);
    await AsyncStorage.setItem('modoEscuro', novoModo.toString());
  };

  return (
    <ThemeContext.Provider value={{ tema, modoEscuro, alternarTema }}>
      {children}
    </ThemeContext.Provider>
  );
};
export const useTema = () => useContext(ThemeContext);