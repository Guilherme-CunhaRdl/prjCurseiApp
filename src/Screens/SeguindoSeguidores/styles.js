import { StyleSheet } from "react-native";
import colors from "../../colors";
export default StyleSheet.create({
  container:{
    backgroundColor:colors.branco,
    flex:1
  },
   barraPesquisa:{
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        marginBottom: 16,
        paddingHorizontal: 15,
        height: 35,
        width: '100%',
        backgroundColor: '#EFEFEF',
      },
 barraContainer:{
        paddingHorizontal: 16,
        marginTop:10,
      },
      inputIcon: {
        marginRight: 10,
        fontSize: 20,
        color: 'gray',
      },
      input: {
        flex: 1,
        height: 50,
        color: '#666',
        fontSize: 16,
        fontWeight:500
      },
  titulo:{
    fontStyle:20,
    fontWeight:500,
    color:'#666',
    fontSize:15,
    paddingLeft:15,
    marginTop:10,
  },
  listaDeContas:{
    marginBottom:20,
    width:"100%",
    alignItems:'center',
  },
  FlatList:{
width:'90%',
  },
  conta:{
    width:'100%',
    flexDirection:'row',
    marginTop:25,
    justifyContent:'space-between'
  },
  contaDireita:{
    
     flexDirection:'row',
     alignItems:'center',
     width:'90%'
  },
  nomeUser:{
    fontSize:15,
    fontWeight:500,
    color:colors.preto,
  },
  arroba:{
    fontSize:13,
     fontWeight:500,
    color:colors.cinza,
  },
    fotoUsuario: {
    width: 60,
    height: 60,
    borderRadius: 200,
    marginRight: 12,
    backgroundColor: '#eee'
  },
  btnX:{
    justifyContent:'center'
  },
  btnXicon:{
    color:colors.cinza,
    fontSize: 30,
  },
  

})