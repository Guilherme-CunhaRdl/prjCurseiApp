import { StyleSheet } from "react-native";
import colors from "../../colors";

export default StyleSheet.create({
  
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        overflow: 'scroll',
        alignItems:'center',
        
      },
      textoTitulo:{
        fontSize:19,
        fontFamily:'Arial',
        color: '#448FFF',
      },
      configs:{
        justifyContent:'space-between',
        alignItems:'flex-start',
        gap:35,
        paddingTop: 40,
        width: '90%',
        flexDirection:'column',
      },
      textoDescricao:{
        fontSize:13,
        color:'#999999',
        marginLeft: 45,
      },
      textoTituloInstitucional:{
        fontSize:20,
        fontFamily:'Arial',
        color: '#F29500',
      },
      textoTituloLogoff:{
        fontSize:20,
        fontFamily:'Arial',
        color: colors.vermelho,
      },

      modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    modalMessage: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButton: {
        backgroundColor: '#F29500',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    modalButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});