import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import NaoInteressado from './modalNaoInteressado';
import Seguindo from './modalSeguindo';
import ModalBloquear from './modalBloquear';
import ModalReportar from './modalReportar';
import { transform } from '@babel/core';

const data = [
  { label: 'Não interessado nesse post', value: 'naoInteressado', icon: 'meh' },
  { label: 'Siga @nome', value: 'Siga', icon: 'smileo' },
  { label: 'Bloquear @nome', value: 'Bloquear', icon: 'frowno' },
  { label: 'Reportar @nome', value: 'Reportar', icon: 'exclamationcircleo' },
];

const Configuracoes = () => {
  const [value, setValue] = useState(null);
  const [modalNaoInteressadoVisible, setModalNaoInteressadoVisible] = useState(false);
  const [modalSeguindoVisible, setModalSeguindoVisible] = useState(false);
  const [modalBloquearVisible, setModalBloquearVisible] = useState(false);
  const [modalReportarVisible, setModalReportarVisible] = useState(false);

  const handleItemSelected = (item) => {
    setValue(item.value);
    console.log('Item selecionado:', item);

    switch (item.value) {
      case 'naoInteressado':
        setModalNaoInteressadoVisible(true);
        break;
      case 'Siga':
        setModalSeguindoVisible(true);
        break;
        case 'Bloquear':
          setModalBloquearVisible(true);
          break;
        case 'Reportar':
          setModalReportarVisible(true);
          break;
      default:
        // Pode adicionar lógica para os outros itens se quiser
        break;
    }
  };

  return (
    <View style={styles.containerFundo}>
      <Dropdown
        style={styles.dropdown}
        mode='modal'
        data={data}
        labelField="label"
        valueField="value"
        value={value}
        onChange={handleItemSelected}
        placeholder=""
        iconStyle={{ width: 0, height: 0 }}
        renderLeftIcon={() => (
          <AntDesign name="ellipsis1" size={25} color="black" />
        )}
        selectedTextStyle={styles.selectedTextHidden}
        renderItem={(item, selected) => (
          <View style={styles.item}>
            <AntDesign name={item.icon} size={20} color="#555" style={styles.itemIcon} />
            <Text style={styles.itemText}>{item.label}</Text>
          </View>

        )}
      />

      {/* Modal "Não interessado" */}
      <NaoInteressado
        visible={modalNaoInteressadoVisible}
        onClose={() => setModalNaoInteressadoVisible(false)}
      />

      {/* Modal "Seguindo" */}
      <Seguindo
        visible={modalSeguindoVisible}
        onClose={() => setModalSeguindoVisible(false)}
      />
      <ModalBloquear
        visible={modalBloquearVisible}
        onClose={() => setModalBloquearVisible(false)}
      />
      <ModalReportar
        visible={modalReportarVisible}
        onClose={() => setModalReportarVisible(false)}
      />  
    </View>
  );
};

export default Configuracoes;

const styles = StyleSheet.create({
  dropdown: {
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
  },
  containerFundo:{

  },
  selectedTextHidden: {
    display: 'none',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  itemIcon: {
    marginRight: 10,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
});
