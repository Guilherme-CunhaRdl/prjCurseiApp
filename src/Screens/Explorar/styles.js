import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FBFF',
      },
      ScrollCont:{
        flex: 1,
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
})