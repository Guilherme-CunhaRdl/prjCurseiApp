import React from 'react';
import {
    View,
    FlatList,
    TouchableOpacity,
    Image,
    StyleSheet,
    Dimensions,
    Text
} from 'react-native';
import { useTema } from '../context/themeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

const numColumns = 3;
const margin = 1; 
const { width } = Dimensions.get('window');
const itemWidth = (width - margin * (numColumns * 2)) / numColumns;
const itemHeight = itemWidth * 1.7; 

const CurteisLista = ({ data, navigation }) => {
    const { tema } = useTema();

    const renderItem = ({ item }) => {
        console.log('Dados item:', item); // <-- AQUI É O LUGAR CERTO
    
        return (
            <TouchableOpacity
                onPress={() => navigation.navigate('PlayerCurtel', {
                    videoUrl: item.video_url,
                    thumbnailUrl: item.thumbnail_url,
                    videoId: item.id,
                    userId: item.userId
                })}
                style={[styles.itemContainer, { margin }]}
            >
                <Image source={{ uri: item.thumbnail_url }} style={styles.thumbnail} />
    
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={styles.gradientOverlay}
                >
                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            <Ionicons name="heart" size={14} color="#fff" />
                            <Text style={styles.infoText}>{item.curtidas_count || 0}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Ionicons name="eye" size={14} color="#fff" />
                            <Text style={styles.infoText}>{item.visualizacoes || 0}</Text>
                        </View>
                    </View>
                </LinearGradient>
            </TouchableOpacity>
        );
    };
    

    return (
        <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            numColumns={numColumns}
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        padding: margin,
    },
    itemContainer: {
        width: itemWidth,
        height: itemHeight,
        borderRadius: 4,
        overflow: 'hidden',
        backgroundColor: '#000',
        position: 'relative',
    },
    thumbnail: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    gradientOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingVertical: 6,
        paddingHorizontal: 6,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoText: {
        color: '#fff',
        marginLeft: 4,
        fontSize: 11,
    },
});

export default CurteisLista;
