import { StyleSheet } from "react-native";

export default function criarEstilos(tema) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: tema.fundo,
      alignItems: 'center',
    },
    configs: {
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 35,
      paddingTop: 40,
      width: '90%',
    },
    textoTitulo: {
      fontSize: 19,
      fontFamily: 'Arial',
      color: tema.texto,
    },
    textoDescricao: {
      fontSize: 13,
      color: tema.descricao,
      marginLeft: 35,
    },
    textoTituloInstitucional: {
      fontSize: 20,
      fontFamily: 'Arial',
      color: tema.laranja,
    },
    textoTituloLogoff: {
      fontSize: 20,
      fontFamily: 'Arial',
      color: tema.vermelho,
    },
    linhaConfig: {
      flexDirection: "row", 
      alignItems: "center", 
      justifyContent: "space-between", 
      width: "100%"
    },
    grupoIconeTexto: {
      flexDirection: "row", 
      alignItems: "center", 
      gap: 10
    },
    icone: {
      fontSize: 25,
      color: tema.icone
    }
  });
}