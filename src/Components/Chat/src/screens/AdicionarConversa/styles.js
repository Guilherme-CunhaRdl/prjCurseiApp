import { StyleSheet } from "react-native";
import colors from '../../../../../colors'
export default StyleSheet.create({

    container:{
        flex: 1,
        backgroundColor: colors.branco
    },
    header: {
        backgroundColor: colors.branco,
        elevation: 0
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
      containerSeguidores:{
        width: '100%',
        
      },
      flatlistSeguidores:{
        width: '90%',
        marginLeft: 20
      },
      boxIcone:{
        borderRadius: '50%',
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
        borderRadius: '50%'
      }
})