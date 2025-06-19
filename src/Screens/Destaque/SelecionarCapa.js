import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');
const itemWidth = width / 3;

export default function SelecionarCapa({ route, navigation }) {
  const { itemsData } = route.params;
  const [selectedCover, setSelectedCover] = useState(null);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.itemContainer,
        selectedCover === item.id && styles.selectedItem
      ]}
      onPress={() => setSelectedCover(item.id)}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: item.thumbnail }}
        style={styles.thumbnail}
      />
    </TouchableOpacity>
  );

  const handleCreateHighlight = () => {
    console.log('Criando destaque com capa:', selectedCover);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={itemsData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.buttonWrapper}>
        <TouchableOpacity
          style={[
            styles.createButton,
            !selectedCover && styles.disabledButton
          ]}
          onPress={handleCreateHighlight}
          disabled={!selectedCover}
        >
          <Text style={styles.buttonText}>Criar Destaque</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  itemContainer: {
    width: itemWidth,
    aspectRatio: 0.66,
    borderWidth: 0.3,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  selectedItem: {
    borderColor: '#3897f0',
    borderWidth: 3,
    opacity: 0.85,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  buttonWrapper: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 25,
  },
  createButton: {
    backgroundColor: '#3897f0',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 2,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 30,
  },
});
