import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  Text,
  Modal,
  Pressable,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const storiesData = [
  { id: '1', thumbnail: 'https://picsum.photos/200/300?random=1', type: 'video' },
  { id: '2', thumbnail: 'https://picsum.photos/200/300?random=2', type: 'video' },
  { id: '3', thumbnail: 'https://picsum.photos/200/300?random=3', type: 'video' },
  { id: '4', thumbnail: 'https://picsum.photos/200/300?random=4', type: 'video' },
  { id: '5', thumbnail: 'https://picsum.photos/200/300?random=5', type: 'video' },
  { id: '6', thumbnail: 'https://picsum.photos/200/300?random=6', type: 'video' },
  { id: '7', thumbnail: 'https://picsum.photos/200/300?random=7', type: 'video' },
  { id: '8', thumbnail: 'https://picsum.photos/200/300?random=8', type: 'video' },
  { id: '9', thumbnail: 'https://picsum.photos/200/300?random=9', type: 'video' },
  { id: '10', thumbnail: 'https://picsum.photos/200/300?random=10', type: 'video' },
  { id: '11', thumbnail: 'https://picsum.photos/200/300?random=11', type: 'video' },
  { id: '12', thumbnail: 'https://picsum.photos/200/300?random=12', type: 'video' },
];

const { width } = Dimensions.get('window');
const itemWidth = width / 3;

export default function CriarDestaques({ navigation }) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [preview, setPreview] = useState(null);

  const toggleItemSelection = (itemId) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleProceed = () => {
    navigation.navigate('SelecionarCapa', {
      selectedItems,
      itemsData: storiesData.filter(item => selectedItems.includes(item.id))
    });
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedItems.includes(item.id);
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={[
          styles.storyItem,
          { width: itemWidth },
          isSelected && styles.selectedItem,
        ]}
        onPress={() => toggleItemSelection(item.id)}
        onLongPress={() => setPreview(item.thumbnail)}
      >
        <Image
          source={{ uri: item.thumbnail }}
          style={styles.thumbnail}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={storiesData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={3}
        scrollEnabled
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.buttonWrapper}>
        <TouchableOpacity
          style={[
            styles.proceedButton,
            selectedItems.length === 0 && styles.disabledButton
          ]}
          onPress={handleProceed}
          disabled={selectedItems.length === 0}
        >
          <Text style={styles.proceedButtonText}>
            Próximo ({selectedItems.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal de preview */}
      <Modal visible={!!preview} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setPreview(null)}>
          <Image source={{ uri: preview }} style={styles.previewImage} />
        </Pressable>
      </Modal>

      <StatusBar style="dark" />
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
  storyItem: {
    aspectRatio: 0.66,
    borderWidth: 0.3,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  selectedItem: {
    borderColor: '#3897f0',
    borderWidth: 3,
    opacity: 0.85,
  },
  proceedButton: {
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
  proceedButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  buttonWrapper: {
    alignItems: 'center',
    marginBottom: 25,
    marginTop: 10,
  },
  listContent: {
    paddingBottom: 30,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '80%',
    height: '70%',
    resizeMode: 'contain',
    borderRadius: 16,
  },
});
