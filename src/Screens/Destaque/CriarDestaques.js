import React, { useState, useLayoutEffect } from 'react';
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
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  const handleProceed = () => {
    navigation.navigate('SelecionarCapa', {
      selectedItems,
      itemsData: storiesData.filter(item => selectedItems.includes(item.id)),
    });
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          disabled={selectedItems.length === 0}
          onPress={handleProceed}
          style={[
            styles.headerButton,
            selectedItems.length === 0 && styles.headerButtonDisabled,
          ]}
        >
          <Text style={styles.headerButtonText}>
            Próximo ({selectedItems.length})
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, selectedItems]);

  const renderItem = ({ item }) => {
    const isSelected = selectedItems.includes(item.id);
    const orderNumber = isSelected ? selectedItems.indexOf(item.id) + 1 : '';

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={[styles.storyItem, { width: itemWidth }]}
        onPress={() => toggleItemSelection(item.id)}
        onLongPress={() => setPreview(item.thumbnail)}
      >
        <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
        <View style={styles.checkOverlay}>
          <View style={[styles.checkBox, isSelected && styles.checkBoxSelected]}>
            <Text style={styles.checkNumber}>{orderNumber}</Text>
          </View>
        </View>
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

      {/* Modal preview */}
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
  checkOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  checkBox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkBoxSelected: {
    backgroundColor: '#3897f0',
    borderColor: '#3897f0',
  },
  checkNumber: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  headerButton: {
    marginRight: 10,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'none'
  },

  headerButtonText: {
    color: '#3897f0',
    fontWeight: '600',
    fontSize: 14,
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
