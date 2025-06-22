
import { StyleSheet } from "react-native";
import colors from '../../../../../colors';
import { useTema } from "../../../../../context/themeContext";
const useStyles = () =>{
const {tema } = useTema()

    return StyleSheet.create(

    
 { container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  Header: {
    backgroundColor: "#fff",
    elevation: 0,
  },

  tab: {
    backgroundColor: "transparent",
    borderBottomColor: "transparent",
    borderRadius: 0,
    borderWidth: 0,
  },
  selectedTab: {
    backgroundColor: "transparent",
    borderBottomWidth: 2,
    borderRadius: 0,
    borderWidth: 0,
  },
  mensagemItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: tema.fundo,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 10,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: "#ccc",
  },
  mensagemTexto: {
    flex: 1,
  },
  nome: {
    fontSize: 16,
    fontWeight: 600,
    color: "#000",
  },

  ultimaMensagem: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  circuloImagem: {
    borderRadius: "50%",
    backgroundColor: colors.azul,
    justifyContent: "center",
    alignItems: "center",
    width: 22,
    height: 22,
    marginRight: 3,
  },
  ultimaMensagemImg: {
    alignItems: "center",
    flexDirection: "row",
  },
  imagemIcon: {
    fontSize: 13,
  },
  listaMensagens: {
    paddingTop: 8,
  },
  customSearchbar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFEFEF",
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 12,
    height: 48,
  },

  searchIcon: {
    width: 18,
    height: 18,
    tintColor: "#A7A7A7",
    marginRight: 8,
  },

  customSearchInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: 600,
    color: "#000",
    padding: 0,
    margin: 0,
  },
}

)}

export default useStyles;