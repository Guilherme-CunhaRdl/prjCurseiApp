import { StyleSheet } from "react-native";

export default StyleSheet.create({
  
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
      },
      ContainerCont:{
        flex: 1,
      },
      feedContainer: {
        flex: 1,
        paddingHorizontal: 16,
      },
      postContainer: {
        paddingTop: 20,
        marginBottom: 20,
      },
      postHeader: {
        marginBottom: 8,
        flexDirection:  'row'
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
        gap: 5,
      },
      actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
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
      Header:{
        flex: 3,
        width: 360,
        paddingTop: 10,
        paddingBottom: 30,
        borderBottomWidth: 2,
        borderBottomColor: 'gray',
      },
      userContainer:{

      },
      infoUser:{
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between'
      },
      notifyContainer:{
        flexDirection: 'row',
        gap: 30,
      },
      notifyIcon:{
        fontSize: 25
      },
      curseiIcon:{
        resizeMode: 'contain',
        height: 30,
        width: 32,
      },
      textUser:{
        fontWeight: '600',
        fontSize: '17px'
      },
      msgUser:{

      },
      textInicio:{
        paddingHorizontal: 16,
        color: 'gray',
        fontWeight: '500'
      },
      storysContainer:{
        flexDirection: 'row',
        paddingTop: 20,
        gap: 10,
      },
      storys:{
        alignItems: 'center',
      },
      circuloStorys:{
        marginLeft: 5,
        marginRight: 5,
        borderColor: 'gray',
        borderRadius: 60,
        height: 80,
        width: 80,
        borderWidth: 3,
        alignItems: 'center',
      },
      nomeStorys:{
      },
      imgLogo:{
        width: 70,
        height: 70,
        resizeMode: 'contain',
        borderRadius: 40,
      },
      containerPost:{
        width: 130,
        height: 10,
      },
      containerConf:{
        alignSelf: 'center',
        paddingLeft: 5,
      }

});