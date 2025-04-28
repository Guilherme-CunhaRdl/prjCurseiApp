import { StyleSheet } from "react-native";

export default StyleSheet.create({
  
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        overflow: 'scroll'
      },
      ContainerCont:{
        flex: 1,
      },
      feedContainer: {
        flex: 1,
        paddingHorizontal: 10,
      },
      postContainer: {
        paddingTop: 20,
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
        position: 'fixed',
        right: 20,
        bottom: 70,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#3B82F6',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
      },
      Header:{
        flex: 0.36,
        paddingBottom:10,
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#C5C5C5',
        
      },
      userContainer:{
        paddingVertical: 10,
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
        alignItems: 'center',
        justifyContent: 'center',
      },
      storys:{
        alignItems: 'center',
        justifyContent:'center',
        marginLeft: 10,
      },
      circuloStorys:{
        height: 80,
        width: 80,
        alignItems: 'center',
        justifyContent: 'center',
      },
      nomeStorys:{
        color:"grey",
      },
      imgLogo:{
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 40,
        borderWidth: 2,
        borderColor: '#9D9D9D',
      },
      containerPost:{
        width: '100%',
        height: 10,
      },
      containerConf:{
        alignSelf: 'center',
        paddingLeft: 5,
      }

});