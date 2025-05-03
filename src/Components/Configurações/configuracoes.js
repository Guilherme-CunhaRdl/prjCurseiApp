import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Dimensions } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import NaoInteressado from './modalNaoInteressado';
import Seguindo from './modalSeguindo';
import ModalBloquear from './modalBloquear';
import ModalReportar from './modalReportar';


const Configuracoes = ({arroba,idPost,userPost,segueUsuario}) => {

const [isSeguindo, setIsSeguindo] = useState(segueUsuario === 1);

  const data = [
    { label: 'Não interessado nesse post', value: 'naoInteressado', icon: 'meh' },
    { label: isSeguindo ? `Deixe de seguir @${arroba}` : `Siga @${arroba}`, value: 'Siga', icon: 'smileo' },
    { label: `Bloquear  @${arroba}`, value: 'Bloquear', icon: 'frowno' },
    { label: `Reportar  @${arroba}`, value: 'Reportar', icon: 'exclamationcircleo' },
  ];
  
  const [menuVisible, setMenuVisible] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });

  const [modalNaoInteressadoVisible, setModalNaoInteressadoVisible] = useState(false);
  const [modalSeguindoVisible, setModalSeguindoVisible] = useState(false);
  const [modalBloquearVisible, setModalBloquearVisible] = useState(false);
  const [modalReportarVisible, setModalReportarVisible] = useState(false);

  const buttonRef = useRef(null);

  const openMenu = () => {
    buttonRef.current.measure((fx, fy, width, height, px, py) => {
      setButtonPosition({ x: px, y: py + height });
      setMenuVisible(true);
    });
  };

  const handleItemSelected = (item) => {
    setMenuVisible(false); // Fecha o menu
    console.log('Item selecionado:', item.value);

    // Agora abre o modal correspondente
    switch (item.value) {
      case 'naoInteressado':
        setModalNaoInteressadoVisible(true);
        break;
      case 'Siga':
        setModalSeguindoVisible(true);
        setIsSeguindo(prev => !prev); 
        break;
      case 'Bloquear':
        setModalBloquearVisible(true);
        break;
      case 'Reportar':
        setModalReportarVisible(true);
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity ref={buttonRef} onPress={openMenu} style={styles.button}>
        <AntDesign name="ellipsis1" size={25} color="black" />
      </TouchableOpacity>

      {/* Menu */}
      <Modal
        transparent
        visible={menuVisible}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setMenuVisible(false)}
        >
          <View
            style={[
              styles.menuContainer,
              { top: buttonPosition.y + 5, right: 0 }, // Alinha o menu à direita
            ]}
          >
            {data.map((item) => (
              <TouchableOpacity
                key={item.value}
                style={styles.menuItem}
                onPress={() => handleItemSelected(item)}
              >
                <AntDesign name={item.icon} size={20} color="#555" style={styles.itemIcon} />
                <Text style={styles.itemText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modais */}
      <NaoInteressado
        visible={modalNaoInteressadoVisible}
        onClose={() => setModalNaoInteressadoVisible(false)}
      />
      <Seguindo
        visible={modalSeguindoVisible}
        onClose={() => setModalSeguindoVisible(false)}
        arroba={arroba}
        userPost={userPost}
      />
      <ModalBloquear
        visible={modalBloquearVisible}
        onClose={() => setModalBloquearVisible(false)}
      />
      <ModalReportar
        visible={modalReportarVisible}
        onClose={() => setModalReportarVisible(false)}
        arroba={arroba}
        idPost={idPost}
        userPost={userPost}
        
      />
    </View>
  );
};

export default Configuracoes;

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
    
  },
  button: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  menuContainer: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 8,
    width: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    right: 0, // Faz o menu aparecer à direita
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // Alinha os itens à esquerda
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  itemIcon: {
    marginRight: 10, // Espaçamento entre ícone e texto
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
});
