import { StyleSheet } from "react-native";

export default StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'white',
      },
    containerCont:{
        flex: 1,
    },
    header:{
        width: "100%",
        height: 200,
        backgroundColor: 'blue',
    },
    banner:{
      width:'100%',
      height:'100%',
      objectFit:'cover',
    },
    perfilContainer:{
        paddingHorizontal: 27,
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
        paddingTop: 5,
        fontSize: 14,
        fontWeight: '400'
    },
    seguidorContainer:{
        flexDirection: 'row',
        alignSelf: 'center',
        gap: 30,
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
        paddingTop: 30,
        paddingBottom: 30,
        gap: 20,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    editarButton:{
        width: 250,
        height: 30,
        borderWidth: 1,
        borderRadius: 5,
        borderBottomColor: 'gray',
        alignItems: 'center',
        justifyContent: 'center'
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
        fontSize: 20,
        fontWeight: 'bold',
    },
    storysContainer:{
        flexDirection: 'row',
        paddingTop: 20,
        gap: 10,
        paddingHorizontal: 16,
      },
      storys:{
        alignItems: 'center',
      },
      circuloStorys:{
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'gray',
        borderRadius: 60,
        height: 57,
        width: 57,
        marginLeft: 5,
        marginRight: 5,
        borderWidth: 3,
      },
      nomeStorys:{
      },
      barraContainer:{
        paddingTop: 30,
        alignSelf: 'center',
        flexDirection: 'row',
        width: 323,
        justifyContent: 'space-arround',
        gap: 40,
        paddingTop: 10,
        paddingBottom: 5,
        borderBottomWidth: 2,
        borderBottomColor: 'gray',
      },
      opcao:{
        paddingHorizontal: 9,
      },
      opcaoIcon:{
        fontSize: 34,
      },
      feedContainer: {
        flex: 1,
        paddingHorizontal: 16,
      },
      postContainer: {
        paddingTop: 20,
        marginBottom: 20,
        paddingHorizontal: 10,
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
        width: 50,
        height: 50,
        resizeMode: 'contain',
        borderRadius: 40,
      },

})