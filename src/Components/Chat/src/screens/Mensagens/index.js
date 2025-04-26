import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TextInput, TouchableOpacity, Pressable, ScrollView } from 'react-native';
import { Appbar, IconButton, Provider as PaperProvider, SegmentedButtons } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {useNavigation} from '@react-navigation/native'


export default function Mensagens() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const onChangeSearch = query => setSearchQuery(query);
  const [selectedTab, setSelectedTab] = useState('todas');
  
  const mensagens = [
    {
      id: 1,
      nome: 'Kleber Cunha',
      tipo: 'pessoal',
      ultimaMensagem: 'Se fosse você...',
      avatar: require('../../img/dj.jpg'),
    },
    {
      id: 2,
      nome: 'GRUPO PHP',
      tipo: 'grupo',
      ultimaMensagem: 'xd',
      avatar: require('../../img/metalbat.jpg'),
    },
    {
      id: 3,
      nome: 'Instituição xd',
      tipo: 'instituicao',
      ultimaMensagem: 'Você foi aprovado no curso',
      avatar: require('../../img/metalbat.jpg'),
    },
  ];

  const mensagensFiltradas = mensagens.filter((mensagem) => {
    if (selectedTab === 'todas') return true;
    return mensagem.tipo === selectedTab;
  });

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <View style={styles.container}>
          <Appbar.Header style={styles.Header}>
            <Appbar.Content
              title="Mensagens"
              titleStyle={{ color: 'black', fontWeight: 600}}
            />
            <IconButton
              icon={() => (
                <Image
                  source={require('../../img/adicionarIcon.png')}
                  style={{ height: 32, width: 32}}
                  resizeMode="contain"

                />
              )}
              onPress={() => {}}
            />
          </Appbar.Header>

          <View style={styles.customSearchbar}>
  <Image
    source={require('../../img/search.png')} 
    style={styles.searchIcon}
  />
  {/*Barra de pesquisa que troquei pq o do Paper é chei de viadage pra personalizar*/}
  <TextInput
    placeholder="Buscar Conversas..."
    placeholderTextColor="#A7A7A7"
    value={searchQuery}
    onChangeText={onChangeSearch}
    style={styles.customSearchInput}
  />
</View> 

  


<View style={{ marginTop: 32, marginBottom: 8 }}>
  {/* mesma coisa aqui, antes era o SegmentedButtons do Paper, mas a personalização é toda fudida, ai troquei*/}
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={{ paddingHorizontal: 16, gap: 52, justifyContent: 'center', flexGrow: 1, marginLeft:10 }}
  >
    {[
      { label: 'Todas', value: 'todas' },
      { label: 'Grupos', value: 'grupo' },
      { label: 'Instituição', value: 'instituicao' },
    ].map((tab) => {
      const isSelected = selectedTab === tab.value;

      return (
        <Pressable
          key={tab.value}
          onPress={() => setSelectedTab(tab.value)}
          style={[
            {
              paddingBottom: 8,
              borderBottomWidth: 2,
              borderBottomColor: isSelected ? '#448fff' : 'transparent',
            },
          ]}
        >
          <Text style={{ 
            color: isSelected ? '#448fff' : '#ACACAC',
            fontWeight: isSelected ? 600 : 'normal', 
            fontSize: 18
          }}>
            {tab.label}
          </Text>
        </Pressable>
      );
    })}
  </ScrollView>
</View>


          <FlatList
            data={mensagensFiltradas}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={ () => navigation.navigate('Conversa')} rippleColor="rgba(0, 0, 0, .05)">
                <View style={styles.mensagemItem}>
                  <Image
                    source={item.avatar}
                    style={styles.avatar}
                    defaultSource={require('../../img/metalbat.jpg')}
                  />
                  <View style={styles.mensagemTexto}>
                    <Text style={styles.nome} numberOfLines={1}>{item.nome}</Text>
                    <Text style={styles.ultimaMensagem} numberOfLines={1}>{item.ultimaMensagem}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.listaMensagens}
          />

          <StatusBar style="auto" />
        </View>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  Header: {
    backgroundColor: '#fff',
    elevation: 0,
  },

  tab: {
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRadius: 0,
    borderWidth: 0
  },
  selectedTab: {
    backgroundColor: 'transparent',
    borderBottomWidth: 2,
    borderRadius: 0,
    borderWidth: 0  
  },
  mensagemItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 10
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: '#ccc',
  },
  mensagemTexto: {
    flex: 1,
  },
  nome: {
    fontSize: 16,
    fontWeight: 600,
    color: '#000',
  },
  ultimaMensagem: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  listaMensagens: {
    paddingBottom: 100,
    paddingTop: 8,
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
  },
  
});
