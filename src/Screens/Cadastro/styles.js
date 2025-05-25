import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 2,
    backgroundColor: '#FFFFFF',
  },
  capa: {
    flex: 0.6,
    height: 200,
    backgroundColor: '#4B97FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 8,
  },
  banner:{
    width:'100%',
    height:'100%',
    objectFit:'cover',
    position:'absolute',
  },
  userContainer: {
    alignItems: 'center',
    marginTop: -40,
  },
  userPhotoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  user: {
    width: 120,           
    height: 120,          
    paddingLeft: 10,
    borderRadius: 70,
    borderWidth: 4,
    borderColor:'white',
    bottom: 55, 
    left: '13%',
    transform: [{ translateX: -40 }], 
  },
  cadastro: {
    flex:2,
    paddingHorizontal: 24,
    paddingTop: 24,
    bottom:55,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#222222',
    bottom:13,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 8,
  },
  atSymbol: {
    fontSize: 16,
    color: '#A0A0A0',
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
    height: '100%',
  },
  eyeIcon: {
    padding: 8,
  },
  continueButton: {
    backgroundColor: '#4B97FF',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    alignContent: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: 8,
  },
  loginText: {
    fontSize: 16,
    color: '#A0A0A0',
    marginBottom: 5,
    textAlign: 'center',
  },
  loginLink: {
    fontSize: 16,
    color: '#007bff',
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 14,
    color: '#7E7E7E',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  interesseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#F5F8FF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E8E8F0',
  },
  interesseSelecionado: {
    backgroundColor: '#4B97FF',
    borderColor: '#4B97FF',
  },
  iconContainer: {
    marginRight: 8,
  },
  interesseText: {
    fontSize: 14,
    color: '#333333',
  },
  textoSelecionado: {
    color: '#FFFFFF',
  },
  btFinalizar: {
    backgroundColor: '#4B97FF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 16,
  },
  btVoltar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  buttomText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  voltarText: {
    color: '#4B97FF',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: 'bold',
  },
  openModalButton: {
    backgroundColor: '#007bff',
    padding: 10,
    marginTop: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  openModalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },


  textoErro: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 8,
  },
  inputErro: {
    borderColor: 'red',
    borderWidth: 1,
  }
});

export default styles;