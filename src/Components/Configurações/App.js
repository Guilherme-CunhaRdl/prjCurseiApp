import React from 'react';
import { View, StyleSheet } from 'react-native';
import ModalConfirmacao from './modalConfirmacao';
import Configuracoes from './configuracoes';
import NaoInteressado from './modalNaoInteressado';

const App = () => {
  return (
    <View style={styles.container}>
      <Configuracoes/>  
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
