import { StyleSheet } from "react-native";
import colors from '../../colors'
export default StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'white',
       
      },
    containerCont:{
        flex: 1,
       
    },
      headerTopo: {
        backgroundColor: colors.branco,
        elevation: 0,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-start',
        gap:10,
        height:50,
        paddingInline:15
    },
    header:{
        width: "100%",
        height: 200,
        backgroundColor: '#E3E3E3',
        
    },
    banner:{
      width:'100%',
      height:'100%',
      objectFit:'cover',
    },
    perfilContainer:{
        paddingHorizontal: 27,
        height: 75
    },
    itensContainer:{
        flexDirection: 'row',
        paddingTop: 10,
        gap: 20,
    },
    imgContainer:{
        backgroundColor: 'white',
        alignItems: 'center',
        borderRadius: 80,
        height: 100,
        width: 100,
        top: -38,
        overflow:'hidden',
        borderColor:'white',
        borderWidth:3
        
    },
    userImg:{
     
      width:'100%',
      height:'100%',
      objectFit:'cover',
      
    },
    infoContainer:{
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    boxNomeUser:{
     flexDirection:'row',
     alignItems:'center',
     gap:10
     
    },
    nomeUser:{
        fontWeight: 'bold',
        fontSize: 20,
    },
    arrobaUser:{
        fontSize: 14,
        color: 'gray',
        fontWeight: '500'
    },
    bioUser:{
        textAlign: 'left',
        width: '70%',
        height: 'auto'
    },
    textBioUser:{
      paddingTop: 5,
      fontSize: 14,
      fontWeight: '400',
      textAlign: 'left',
      
  },
    containerBioSeguidores:{
        flexDirection: 'column',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    boxSeguidores:{
      flexDirection: 'row',
      alignSelf:'flex-start',
      gap: 30,
      width: '70%',
      marginTop: 20,
      marginLeft:25
  },
    numSeg:{
        fontWeight: 'bold',
    },
    seguidores:{
        flexDirection: 'row',
        gap: 10,
    },
    seguindo:{
        flexDirection: 'row',
        gap: 10,
    },
    editarContainer:{
        paddingTop: 10,
        paddingBottom: 15,
        gap: 20,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    buttonContainer:{
      width:'100%',
      flexDirection:'row',
      justifyContent:'space-evenly',
      alignItems:'center'
    },
    editarButton:{
        width: '70%',
        height: 35,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#E3E3E3',
        alignItems: 'center',
        justifyContent: 'center'
    },
    textEditarPerf:{
      fontWeight: 500
    },
    textSeguidores:{
        gap: 10,
        fontWeight: '600',
        color: 'gray',
    },
    textSeguindo:{
        flexDirection: 'row',
        gap: 10,
        fontWeight: '600',
        color: 'gray',
    },
    settingIcon:{
        fontSize: 25,
        fontWeight: 700,
    },
    instIcon:{
      fontSize: 24,
      fontWeight: 700,
      color:colors.azul
  },
  buttonCompleto:{
    width: '40%',
    height: 32,
    borderWidth: 0,
    borderRadius: 5,
    borderColor: '#E3E3E3',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight:500,
    backgroundColor:colors.azul,
    color:colors.branco,
    fontFamily:'arial'
  },
  buttonVazado:{
    width: '40%',
    height: 32,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#E3E3E3',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily:'arial'
    
  },
    storysContainer:{
        flexDirection: 'row',
        gap: 10,
        paddingHorizontal: 16,
      },
      storys:{
        alignItems: 'center',
      },
      circuloStorys:{
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#E3E3E3',
        borderRadius: 60,
        height: 60,
        width: 60,
        marginLeft: 5,
        marginRight: 5,
        borderWidth: 2,
      },
      nomeStorys:{
      },
      barraContainer:{
        alignSelf: 'center',
        flexDirection: 'row',
        width: '97%',
        justifyContent: 'space-around',
        
        // gap: 40,
        paddingTop: 20,
        borderBottomWidth: 2,
        borderBottomColor: '#F5F5F5',
        // backgroundColor:'red'
      },
      opcao:{
        paddingHorizontal: 9,
        height: '110%',
        width: '15%',
        alignItems: 'center'
      },
      opcaoIcon:{
        fontSize: 25,
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
      feedContainer: {
        flex: 1,
        paddingHorizontal: 16,
      },
      postContainer: {
        paddingTop: 20,
        marginBottom: 20,
        minHeight:600,
        paddingHorizontal: 10,
        flexGrow:1,
      },
      postHeader: {
        marginBottom: 8,
      },
      institutionText: {
        fontSize: 14,
        color: '#333',
      },
      postText: {
        fontSize: 14,
        marginBottom: 10,
      },
      postContent: {
        height: 120,
        backgroundColor: '#F0F0F0',
        borderRadius: 8,
        marginBottom: 8,
      },
      postActions: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
      },
      actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
      },
      actionText: {
        marginLeft: 5,
        fontSize: 12,
        color: '#666',
      },
      sendButton: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#3B82F6',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
      },
      imgLogo:{
        width: '90%',
        height: '90%',
        resizeMode: 'contain',
        borderRadius: 40,
      },
      dropdown: {
            margin: 16,
            height: 50,
            width: 150,
            backgroundColor: '#EEEEEE',
            borderRadius: 22,
            paddingHorizontal: 8,
          },
          imageStyle: {
            width: 24,
            height: 24,
            borderRadius: 12,
          },
          placeholderStyle: {
            fontSize: 16,
          },
          selectedTextStyle: {
            fontSize: 16,
            marginLeft: 8,
          },
          iconStyle: {
            width: 20,
            height: 20,
          },

})