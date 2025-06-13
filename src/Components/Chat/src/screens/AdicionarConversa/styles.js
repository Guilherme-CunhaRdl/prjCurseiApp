import { StyleSheet } from "react-native";
import colors from '../../../../../colors'
export default StyleSheet.create({

    container:{
        flex: 1,
        backgroundColor: colors.branco,
        
    },
    header: {
        backgroundColor: colors.branco,
        elevation: 0,
        
    },
    titPag:{
    
    fontSize: 20,
    fontWeight: 'bold',
    color: "#000",

    },
    iconSmall: { 
        width: 22, 
        height: 22, 
        marginHorizontal: 6 ,
        marginRight: 20
      },
      customSearchbar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EFEFEF',
        borderRadius: 10,
        marginHorizontal: 16,
        marginTop: 12,
        paddingHorizontal: 12,
        height: 48,
      },
      
      searchIcon: {
        width: 18,
        height: 18,
        tintColor: '#A7A7A7',
        marginRight: 8,
      },
      
      customSearchInput: {
        flex: 1,
        fontSize: 13,
        fontWeight: 600,
        color: '#000',
        padding: 0,
        margin: 0,
        outlineStyle: 'none',           
     
      },
      containerAddGrupo:{
        flex: 1,
        width: '100%',
        alignItems: 'center'
      },
      boxAddGrupo:{
        width: '80%',
        height: 70,
        flexDirection: 'row',
        marginTop: 30
        
      },
      conteudoIcone:{
        width: '20%',
        height: '100%',
        marginRight: 20
      },
      conteudoTexto:{
        width: '80%',
        height: '100%',
        flexDirection: 'column'
      },
      rowNomeSeguir:{
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
         justifyContent: 'space-between'
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
      containerSeguidores:{
        width: '100%',
        
      },
      flatlistSeguidores:{
        width: '90%',
        marginLeft: 20,
      },
      boxIcone:{
        borderRadius: 30,
        width: 60,
        height: 60,
        backgroundColor: '#EFEFEF',
        justifyContent: 'center',
        alignItems: 'center'

      },
      iconeAdd:{
        fontSize: 30,
        
      },
      containerAddUsuario:{
        width: '100%',
        alignItems: 'center',
        padding: 10,
        paddingTop: 20
      
      },
      boxAddUsuario:{
        width: '90%',
        height: 60,
        flexDirection: 'row',
        marginTop: 10,
        
      },
      imgUsuario:{
        width: '100%', 
        height: '100%', 
        objectFit: 'cover',
        borderRadius: 30
      },
      containerModal:{
        flex: 1,
        backgroundColor: colors.branco,
        width: '100%'
      },
      headerModal:{
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
      },
      containerImgCanal:{
        height: 300,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      },
      boxImgCanal:{
        height: 200,
        width: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      },
      viewFotoCanal:{
        backgroundColor: colors.cinza,
        borderRadius: 15,
        width: 200,
        height: 200,
        backgroundColor: 'red'
      },
      imgCanal:{
        width:'100%',
        height: '100%',
        borderRadius: 15
      },
      textMudarImg:{
        fontWeight: '500',
        color: colors.azul,
        marginBlock: 5
      },
      boxInputs:{
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
      },
      inputContainer: {
        flexDirection: 'row',
        width: '80%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e1e1e1',
        borderRadius: 8,
        marginBottom: 16,
        paddingLeft: 12,
        padding: 10,
        backgroundColor: '#f8f8f8',

      },
      inputIcon: {
        marginRight: 10,
        fontSize: 20,
        color: 'gray',
      },
      input: {
        width: '100%',
        color: '#333',
        height: '100%',
        fontSize: 16,
         outlineStyle: "none",        // Remove borda azul no focus
      },
      botaoCriarCanal: {
        backgroundColor: '#2196F3',
        borderRadius: 8,
        height: 50,
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
      },
      botaoCriarCanalText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
      },
      barraContainer:{
    alignSelf: 'center',
    flexDirection: 'row',
    width: '97%',
    height: 60,
    justifyContent: 'space-around',
    paddingTop:15,
    borderBottomWidth: 2,
    borderColor: '#f9f9f9',
    // backgroundColor:'red'
  },
  opcao:{
    paddingHorizontal: 9,
    height: '100%',
    width: '15%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  opcaoIcon:{
    fontSize: 30,
    color: colors.cinza,
  },
  opcaoAtiva:{
    fontSize: 25,
    color: colors.preto,
    borderBottomWidth: 2,
    borderColor: colors.azul,
    height: '107%',

  },
  IconeAtivo:{
    fontSize: 25,
    color: colors.preto,
    borderBottomWidth: 0,

  },
  opcaoInativo:{
    fontSize: 25,
    color: colors.cinza,
    borderBottomWidth: 0,
  },
  iconeInativo:{
    fontSize: 25,
    color: colors.cinza,
  },
})