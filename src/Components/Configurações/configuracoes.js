import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Dimensions } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import NaoInteressado from './modalNaoInteressado';
import Seguindo from './modalSeguindo';
import ModalBloquear from './modalBloquear';
import ModalReportar from './modalReportar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ModalPostagem from "../ModalPostagem";
import ModalExcluir from './modalExcluir';
import evento from '../../Screens/evento';
import ModalImpulsionar from './ModalImpulsionar';
import { useTema } from '../../context/themeContext';
const Configuracoes = ({ arroba, idPost, userPost, segueUsuario, tipo,evento }) => {
  const { tema } = useTema();

  const modalRef = useRef();

  const handleOpenModal = (tipo,idPost) => {
    if (modalRef.current) {
      modalRef.current.abrirModal(id);
    } else {
      console.log("modalRef ainda não está disponível.");
    }
  };


  const [isSeguindo, setIsSeguindo] = useState(segueUsuario === 1);
  let data = [];

  switch (tipo) {
    case 'post':
      data = [
        { label: 'Não interessado nesse post', value: 'naoInteressado', icon: 'eye-off-outline' ,cor:'#666'},
        { label: isSeguindo ? `Deixe de seguir @${arroba}` : `Siga @${arroba}`, value: 'Siga', icon: 'person-add-outline' ,cor:'#666'},
        { label: `Bloquear  @${arroba}`, value: 'Bloquear', icon: 'close-circle-outline' ,cor:'#666'},
        { label: `Reportar  @${arroba}`, value: 'Reportar', icon: 'alert-circle-outline' ,cor:'#666'},
      ];
      break;
      case 'postPerfil':
      data = [
        { label: 'Não interessado nesse post', value: 'naoInteressado', icon: 'eye-off-outline' ,cor:'#666'},
        { label: `Bloquear  @${arroba}`, value: 'Bloquear', icon: 'close-circle-outline' ,cor:'#666'},
        { label: `Reportar  @${arroba}`, value: 'Reportar', icon: 'alert-circle-outline' ,cor:'#666'},
      ];
      break;
    case 'perfil':
      data = [
         { label: `Bloquear  @${arroba}`, value: 'Bloquear', icon: 'close-circle-outline' ,cor:'#666'},
        { label: `Reportar  @${arroba}`, value: 'Reportar', icon: 'alert-circle-outline' ,cor:'#666'},
      ]
      break;
    case 'postProprio':
      data = [
        { label: `Editar post`, value: 'Editar', icon: 'create-outline' ,cor:'#666'},
        { label: `Excluir post`, value: 'Excluir', icon: 'alert-circle-outline' ,cor:'red'},
      ]
      break;
      case 'postProprioInst':
  data = [
        { label: `Editar post`, value: 'Editar', icon: 'create-outline' ,cor:'#666'},
        { label: `Excluir post`, value: 'Excluir', icon: 'alert-circle-outline' ,cor:'red'},
        { label: `Impulsionar post`, value: 'Impulsionar', icon: 'star-outline' ,cor:'#448FFF'},
      ]
      break;

  }


  const [menuVisible, setMenuVisible] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });

  const [modalNaoInteressadoVisible, setModalNaoInteressadoVisible] = useState(false);
  const [modalSeguindoVisible, setModalSeguindoVisible] = useState(false);
  const [modalBloquearVisible, setModalBloquearVisible] = useState(false);
  const [modalReportarVisible, setModalReportarVisible] = useState(false);
  const [modalExcluirVisible, setModalExcluirVisible] = useState(false);
  const [modalImpulsionarVisible, setModalImpulsionarVisible] = useState(false);

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
      case 'Editar':
      handleOpenModal();
      break;
       case 'Excluir':
        setModalExcluirVisible(true);
        break;
         case 'Impulsionar':
        setModalImpulsionarVisible(true);
        break;
      default:
        break;
    }
  };

 return (
  <View style={styles.container}>
    <TouchableOpacity ref={buttonRef} onPress={openMenu} style={styles.button}>
      <AntDesign name="ellipsis1" size={25} color={tema.texto} />
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
            {
              top: buttonPosition.y + 5,
              right: 0,
              backgroundColor: tema.modalFundo,
              shadowColor: tema.nome === 'escuro' ? '#FFF' : '#000',
            },
          ]}
        >
          {data.map((item) => (
            <TouchableOpacity
              key={item.value}
              style={styles.menuItem}
              onPress={() => handleItemSelected(item)}
            >
              <Ionicons name={item.icon} size={20} color={item.cor} style={styles.itemIcon} />
              <Text style={[styles.itemText, { color: item.cor }]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>

    {/* Modais */}
    <NaoInteressado
      visible={modalNaoInteressadoVisible}
      onClose={() => setModalNaoInteressadoVisible(false)}
      arroba={arroba}
      idPost={idPost}
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
      arroba={arroba}
      userPost={userPost}
    />
    <ModalReportar
      visible={modalReportarVisible}
      onClose={() => setModalReportarVisible(false)}
      arroba={arroba}
      idPost={idPost}
      userPost={userPost}
    />
    <ModalExcluir
      visible={modalExcluirVisible}
      onClose={() => setModalExcluirVisible(false)}
      arroba={arroba}
      idPost={idPost}
    />
    <ModalImpulsionar
      visible={modalImpulsionarVisible}
      onClose={() => setModalImpulsionarVisible(false)}
      arroba={arroba}
      idPost={idPost}
    />
    {evento ? (
      <ModalPostagem ref={modalRef} tipo="editaEvento" idPost={evento} />
    ) : (
      <ModalPostagem ref={modalRef} tipo="editar" idPost={idPost} />
    )}
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
    marginRight: 10,
    
    height:'100%'// Espaçamento entre ícone e texto
  },
  itemText: {
    fontSize: 15,
    color: '#333',
  },
});
