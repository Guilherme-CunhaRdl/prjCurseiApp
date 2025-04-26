import { StyleSheet } from "react-native";
export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FBFF',
      },
      ScrollCont:{
        flex: 1,
      },
      contentContainer:{
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 16,
        paddingTop: 20,
      },
      containerTradings:{
        height: 515,
        width: 305,
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
      containerTitle:{
        paddingTop: 10, 
        width: 305,
      },
      trendig:{
        borderTopWidth: 2,
        borderTopColor: "#D2D2D2",
      },
      title:{
        fontWeight: '500',
        paddingLeft: 20,
        paddingBottom: 7,
      },
      subTitle:{
        fontSize: 10,
        color: '#848484',
        fontWeight: '500',
        paddingLeft: 20,
        paddingTop: 10,
      },
      trendigName:{
        fontSize: 16,
        fontWeight: '700',
        paddingLeft: 20,
        paddingTop: 5,
      },
      trendigNum:{
        fontSize: 10,
        fontWeight: "500",
        color: '#848484',
        paddingLeft: 20,
        paddingBottom: 10,
      },
      containerMS:{
        paddingTop: 5, 
        height: 35,
        width: 305,
        borderTopWidth: 2,
        borderTopColor: "#D2D2D2",
      },
      titleMS:{
        fontWeight: '500',
        paddingLeft: 20,
        color: '#448FFF',
      },
})