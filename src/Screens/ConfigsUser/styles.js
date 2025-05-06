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
});