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
  Pressable
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
import { useTema } from "../context/themeContext";
const ModalPostagem = forwardRef(
  ({ idPostRepost, tipo, idPost, tela }, ref) => {
    const navigation = useNavigation();
    const [modalVisivel, setModalVisivel] = useState(false);
    const [imagem, setImagem] = useState(null);
    const [imgUser, SetImgUser] = useState("");
    const [arroba, SetArrobaUser] = useState("");
    const [descPost, setDescPost] = useState("");
    const [repost, setRepost] = useState(false);
    const [idrepost, setIdepost] = useState(false);
    const [repost_img, setRepostImg] = useState("");
    const [repost_autor, setRepostAutor] = useState("");
    const [tempo_repostado, setTempoRepostado] = useState(0);
    const [repost_arroba, setRepostArroba] = useState("");
    const [repost_descricao, setRepostDescricao] = useState("");
    const [repost_conteudo, setRepostConteudo] = useState("");
    const [editar, setEditar] = useState(false);
    const [imagemEdit, setImagemEdit] = useState(null)
    const [instituicao, setInstituicao] = useState(false)
    const [focoIcone, setFocoIcone] = useState('posts')



    const alterarFoco = (icone) => setFocoIcone(icone)
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
        if (imagem != imagemEdit) {
          console.log(imagem, imagemEdit)
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
          setImagem(null)

          // if(tela=='perfil'){
          //   navigation.replace('user');
          // }
        } catch (error) {
          console.log("erro ao fazer a postagem :", error);
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
          novoPost.append("repost", idrepost);
        }
        novoPost.append("descricaoPost", descPost);

        const idUser = await AsyncStorage.getItem("idUser");
        url = `http://${host}:8000/api/cursei/posts/` + idUser;
        console.log(novoPost, url)
        try {
          const response = await axios.post(url, novoPost, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          fecharModal();
          setDescPost('')
          setImagem(null)

          // if(tela=='perfil'){
          //   navigation.replace('user');
          // }
        } catch {
          console.log("erro ao fazer a postagem");
          console.log(novoPost)
        }
      }
    }
    useEffect(() => {
      const carregarUsuario = async () => {
        const imgUser1 = await AsyncStorage.getItem("imgUser");
        SetImgUser(imgUser1);
        const arroba = await AsyncStorage.getItem("arrobaUser");
        SetArrobaUser(arroba);
        const idInst = await AsyncStorage.getItem("idInstituicao");
        if (idInst != 0) {
          setInstituicao(true)
        }

      };
      console.log(focoIcone)
      carregarUsuario();
    }, [focoIcone]);

    const usuario = {
      foto: `http://${host}:8000/img/user/fotoPerfil/${imgUser}`,
      username: arroba || "você",
    };

    const fecharModal = () => {
      setModalVisivel(false);
    };
    async function abrirModal(id) {


      if (id && tipo != 'editar') {
        const idUser = await AsyncStorage.getItem("idUser");
        console.log(id)
        setRepost(true);
        setIdepost(id)
        const url = `http://${host}:8000/api/posts/4/${idUser}/1/0/${id}`;
        try {
          const response = await axios.get(url);
          const data = response.data.data[0];
          setRepostImg(data.img_user);
          setRepostAutor(data.repost_autor);
          setTempoRepostado(data.tempo_insercao);
          setRepostArroba(data.arroba_user);
          setRepostDescricao(data.descricao_post);
          setRepostConteudo(data.conteudo_post);
        } catch (error) {
          console.error("Erro ao carregar repost:", error);
        }
      } else {
        setRepost(false)
      }

      if (tipo == "editar") {
        const idUser = await AsyncStorage.getItem("idUser");
        const url = `http://${host}:8000/api/posts/4/${idUser}/1/0/${idPost}`;
        let response
        try {
          response = await axios.get(url);
        }
        catch (error) {
          console.error("Erro ao carregar post:", error, url);
        }


        const data = response.data.data[0];

        if (data.descricao_post) {
          setDescPost(data.descricao_post);
        }
        setImagem(
          `http://${host}:8000/img/user/imgPosts/${data.conteudo_post}`
        );
        setImagemEdit(`http://${host}:8000/img/user/imgPosts/${data.conteudo_post}`)
        setEditar(true)
      }

      setModalVisivel(true);
    }
    useImperativeHandle(ref, () => ({
      abrirModal,
      fecharModal: () => setModalVisivel(false),
    }));
    const { tema } = useTema();
    return (
      <View style={{ flex: 0, backgroundColor: tema.fundo }}>
        {tipo === "post" && (
          <TouchableOpacity style={estilos.sendButton} onPress={() => abrirModal(false)}>
            <Image source={require('../../assets/LogoBranca.png')} style={{ width: 38, height: 37, resizeMode: 'contain' }} />
          </TouchableOpacity>
        )}

        <Modal
          style={estilos.modalTelaCheia}
          animationType="slide"
          transparent={true}
          visible={modalVisivel}
          onRequestClose={fecharModal}
        >
          <View style={[estilos.modalTelaCheia, { backgroundColor: tema.modalFundo }]}>
            {/* Cabeçalho */}
            <View style={estilos.cabecalho}>
              <TouchableOpacity onPress={fecharModal}>
                <Icon name="x" size={24} color={tema.icone} />
              </TouchableOpacity>
              <Text style={[estilos.titulo, { color: tema.texto }]}>Novo Post</Text>
              <TouchableOpacity onPress={postar}>
                <Text style={[estilos.botaoPublicar, { color: tema.azul }]}>Publicar</Text>
              </TouchableOpacity>
            </View>

            {/* Corpo */}
       <ScrollView style={estilos.corpo}>
  {instituicao && (
    <View style={[estilos.barraContainer, { borderBottomColor: tema.barra }]}>
      <Pressable
        onPress={() => alterarFoco('posts')}
        style={[
          estilos.opcao,
          focoIcone === 'posts' ? estilos.opcaoAtiva : estilos.opcaoInativa,
        ]}
      >
        <Text style={{ width: 100, textAlign: 'center', fontSize: 15, fontWeight: '500', color: tema.iconeInativo }}>
          Post
        </Text>
      </Pressable>

      <Pressable
        onPress={() => alterarFoco('eventos')}
        style={[
          estilos.opcao,
          focoIcone === 'eventos' ? estilos.opcaoAtiva : estilos.opcaoInativa,
        ]}
      >
        <Text style={{ width: 100, textAlign: 'center', fontSize: 15, fontWeight: '500', color: tema.iconeInativo }}>
          Evento
        </Text>
      </Pressable>
    </View>
  )}

  {focoIcone === 'posts' && (
    <>
      <View style={estilos.usuario}>
        <Image source={{ uri: usuario.foto }} style={estilos.avatar} />
        <Text style={[estilos.nomeUsuario, { color: tema.texto }]}>@{usuario.username}</Text>
      </View>

      <TextInput
        placeholder="Digite o que aconteceu hoje..."
        multiline
        style={[estilos.campoTexto, { color: tema.texto }]}
        placeholderTextColor={tema.descricao}
        textAlignVertical="top"
        value={descPost}
        onChangeText={(text) => setDescPost(text)}
      />

      {repost && (
        <View style={estilos.containerRepost}>
          <View style={estilos.postHeader}>
            <View style={{ flexDirection: "row", alignItems: "center", paddingInline: 10 }}>
              <Image
                source={{ uri: `http://${host}:8000/img/user/fotoPerfil/${repost_img}` }}
                style={estilos.fotoUserRepost}
              />
              <View style={{ paddingLeft: 10 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={[estilos.institutionTextRepost, { color: tema.texto }]}>
                    {repost_autor}
                  </Text>
                  <Text style={[estilos.horaPost, { color: tema.descricao }]}>·</Text>
                  <Text style={[estilos.horaPost, { color: tema.descricao }]}>
                    {formatarTempoInsercao(tempo_repostado)}
                  </Text>
                </View>
                <Text style={[estilos.arrobaUser, { color: tema.descricao }]}>@{repost_arroba}</Text>
              </View>
            </View>
          </View>
          <Text style={[estilos.postTextRepost, { color: tema.texto }]}>{repost_descricao}</Text>
          {repost_conteudo && (
            <TouchableOpacity style={estilos.postContentRepost}>
              <Image
                style={{
                  width: "100%",
                  height: "100%",
                  borderBottomLeftRadius: 8,
                  borderBottomRightRadius: 8,
                }}
                source={{ uri: `http://${host}:8000/img/user/imgPosts/${repost_conteudo}` }}
              />
            </TouchableOpacity>
          )}
        </View>
      )}

      {!repost && imagem && (
        <Image
          source={{ uri: imagem }}
          style={estilos.imagemPreview}
          resizeMode="cover"
        />
      )}
    </>
  )}
</ScrollView>

{/* Rodapé */}
{(!repost && focoIcone === 'posts') && (
  <View style={estilos.rodape}>
    <TouchableOpacity style={estilos.botaoAcao} onPress={abrirGaleria}>
      <Icon name="image" size={20} color={tema.azul} />
      <Text style={{ color: tema.texto }}>Galeria</Text>
    </TouchableOpacity>

    <TouchableOpacity style={estilos.botaoAcao} onPress={tirarFoto}>
      <Icon name="camera" size={20} color={tema.azul} />
      <Text style={{ color: tema.texto }}>Foto</Text>
    </TouchableOpacity>

    {instituicao && (
      <>
        <TouchableOpacity style={estilos.botaoAcao} onPress={tirarFoto}>
          <Icon name="link" size={20} color={tema.azul} />
          <Text style={{ color: tema.texto }}>Link</Text>
        </TouchableOpacity>

        <TouchableOpacity style={estilos.botaoAcao} onPress={tirarFoto}>
          <Icon name="calendar" size={20} color={tema.azul} />
          <Text style={{ color: tema.texto }}>Agendar</Text>
        </TouchableOpacity>
      </>
    )}
  </View>
)}

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
    height: 280,
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
    position: "absolute",
    right: 30,
    bottom: 50,
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
  barraContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    paddingTop: 1,
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    height: 50
    // backgroundColor:'red'
  },
  opcao: {
    paddingHorizontal: 9,
    height: '100%',
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  opcaoIcon: {
    fontSize: 30,
    color: colors.cinza,
  },
  opcaoAtiva: {
    fontSize: 25,
    color: colors.preto,
    borderBottomWidth: 2,
    borderColor: colors.azul,
    height: '107%',


  },
  IconeAtivo: {
    fontSize: 25,
    color: colors.preto,
    borderBottomWidth: 0,

  },
  opcaoInativo: {
    fontSize: 25,
    color: colors.cinza,
    borderBottomWidth: 0,

  },
  iconeInativo: {
    fontSize: 25,
    color: colors.cinza,
  },
});
export default ModalPostagem;
