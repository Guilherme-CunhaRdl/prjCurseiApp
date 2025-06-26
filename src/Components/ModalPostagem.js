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
import styles from "../Screens/VirarInstituicao/styles";
import { TextInputMask } from 'react-native-masked-text';


const ModalPostagem = forwardRef(
  ({ idPostRepost, tipo, idPost, tela }, ref) => {
    const navigation = useNavigation();
    const [modalVisivel, setModalVisivel] = useState(false);
    const [imagem, setImagem] = useState(null);
    const [capa, setCapa] = useState(null);
    const [capaEdit, setCapaEdit] = useState(null);

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
    const [nomeEvento, setNomeEvento] = useState('')
    const [linkEvento, setLinkEvento] = useState('')
    const [descEvento, setDescEvento] = useState('')
    const [dataInicio, setDataInicio] = useState('')
    const [horaInicio, sethoraInicio] = useState('')
    const [dataFim, setDataFim] = useState('')
    const [horaFim, sethoraFim] = useState('')
    const [prelink, setPrelink] = useState('')
    const [linkPost, setlinkPost] = useState('')
    const [modalLink, setModalLink] = useState(false)
    const [editEvento, setEditEvento] = useState(false)
    const [modalAgendar, setModalAgendar] = useState(false)
    const [dataPost, setDataPost] = useState('')
    const [horaPost, sethoraPost] = useState('')
    const [agendar, setAgendar] = useState(false)

    const alterarFoco = (icone) => setFocoIcone(icone)
    const abrirGaleria = async () => {
      const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissao.granted) {
        alert("É necessário permissão para acessar a galeria!");
        return;
      }

      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
        aspect: [5, 4],
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
        allowsEditing: false,
        quality: 1,
          aspect: [5, 4],
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

      if (focoIcone === 'eventos' && !editEvento) {
        const idUser = await AsyncStorage.getItem("idUser");
        const url = `http://${host}:8000/api/cursei/evento/${idUser}`;

        const evento = new FormData();


        if (capa.startsWith("data:image")) {
          // Converter Base64 para Blob
          const response = await fetch(capa);
          const blob = await response.blob();
          // Gerar um nome único para o arquivo
          const filename = `image_${Date.now()}.jpg`;
          // Criar um arquivo a partir do Blob
          const file = new File([blob], filename, { type: blob.type });
          // Adicionar o arquivo ao FormData
          evento.append("img", file);
        } else {
          // Se não for Base64, assumir que é uma URI local
          const localUri = capa;
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
          evento.append("img", file);
        }
        evento.append("descEvento", descEvento);
        evento.append("tituloEvento", nomeEvento);
        evento.append("link", linkEvento);
        evento.append("inicio", converterData(dataInicio));
        evento.append("fim", converterData(dataFim));
        evento.append("hfim", horaFim);
        evento.append("hinicio", horaInicio);
        setFocoIcone('posts')
        fecharModal()


        try {
          const response = await axios.post(url, evento, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

        } catch (error) {
          alert('ERRO')

        }
        setCapa(null)
        setDataFim('')
        setDataInicio('')
        setLinkEvento('')
        setNomeEvento('')
        setDescEvento('')
        sethoraFim('')
        sethoraInicio('')

      } else {




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
          if (linkPost != '') {
            editarPost.append("link", linkPost)
          }
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
        } else if (editEvento) {
          const editarEvento = new FormData();
          if (capa != capaEdit) {
            console.log(capa, capaEdit)
            if (capa.startsWith("data:image")) {
              // Converter Base64 para Blob
              const response = await fetch(capa);
              const blob = await response.blob();
              // Gerar um nome único para o arquivo
              const filename = `image_${Date.now()}.jpg`;
              // Criar um arquivo a partir do Blob
              const file = new File([blob], filename, { type: blob.type });
              // Adicionar o arquivo ao FormData
              editarEvento.append("img", file);
            } else {
              // Se não for Base64, assumir que é uma URI local
              const localUri = capa;
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
              editarEvento.append("img", file);
            }
          }
          editarEvento.append("descEvento", descEvento);
          editarEvento.append("tituloEvento", nomeEvento);
          editarEvento.append("link", linkEvento);
          editarEvento.append("inicio", converterData(dataInicio));
          editarEvento.append("fim", converterData(dataFim));
          editarEvento.append('hfim', horaFim)
          editarEvento.append('hinicio', horaInicio)
          editarEvento.append('idEvento', idPost)


          url = `http://${host}:8000/api/cursei/eventoUpdate`;

          try {
            const response = await axios.post(url, editarEvento, {
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
          if (linkPost != '') {
            novoPost.append("link", linkPost)
          }
          novoPost.append("descricaoPost", descPost);
          if (agendar) {
            novoPost.append("hora", horaPost);
            novoPost.append("data", converterData(dataPost));
          }

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

      carregarUsuario();
    },);

    const usuario = {
      foto: `http://${host}:8000/img/user/fotoPerfil/${imgUser}`,
      username: arroba || "você",
    };

    function salvarLink() {
      setlinkPost(prelink)
      fecharModalLink()

    }
    const fecharModalLink = () => {
      setModalLink(false)
    }
    const fecharModalAgendar = () => {
      setModalAgendar(false)
    }
    function SaveAgendar() {
      setAgendar(true)
      fecharModalAgendar()
    }
    const fecharModal = () => {
      setCapa(null)
      setDataFim('')
      setDataInicio('')
      setLinkEvento('')
      setNomeEvento('')
      setDescPost('')
      setDescEvento('')
      sethoraFim('')
      sethoraInicio('')
      setImagem(null)
      setFocoIcone('posts')
      sethoraPost('')
      setDataPost('')


      setModalVisivel(false);

    };
    async function abrirModal(id) {


      if (id && tipo != 'editar') {
        const idUser = await AsyncStorage.getItem("idUser");

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
        setPrelink(data.link_post)
      } if (tipo == "editaEvento") {
        setEditEvento(true)
        setFocoIcone('eventos')

        response = await axios.get(`http://${host}:8000/api/cursei/evento/${idPost}`)
        setCapa(`http://${host}:8000/img/user/imgPosts/${response.data[0].conteudo_post}`);
        setCapaEdit(`http://${host}:8000/img/user/imgPosts/${response.data[0].conteudo_post}`);
        setNomeEvento(response.data[0].descricao_post);
        const [dataInicio, horaInicio] = response.data[0].data_inicio_evento.split(' ');
        setDataInicio(converterParaDataBR(dataInicio));
        sethoraInicio(horaInicio)

        const [dataFim, horaFim] = response.data[0].data_fim_evento.split(' ');
        setDataFim(converterParaDataBR(dataFim));
        sethoraFim(horaFim)
        setLinkEvento(response.data[0].link_evento);
        setDescEvento(response.data[0].desc_evento);
        console.log(capa)

      }

      setModalVisivel(true);
    }
    useImperativeHandle(ref, () => ({
      abrirModal,
      fecharModal: () => setModalVisivel(false),
    }));

    function converterParaDataBR(dataISO) {
      if (!dataISO || dataISO.length !== 10) return ''; // validação básica

      const [ano, mes, dia] = dataISO.split('-');
      return `${dia}/${mes}/${ano}`;
    }
    // parte dos eventos
    const abrirGaleriaCapa = async () => {
      const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissao.granted) {
        alert("É necessário permissão para acessar a galeria!");
        return;
      }

      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
        aspect: [5, 4],
      });

      if (!resultado.canceled) {
        setCapa(resultado.assets[0].uri);
      }
    };
    function converterData(dataBR) {
      // dataBR no formato "DD/MM/YY" (ex: "31/12/24")
      const partes = dataBR.split('/'); // ["31", "12", "24"]

      if (partes.length !== 3) return null;

      let [dia, mes, ano] = partes;

      // Ajusta ano para 4 dígitos (ex: "24" vira "2024", "00" vira "2000")
      ano = ano.length === 2 ? '20' + ano : ano;

      // Retorna no formato "YYYY-MM-DD"
      return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
    }


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
              <Text style={[estilos.titulo, { color: tema.texto }]}>{editar || editEvento ? "Editar Posts" : "Novo Post"}</Text>
              <TouchableOpacity onPress={postar}>
                <Text style={[estilos.botaoPublicar, { color: tema.azul }]}>{editar || editEvento ? "Editar" : "Publicar"}</Text>
              </TouchableOpacity>
            </View>

            {/* Corpo */}
            <ScrollView style={estilos.corpo}>
              {!editar && !repost && instituicao && (
                <View style={[estilos.barraContainer, { borderBottomColor: tema.barra }]}>
                  {!editEvento ? (

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
                  ) : null}

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
                <View style={{ paddingInline: 17 }}>

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
                </View>
              )}
              {focoIcone === 'eventos' && (
                <>
                  <TouchableOpacity style={[estilos.contbanner, { backgroundColor: tema.azul }]} onPress={abrirGaleriaCapa}>
                    <Image
                      source={{ uri: capa }}
                      style={estilos.banner}
                    />
                    <View style={estilos.textBanerr}>
                      <Icon name="camera" size={40} color={'#fff'} />
                      <Text style={{ fontWeight: 500, fontSize: 18, color: '#fff' }}>Adicionar Capa</Text>
                    </View>
                  </TouchableOpacity  >
                  <View style={estilos.inputs}>
                    <View>
                      <Text style={[estilos.tituloInput, , { color: tema.iconeInativo }]}>Nome do evento</Text>
                      <View style={[
                        estilos.inputContainer
                      ]}>

                        <Image
                          source={require('../../assets/curseiLogo.png')}
                          style={[{ width: 27, height: 25, objectFit: 'contain', opacity: 0.5, marginRight: 10 }]}
                        />
                        <TextInput
                          style={estilos.input}
                          placeholder="Escolha o titulo do seu evento"
                          value={nomeEvento}
                          onChangeText={(text) => setNomeEvento(text)}
                        />
                      </View>
                    </View>
                    <View>
                      <Text style={[estilos.tituloInput, , { color: tema.iconeInativo }]}>Inicio do evento</Text>
                      <View style={{ flexDirection: 'row', gap: 10 }}>
                        <View style={[
                          estilos.inputContainer
                          , { width: 200 }
                        ]}>

                          <Ionicons style={estilos.inputIcon} name="calendar" />
                          <TextInputMask
                            type={'datetime'}
                            options={{
                              format: 'DD/MM/YYYY'
                            }}
                            value={dataInicio}
                            onChangeText={setDataInicio}
                            placeholder="00/00/0000"
                            style={estilos.input}
                          />

                        </View>
                        <View style={[
                          estilos.inputContainer
                          , { width: 150 }
                        ]}>

                          <Ionicons style={estilos.inputIcon} name="time" />
                          <TextInputMask
                            type={'datetime'}
                            options={{
                              format: 'HH:mm',

                            }}
                            value={horaInicio}
                            onChangeText={sethoraInicio}
                            placeholder="00:00"
                            style={estilos.input}
                          />

                        </View>
                      </View>
                    </View>
                    <View>
                      <Text style={[estilos.tituloInput, , { color: tema.iconeInativo }]}>Termino do evento</Text>
                      <View style={{ flexDirection: 'row', gap: 10 }}>
                        <View style={[
                          estilos.inputContainer
                          , { width: 200 }
                        ]}>

                          <Ionicons style={estilos.inputIcon} name="calendar" />
                          <TextInputMask
                            type={'datetime'}
                            options={{
                              format: 'DD/MM/YYYY'
                            }}
                            value={dataFim}
                            onChangeText={setDataFim}
                            placeholder="00/00/0000"
                            style={estilos.input}
                          />

                        </View>
                        <View style={[
                          estilos.inputContainer
                          , { width: 150 }
                        ]}>

                          <Ionicons style={estilos.inputIcon} name="time" />
                          <TextInputMask
                            type={'datetime'}
                            options={{
                              format: 'HH:mm',
                            }}
                            value={horaFim}
                            onChangeText={sethoraFim}
                            placeholder="00:00"
                            style={estilos.input}
                          />

                        </View>
                      </View>
                    </View>
                    <View>
                      <Text style={[estilos.tituloInput, , { color: tema.iconeInativo }]}>Link do seu evento</Text>
                      <View style={[
                        estilos.inputContainer
                      ]}>

                        <Ionicons style={estilos.inputIcon} name="link" />
                        <TextInput
                          style={estilos.input}
                          placeholder="Url"
                          value={linkEvento}
                          onChangeText={(text) => setLinkEvento(text)}
                        />
                      </View>
                    </View>
                    <View>
                      <Text style={[estilos.tituloInput, , { color: tema.iconeInativo }]}>Descrição:</Text>
                      <View style={[
                        estilos.inputContainer, { height: 200, padding: 0, justifyContent: 'flex-start', alignItems: 'flex-start' }
                      ]}>
                        <TextInput
                          placeholder="Descreva seu evento"
                          multiline
                          style={[estilos.campoTexto, { color: tema.texto, width: '100%', height: '100%', padding: 5 }]}
                          placeholderTextColor={tema.descricao}
                          textAlignVertical="top"
                          value={descEvento}
                          onChangeText={(text) => setDescEvento(text)}
                        />

                      </View>
                    </View>
                  </View>
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
                    {imagem ? (

                      <TouchableOpacity style={estilos.botaoAcao} onPress={() => setModalLink(true)}>
                        <Icon name="link" size={20} color={tema.azul} />
                        <Text style={{ color: tema.texto }}>Link</Text>
                      </TouchableOpacity>
                    ) : null}

                    <TouchableOpacity style={estilos.botaoAcao} onPress={() => setModalAgendar(true)}>
                      <Icon name="calendar" size={20} color={tema.azul} />
                      <Text style={{ color: tema.texto }}>Agendar</Text>
                    </TouchableOpacity>
                  </>
                )

                }
              </View>
            )}

          </View>
        </Modal>
        <Modal
          style={estilos.modalTelaCheia}
          animationType="slide"
          transparent={true}
          visible={modalLink}
          onRequestClose={fecharModalLink}

        >
          <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', flex: 1, alignItems: 'center', justifyContent: 'center' }} onPress={fecharModalLink}>
            <View style={{ backgroundColor: tema.modalFundo, height: 170, width: '90%', alignItems: 'center', borderRadius: 5, justifyContent: 'space-between', paddingBlock: 10 }}>
              <Text style={{ color: tema.descricao, fontSize: 21, fontWeight: 500 }}>Adicionar link no post</Text>
              <TextInput
                style={[estilos.input, { backgroundColor: '#e0e0e0', borderRadius: 5, height: 40, width: '90%', paddingInline: 15, color: "#666" }]}
                placeholder="Url"
                value={prelink}
                onChangeText={(text) => setPrelink(text)}
              />
              <TouchableOpacity onPress={salvarLink} style={{ backgroundColor: tema.azul, width: '55%', height: 35, alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}><Text style={{ fontWeight: 'bold', fontSize: 15, color: '#fff' }}>Adicionar</Text></TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          style={estilos.modalTelaCheia}
          animationType="slide"
          transparent={true}
          visible={modalAgendar}
          onRequestClose={fecharModalAgendar}

        >
          <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', flex: 1, alignItems: 'center', justifyContent: 'center' }} onPress={fecharModalLink}>
            <View style={{ backgroundColor: tema.modalFundo, height: 190, width: '95%', alignItems: 'center', borderRadius: 5, justifyContent: 'space-between', paddingBlock: 10 }}>
              <Text style={{ color: tema.descricao, fontSize: 21, fontWeight: 500 }}>Agendar postagem</Text>
              <View>

                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <View style={[
                    estilos.inputContainer
                    , { width: 180 }
                  ]}>

                    <Ionicons style={estilos.inputIcon} name="calendar" />
                    <TextInputMask
                      type={'datetime'}
                      options={{
                        format: 'DD/MM/YYYY'
                      }}
                      value={dataPost}
                      onChangeText={setDataPost}
                      placeholder="00/00/0000"
                      style={estilos.input}
                    />

                  </View>
                  <View style={[
                    estilos.inputContainer
                    , { width: 150 }
                  ]}>

                    <Ionicons style={estilos.inputIcon} name="time" />
                    <TextInputMask
                      type={'datetime'}
                      options={{
                        format: 'HH:mm',
                      }}
                      value={horaPost}
                      onChangeText={sethoraPost}
                      placeholder="00:00"
                      style={estilos.input}
                    />

                  </View>
                </View>
              </View>
              <TouchableOpacity onPress={SaveAgendar} style={{ backgroundColor: tema.azul, width: '55%', height: 35, alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}><Text style={{ fontWeight: 'bold', fontSize: 15, color: '#fff' }}>Adicionar</Text></TouchableOpacity>
            </View>
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
  contbanner: {
    width: '100%',
    height: 210,
    justifyContent: 'center',
    alignItems: 'center'
  },
  banner: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: 99
  },
  textBanerr: {
    opacity: 0.8,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputs: {

    paddingInline: 16,
    marginTop: 10,
    gap: 5
  },
  tituloInput: {
    fontSize: 17,
    fontWeight: 600
  },
  inputContainer: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e1e1e1',
    borderRadius: 8,
    marginBottom: 16,
    paddingLeft: 12,
    height: 50,
    backgroundColor: '#f8f8f8',

  },
  inputIcon: {
    marginRight: 10,
    fontSize: 20,
    color: 'gray',
  },
  input: {
    width: '85%',
    height: 50,
    color: '#333',
    fontSize: 16,
    outlineStyle: "none",        // Remove borda azul no focus
  },
});
export default ModalPostagem;
