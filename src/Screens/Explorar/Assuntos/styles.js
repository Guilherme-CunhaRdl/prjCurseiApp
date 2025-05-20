import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FBFF',
  },
  ScrollCont: {
    flex: 1,
    
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    paddingTop: 20,
    textAlign: 'center',
  },
  containerTradings: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    paddingBottom: 10,
  },
  containerTitle: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  title: {
    fontWeight: '600',
    fontSize: 18,
  
  },
  separator: {
    height: 1,  
    backgroundColor: "#D2D2D2",
    width: '100%', 
    alignSelf: 'center', 
  },
  trendig: {
    paddingBottom: 10,
    
    paddingHorizontal: 20,
  },
  
  
  trendigHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding:0
  },
  subTitle: {
    fontSize: 10,
    color: '#848484',
    fontWeight: '500',
  },
  trendigName: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 3,
  },
  trendigNum: {
    fontSize: 12,
    fontWeight: "500",
    color: '#848484',
    marginTop: 2,
  },
  containerMS: {
    borderTopWidth: 2,
    borderTopColor: "#D2D2D2",
    paddingVertical: 10,
    alignItems: 'center',
  },
  titleMS: {
    fontWeight: '600',
    color: '#448FFF',
    fontSize: 14,
  },
});
