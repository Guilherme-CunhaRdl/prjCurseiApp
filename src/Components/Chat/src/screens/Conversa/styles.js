import { StyleSheet } from "react-native";
import colors from '../../../../../colors';
import { useTema } from "../../../../../context/themeContext";
const useStyles = () =>{
const {tema } = useTema()

    return StyleSheet.create({
  container: { flex: 1, backgroundColor: tema.fundo },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: tema.fundo,
    elevation: 2,
  },
  headerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  viewCabecalho:{
    width: '80%',
    flexDirection: 'row'
  },
  nome: {
    fontWeight: "bold",
    fontSize: 14,
    color: tema.texto
  },
  rowNomeSeguir:{
        flexDirection: 'row',
        width: '90%',
        alignItems: 'center',
         justifyContent: 'space-between'
      },
      viewBotaoSeguir:{
        width: '30%',
        justifyContent: 'flex-end',
        alignItems: 'center',
      },
      botaoSeguir:{
        padding: 7,
        width: 80,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.azul,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: colors.azul
      },
      botaoSeguido:{
        padding: 7,
        width: 80,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.preto,
        flexDirection: 'row'
      },
      textSeguir:{
        color: colors.branco
      },
  usuario: {
    fontSize: 12,
    color: tema.texto
  },
  iconSmall: {
    width: 22,
    height: 22,
    marginHorizontal: 6,
  },
  chatContent: {
    padding: 16,
  },
  mensagemRecebida: {
    alignSelf: "flex-start",
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    padding: 4,
    marginBottom: 10,
    maxWidth: "62%",
    shadowColor: colors.preto,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 2

  },
  mensagemEnviada: {
    alignSelf: "flex-end",
    backgroundColor: colors.msgEnviador,
    padding: 4,
    borderRadius: 8,
    marginBottom: 10,
    maxWidth: "62%",
  },
  viewTextoMsg: {
    padding: 3,
  },
  imgMensagem: {
    width: "100%",
    aspectRatio: 3 / 4,
    height: 300,
    borderRadius: 6,
    marginBottom: 3,
  },
  textoMsgEnviado: { color: colors.branco, fontSize: 14 },
  textoMsgRecebido: { color: colors.preto, fontSize: 14 },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: tema.nome === 'escuro' ? tema.fundo : '#f9f9f9',
    justifyContent: 'space-between',
    padding: 4,
    margin: 16,
    borderRadius: 16,
  },
  inputContainerModal: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between',
    backgroundColor: tema.nome === 'escuro' ? tema.fundo : '#f9f9f9',
    padding: 4,
    margin: 16,
    borderRadius: 16,
    width: '100%'
  },
  viewIcones:{
    flexDirection:'row',
    width: '20%', 
    justifyContent: 'space-around', 
    alignItems: 'center'

  },
  input: {
    fontSize: 14,
    paddingVertical: 4,
    paddingHorizontal: 8,
    color: "#000",
    width: '100%',
  height: 50    
  },
  viewSendButton:{
    width: '15%',
    alignItems: 'flex-end',
  },
  containerModalFoto: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-start",

    backgroundColor: "transparent",
  },
  boxModalFoto: {
    width: "100%",
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.950)',
    shadowColor: colors.preto,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    opacity: 1,

  },
  cabecalhoModalFoto: {
    width: "100%",
    flexDirection: "row",
    padding: 6,
  },
  viewImgModalFoto: {
    height: "90%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  fotoModalFoto: {
    width: "100%",
    height: "100%",
  },
  imgModalFoto: {
    width: "100%",
    height: "100%",
  },
  boxMsgModalFoto: {
    position: "absolute",
    bottom: 10,
    left: 5,
    width: "100%",
    height: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  inputModalFoto: {
    shadowColor: colors.preto,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    marginRight: 10,
  },
  boxEnviar: {
    width: 45,
    height: 45,
    borderRadius: "50%",
    backgroundColor: colors.azul,
    justifyContent: "center",
    alignItems: "center",
  },
  headerPost:{
    padding: 8,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center'
  },
  imgPerfil:{
    height: 30,
    width: 30,
    borderRadius: 100,
    marginRight: 10
  },
  footerPost:{
    width: '100%',
    padding: 10
  },
  sendButton:{
    width: 45,
    height: 45,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },
viewPlayer:{
  height: 50,
  width: 50,
  borderRadius: 100,
  backgroundColor: '#000',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'absolute',
  left: 90,
  top: 180
},
},

    )};
export default useStyles;