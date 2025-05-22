import { StyleSheet } from "react-native";
import colors from "../../../colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FBFF',
  },
  ScrollCont: {
    flex: 1,
  },
  contentContainer: {
    marginHorizontal: 16,
    paddingTop: 20,
  },
  containerTredings: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    paddingVertical: 5,
    marginBottom: 20,
  },
  containerTitle: {
    paddingHorizontal: 10,
    marginBottom: 10,
  },
   containerTitlePost: {
    paddingHorizontal: 5,
    marginBottom: 10,
  },
  title: {
    fontWeight: '700',
    fontSize: 18,
  },
  trendigItem: {
    borderTopWidth: 1,
    borderTopColor: "#D2D2D2",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  subTitle: {
    fontSize: 10,
    color: '#848484',
    fontWeight: '500',
    marginBottom: 5,
  },
  trendigRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding:0
  },
  trendigName: {
    fontSize: 16,
    fontWeight: '700',
  },
  trendigNum: {
    fontSize: 10,
    fontWeight: "500",
    color: '#848484',
    marginTop: 5,
  },
  containerMS: {
    borderTopWidth: 1,
    borderTopColor: "#D2D2D2",
    alignItems: 'center',
    paddingVertical: 6,
  },
  titleMS: {
    fontWeight: '500',
    color: '#448FFF',
  },
  sugestaoContainer: {
    marginHorizontal: 16,
    marginTop: 20,
  },
  sugestao: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    paddingVertical: 16,
    marginBottom: 20,
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
   containerPost :{
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    paddingVertical: 5,
    marginBottom: 20,
    paddingHorizontal:5,
  },
  
});
