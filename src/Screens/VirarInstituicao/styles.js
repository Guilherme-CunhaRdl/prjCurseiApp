import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        alignItems: 'center', // centraliza horizontalmente
        justifyContent: 'center',

    },
    scrollContainer: {
        gap: 10,
      marginTop: 20,
},

tituloVirarInstituicao: {
        flexDirection: 'row',
        alignItems: 'center',
      justifyContent: 'center',},

    textoTitulo:{
        fontSize: 25,
        fontWeight: 'bold',
        color: '#787F89',
        textAlign: 'center',
    },
    textoVantagens:{
        fontSize: 16,
        color: '#787F89',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    formContainer: {
        width: '100%',
        paddingHorizontal: 20,
        gap: 10,

    },
    inputs: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#EDEDED',
        borderRadius: 10,
        backgroundColor: '#F8F8F8',
        paddingHorizontal: 10
    },
    tituloInputs: {
        color: '#787F89',
        fontSize: 16,
        fontWeight: '600',
    },
    viewBotao: {
        paddingTop: 20,
        width: '100%',
        paddingHorizontal: 20
    },
    botaoEnviar: {
        backgroundColor: '#F29500',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 50,
        borderRadius: 10,
    },
    textoBotao: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    viewBotaoEnviarPasso2: {
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom:50,
    },
    botaoEnviarPasso2: {
        backgroundColor: '#F29500',
        alignItems: 'center',
        justifyContent: 'center',
        width: '45%', // deixe um pouco menor que 50% para o gap
        height: 50,
        borderRadius: 10,
    },

    // Adicione no arquivo styles.js
modalContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
},
modalContent: {
  width: '80%',
  backgroundColor: '#fff',
  borderRadius: 10,
  padding: 20,
  alignItems: 'center',
},
modalTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 10,
  color: '#787F89',
},
modalMessage: {
  fontSize: 14,
  textAlign: 'center',
  marginBottom: 20,
  color: '#00000063',
},
modalButton: {
  backgroundColor: '#007BFF',
  padding: 10,
  borderRadius: 5,
},
modalButtonText: {
  color: '#fff',
  fontSize: 16,
},
});