import { StyleSheet } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  containerHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    alignItems: 'center',
    paddingHorizontal: '3%',
  },
  tituloHeader: {
    fontSize: 20,
    fontWeight: '600'
  },
  conteudoStory: {
    flex: 1,
    position: 'relative',
  },
  imagemStory: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  conteudoStory: {
    flex: 1,
    backgroundColor: 'grey',
  },
  overlayContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  containerComentario: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    paddingHorizontal: '3%',
    paddingBottom: 15,
  },
  containerInfoStory: {
    flex: 0.80,
    margin: '1%'
  },
  containerInfoPerfil: {
    flex: 0.60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  containerImgPerfil: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: "grey"
  },
  imgPerfil: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 50,
  },
  containerDescPost: {
    flex: 0.40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  descricaoTexto: {
    flexShrink: 1,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  containerBotoesFlutuantes: {
    position: 'absolute',
    right: 15,
    bottom: 40,
    zIndex: 3,
    gap: 20,
  },
  botaoFlutuante: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoAcao: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  configuracoesStory: {
    flex: 0.20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
    paddingRight: 10,
  },
  botaoAcao: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
  },
});