import React, {
  useState,
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as Animatable from "react-native-animatable";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Feather";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import colors from "../colors";
import * as ImagePicker from "expo-image-picker";
import dayjs from "dayjs";
import host from "../global";
const ModalPostagem = forwardRef(
  ({ idPostRepost, tipo, idPost, tela }, ref) => {
    const navigation = useNavigation();
    const [modalVisivel, setModalVisivel] = useState(false);
    const [imagem, setImagem] = useState(null);
    const [imgUser, SetImgUser] = useState("");
    const [arroba, SetArrobaUser] = useState("");
    const [descPost, setDescPost] = useState("");
    const [repost, setRepost] = useState(false);
    const [repost_img, setRepostImg] = useState("");
    const [repost_autor, setRepostAutor] = useState("");
    const [tempo_repostado, setTempoRepostado] = useState(0);
    const [repost_arroba, setRepostArroba] = useState("");
    const [repost_descricao, setRepostDescricao] = useState("");
    const [repost_conteudo, setRepostConteudo] = useState("");
    const [editar, setEditar] = useState(false);

    const abrirGaleria = async () => {
      const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissao.granted) {
        alert("É necessário permissão para acessar a galeria!");
        return;
      }

      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!resultado.canceled) {
        setImagem(resultado.assets[0].uri);
      }
    };

    const tirarFoto = async () => {
      const permissao = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissao.granted) {
        alert("Permissão para usar a câmera é necessária!");
        return;
      }

      const resultado = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
      });

      if (!resultado.canceled) {
        setImagem(resultado.assets[0].uri);
      }
    };

    const formatarTempoInsercao = (seconds) => {
      return dayjs().subtract(seconds, "seconds").fromNow();
    };
    let lastTap = null;
    async function postar() {
  
      if (editar) {
        const editarPost = new FormData();
        if (imagem !== null) {
          if (imagem.startsWith("data:image")) {
            // Converter Base64 para Blob
            const response = await fetch(imagem);
            const blob = await response.blob();
            // Gerar um nome único para o arquivo
            const filename = `image_${Date.now()}.jpg`;
            // Criar um arquivo a partir do Blob
            const file = new File([blob], filename, { type: blob.type });
            // Adicionar o arquivo ao FormData
            editarPost.append("img", file);
          } else {
            // Se não for Base64, assumir que é uma URI local
            const localUri = imagem;
            const filename = localUri.split("/").pop(); // Extrair o nome do arquivo da URI
            const match = /\.(\w+)$/.exec(filename); // Extrair o tipo da imagem
            const type = match ? `image/${match[1]}` : "image/jpeg"; // Definir o tipo, fallback para "image/jpeg"

            // Criar o objeto de arquivo com a URI local
            const file = {
              uri: localUri,
              type: type,
              name: filename,
            };

            // Adicionar o arquivo ao FormData
            editarPost.append("img", file);
          }
          editarPost.append("descricaoPost", descPost);

          const idUser = await AsyncStorage.getItem("idUser");
          url = `http://${host}:8000/api/cursei/postsUpdate/` + idPost; 
          try {
            const response = await axios.post(url, editarPost, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
            fecharModal();
            setDescPost('')
            // if(tela=='perfil'){
            //   navigation.replace('user');
            // }
          } catch {
            console.log("erro ao fazer a postagem");
          }
        }
      } else {
        const novoPost = new FormData();
        if (imagem !== null) {
          if (imagem.startsWith("data:image")) {
            // Converter Base64 para Blob
            const response = await fetch(imagem);
            const blob = await response.blob();
            // Gerar um nome único para o arquivo
            const filename = `image_${Date.now()}.jpg`;
            // Criar um arquivo a partir do Blob
            const file = new File([blob], filename, { type: blob.type });
            // Adicionar o arquivo ao FormData
            novoPost.append("img", file);
          } else {
            // Se não for Base64, assumir que é uma URI local
            const localUri = imagem;
            const filename = localUri.split("/").pop(); // Extrair o nome do arquivo da URI
            const match = /\.(\w+)$/.exec(filename); // Extrair o tipo da imagem
            const type = match ? `image/${match[1]}` : "image/jpeg"; // Definir o tipo, fallback para "image/jpeg"

            // Criar o objeto de arquivo com a URI local
            const file = {
              uri: localUri,
              type: type,
              name: filename,
            };

            // Adicionar o arquivo ao FormData
            novoPost.append("img", file);
          }
        }
        if (repost) {
          novoPost.append("repost", repost);
        }
        novoPost.append("descricaoPost", descPost);

        const idUser = await AsyncStorage.getItem("idUser");
        url = `http://${host}:8000/api/cursei/posts/` + idUser;
        try {
          const response = await axios.post(url, novoPost, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          fecharModal();
          setDescPost('')
          // if(tela=='perfil'){
          //   navigation.replace('user');
          // }
        } catch {
          console.log("erro ao fazer a postagem");
        }
      }
    }
    useEffect(() => {
      const carregarUsuario = async () => {
        const imgUser1 = await AsyncStorage.getItem("imgUser");
        SetImgUser(imgUser1);
        const arroba = await AsyncStorage.getItem("arrobaUser");
        SetArrobaUser(arroba);
      };

      carregarUsuario();
    }, []);

    const usuario = {
      foto: `http://${host}:8000/img/user/fotoPerfil/${imgUser}`,
      username: arroba || "você",
    };

    const fecharModal = () => {
      setModalVisivel(false);
    };
    async function abrirModal(id) {
      console.log(id);
      if (idPostRepost) {
        setRepost(id);

        const url = `http://${host}:8000/api/posts/4/${id}/1/0/0`;
        response = await axios.get(url);
        data = response.data.data[0];
        console.log(data);
        setRepostImg(data.img_user);
        setRepostAutor(data.repost_autor);
        setTempoRepostado(data.tempo_insercao);
        setRepostArroba(data.arroba_user);
        setRepostDescricao(data.descricao_post);
        setRepostConteudo(data.conteudo_post);
      }
      if (tipo == "editar") {
        const url = `http://${host}:8000/api/posts/4/${idPost}/1/0/0`;
        response = await axios.get(url);
        data = response.data.data[0];
        console.log(data);
        if(data.descricao_post){
           setDescPost(data.descricao_post);
        }
        setImagem(
          `http://${host}:8000/img/user/imgPosts/${data.conteudo_post}`
        );
        setEditar(true)
      }
      setModalVisivel(true);
    }
    useImperativeHandle(ref, () => ({
      abrirModal,
      fecharModal: () => setModalVisivel(false),
    }));

    return (
      <View>
        {tipo == "post" ? (
          <TouchableOpacity style={estilos.sendButton} onPress={abrirModal}>
             <Image source={require('../../assets/LogoBranca.png')} style={{width:38,height:37,resizeMode:'contain'}} />
          </TouchableOpacity>
        ) : null}

        <Modal
          style={estilos.modalTelaCheia}
          animationType="slide"
          transparent={true}
          visible={modalVisivel}
          onRequestClose={fecharModal}
        >
          <View style={estilos.modalTelaCheia}>
            {/* Cabeçalho */}
            <View style={estilos.cabecalho}>
              <TouchableOpacity onPress={fecharModal}>
                <Icon name="x" size={24} color="#000" />
              </TouchableOpacity>
              <Text style={estilos.titulo}>Novo Post</Text>
              <TouchableOpacity onPress={postar}>
                <Text style={[estilos.botaoPublicar]}>Publicar</Text>
              </TouchableOpacity>
            </View>

            {/* Corpo */}
            <ScrollView style={estilos.corpo}>
              <View style={estilos.usuario}>
                <Image source={{ uri: usuario.foto }} style={estilos.avatar} />
                <Text style={estilos.nomeUsuario}>@{usuario.username}</Text>
              </View>

              <TextInput
                placeholder="Digite o que aconteceu hoje..."
                multiline
                style={estilos.campoTexto}
                textAlignVertical="top"
                value={descPost}
                onChangeText={(text) => setDescPost(text)}
              />
              {repost ? (
                <View style={estilos.containerRepost}>
                  <View style={estilos.postHeader}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingInline: 10,
                      }}
                    >
                      <Image
                        source={{
                          uri: `http://${host}:8000/img/user/fotoPerfil/${repost_img}`,
                        }}
                        style={estilos.fotoUserRepost}
                      />
                      <View style={{ paddingLeft: 10 }}>
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <Text style={estilos.institutionTextRepost}>
                            {repost_autor}
                          </Text>
                          <Text style={estilos.horaPost}>·</Text>
                          <Text style={estilos.horaPost}>
                            {formatarTempoInsercao(tempo_repostado)}
                          </Text>
                        </View>
                        <Text style={estilos.arrobaUser}>@{repost_arroba}</Text>
                      </View>
                    </View>
                  </View>
                  <Text style={estilos.postTextRepost}>{repost_descricao}</Text>
                  {repost_conteudo ? (
                    <TouchableOpacity style={estilos.postContentRepost}>
                      <Image
                        style={{
                          width: "100%",
                          height: "100%",
                          borderBottomLeftRadius: 8,
                          borderBottomRightRadius: 8,
                        }}
                        source={{
                          uri: `http://${host}:8000/img/user/imgPosts/${repost_conteudo}`,
                        }}
                      />
                    </TouchableOpacity>
                  ) : null}
                </View>
              ) : null}
              {/* Exemplo com imagem estática */}
              {!repost ? (
                <Image
                  source={{ uri: imagem }}
                  style={estilos.imagemPreview}
                  resizeMode="cover"
                />
              ) : null}
            </ScrollView>

            {/* Rodapé */}
            {!repost ? (
              <View style={estilos.rodape}>
                <TouchableOpacity
                  style={estilos.botaoAcao}
                  onPress={abrirGaleria}
                >
                  <Icon name="image" size={20} color="#1E90FF" />
                  <Text>Galeria</Text>
                </TouchableOpacity>

                <TouchableOpacity style={estilos.botaoAcao} onPress={tirarFoto}>
                  <Icon name="camera" size={20} color="#1E90FF" />
                  <Text>Foto</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </Modal>
      </View>
    );
  }
);

const estilos = StyleSheet.create({
  modalTelaCheia: {
    flex: 1,
    backgroundColor: colors.branco,
    zIndex: 99,
  },
  cabecalho: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  titulo: {
    fontWeight: "bold",
    fontSize: 18,
  },
  botaoPublicar: {
    color: "#1E90FF",
    fontWeight: "bold",
    fontSize: 16,
  },
  corpo: {
    flex: 1,
    paddingHorizontal: 16,
  },
  usuario: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  nomeUsuario: {
    fontWeight: "bold",
    fontSize: 16,
  },
  campoTexto: {
    fontSize: 16,
    padding: 0,
    margin: 0,
    borderWidth: 0,
    backgroundColor: "transparent",
    marginBottom: 16,
    minHeight: 100,
    // outline: 'none',
  },
  imagemPreview: {
    height: 210,
    borderRadius: 8,
    marginBottom: 8,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  rodape: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  botaoAcao: {
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
  },
  sendButton: {
    position: "fixed",
    right: 20,
    bottom: 70,
    width: 60,
    height: 60,
    borderRadius: 60,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  containerRepost: {
    paddingTop: 10,
    borderColor: "#cfd9de",
    borderWidth: 1,
    borderRadius: 10,
  },
  fotoUserRepost: {
    width: 30,
    height: 30,
    borderRadius: 25,
  },
  institutionTextRepost: {
    fontSize: 11,
    fontWeight: 600,
  },
  postContentRepost: {
    height: 210,
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  postTextRepost: {
    fontSize: 14,
    marginBlock: 10,
    paddingInline: 10,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  arrobaUser: {
    fontSize: 12,
    color: "#666",
  },
  horaPost: {
    fontSize: 10,
    color: "#666",
    paddingLeft: 10,
    alignSelf: "center",
  },
});
export default ModalPostagem;
