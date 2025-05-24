import { StyleSheet } from "react-native";
import colors from "../../../colors";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:colors.branco
      },
      ScrollCont:{
        
      },
      Header:{
        flex: 2,
        width: '100%',
      },
      explorarContainer:{
        paddingTop: 10,
        paddingBottom: 10,
        paddingHorizontal: 16,
      },
      explorarTitle:{
        fontWeight: 'bold',
        fontSize: 20,
      },
      barraPesquisa:{
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        marginBottom: 16,
        paddingHorizontal: 15,
        height: 45,
        width: '100%',
        backgroundColor: '#EFEFEF',
      },
      barraContainer:{
        paddingHorizontal: 16,
      },
      inputIcon: {
        marginRight: 10,
        fontSize: 20,
        color: 'gray',
      },
      input: {
        flex: 1,
        height: 50,
        color: '#333',
        fontSize: 16,
      },
      opcoesContainer:{
      },
      opcaoText:{
        fontSize: 18,
      },
      opcao1:{
        borderBottomColor: 'blue',
        borderBottomWidth: 1,
      },
      contContain:{
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 20,

      },
      trendigContainer:{
        backgroundColor: 'white',
        width: '100%',
        height: '100%',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {width: 5, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
      },
      titleContainer:{
        alignItems: 'flex-start',
        justifyContent: 'center',
        width: 310,
        height: 44,
        paddingLeft: 20,
        borderBottomColor: "#D2D2D2",
        borderBottomWidth: 2,
      },
      containerPost:{
       backgroundColor:colors.branco,
       paddingHorizontal:15
      },

      userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: "#D2D2D2",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userImgContainer: {
    marginRight: 10,
  },
  imgLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  containerNomeUser: {
    flex: 1,
  },
  nomeUser: {
    fontWeight: '700',
    fontSize: 14,
  },
  arrobaUser: {
    fontWeight: '500',
    fontSize: 12,
    color: '#818181',
    marginTop: 2,
  },
  buttonFollowContainer: {
    marginLeft: 10,
  },
  buttonFollow: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 87,
    height: 28,
    borderRadius: 5,
    backgroundColor: '#448FFF',
  },
  buttonFollowActive:{
    alignItems: 'center',
    justifyContent: 'center',
    width: 87,
    height: 28,
    borderRadius: 5,
    borderWidth:1,
    borderColor:colors.preto,
    backgroundColor: 'transparency',
  },
  titleButton: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  titleButtonActive:{
    color: colors.preto,
    fontSize: 12,
    fontWeight: '600',
  },

})