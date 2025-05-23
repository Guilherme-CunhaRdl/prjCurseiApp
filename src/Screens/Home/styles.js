import { StyleSheet } from "react-native";
import colors from "../../colors";

export default StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    overflow: 'scroll',
    paddingTop:25,
  },
  ContainerCont: {
    flex: 1,
    overflow: 'scroll',
  },
  feedContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  postContainer: {
    paddingTop: 20,
    flexGrow:1,
    
  },
  postHeader: {
    marginBottom: 4,
    flexDirection: 'row'
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
  Header: {
    flex: 0.36,
    paddingBottom: 0,
    
    width: '100%',
    borderBottomWidth: 0,
    borderBottomColor: '#C5C5C5',
    justifyContent: 'center'

  },
  userContainer: {
    paddingVertical: 10,
  },
  infoUser: {
    paddingHorizontal: '5%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  notifyContainer: {
    flexDirection: 'row',
    gap: 30,
    position: 'relative'
  },
  notifyIcon: {
    fontSize: 25
  },
  curseiIcon: {
    resizeMode: 'contain',
    height: 30,
    width: 32,
  },
  textUser: {
    fontWeight: '600',
    fontSize: 17,
  },
  msgUser: {
    marginLeft:10,
    paddingTop:4
  },
  textInicio: {
    color: 'gray',
    fontWeight: '500',
    fontSize:14,
  },
  storysContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:10
  },
  storys: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  circuloStorys: {
    height: 80,
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nomeStorys: {
    color: "grey",
  },
  imgLogo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#9D9D9D',
  },
  containerPost: {
    width: '100%',
    height: 10,
  },
  containerConf: {
    alignSelf: 'center',
    paddingLeft: 5,
  },
  imgContainer: {
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: 80,
    height: 50,
    width: 50,
    overflow: 'hidden',
    borderColor: '#F9F9F9',
    borderWidth: 1

  },
  userImg: {

    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  badge: {
    position: 'absolute',
    top: -1,
    right: -2,
    backgroundColor: 'red',
    borderRadius: 10,
    padding: 0,
    width: 15,
    height: 15,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    zIndex:2,
    flex:1
    
  },
  barraContainer:{
    alignSelf: 'center',
    flexDirection: 'row',
    width: '97%',
    justifyContent: 'space-around',
    
    // gap: 40,

    paddingTop:15,
    borderBottomWidth: 2,
    borderBottomColor: '#F5F5F5',
    // backgroundColor:'red'
  },
  opcao:{
    paddingHorizontal: 9,
    height: '100%',
    width: '15%',
    justifyContent: 'center',
    alignItems: 'center'
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
});