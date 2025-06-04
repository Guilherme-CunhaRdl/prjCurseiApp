
import { SafeAreaView, StyleSheet, Text, View, StatusBar } from 'react-native';


const getStyles = (tema) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tema.fundo,
  },
  content: {
    flex: 1,
    
  },
  contCapa:{
    width:'100%',
    backgroundColor:tema.cinza,
    height:210,
    justifyContent:'center',
    alignContent:'center'
  },
  capa:{
    height:'100%',
    width:'100%',
    objectFit:'cover'
  },
  infoCont:{
    flex:1,
    paddingInline:15,
    gap:15
  },
  tituloCont:{
    width:'100%',
    marginTop:10,
  },
  titulo:{
    fontSize:24,
    fontWeight:'bold',
    color:tema.texto,

  },
  infosCont: {
    justifyContent:'space-between',
    height:180
  },
  infosBox: {
    flexDirection:'row',
    gap:10
  },
  imgPerfilCont: {
    height:45,
    width:45,
    borderRadius:100,
    justifyContent:'center',
    alignContent:'center',
    overflow:'hidden'

  },
  imgPerfil: {
    flex:1
  },
  IntsInfo: {
    justifyContent:'center'
  },
  nome: {
    fontSize:17,
    fontWeight:500,
    color:tema.texto,
  },
  arroba: {
    fontSize:14,
    fontWeight:400,
    color:tema.switchTrack
  },
  iconeInfosCont: {
    height:45,
    width:45,
    justifyContent:'center',
    alignContent:'center',
  },
  icon: {
    fontSize:35,
    color:tema.iconeInativo
  },
  data: {
    color:tema.descricao,
    maxWidth:220,
    fontWeight:500,
  },
  link: {
    maxWidth:'90%',
    overflow: 'hidden',
    color:tema.descricao,
  },
  buttonsCont: {
    width:'100%',
    flexDirection:'row',
    justifyContent:'space-between'
  },
  buttonAzul: {
    backgroundColor:tema.azul,
    paddingBlock:7,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:7,
    width:'49%'
  },
  buttonVazio: {
    backgroundColor:tema.fundo,
    borderWidth:1,
    borderColor:tema.azul,
    paddingBlock:7,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:7,
    width:'49%'
  },
  maisInfo: {
    paddingInline:15,
    marginTop:20,
    marginBottom:20
  },
  textMaisInfo: {
  fontSize:17,
  fontWeight:'bold',
  color:tema.texto
  },
  desc: {
    marginTop:10,
    color:tema.descricao,
  },


});

export default getStyles;
