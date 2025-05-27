// components/Destaques.js
import React from 'react';
import { View, FlatList, Pressable, Image, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const Destaques = ({ data, navigation, adicionarLogo }) => {
    
    return (
        
        <View style={styles.storysContainer}>
            <FlatList
                horizontal
                data={data}
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
                ListHeaderComponent={
                    <View style={styles.storys}>
                        <Pressable
                            style={styles.circuloStorys}
                            onPress={() => navigation.navigate('CriarDestaques')}
                        >
                            <Image style={styles.imgLogo} source={adicionarLogo} />
                        </Pressable>
                    </View>
                }
                renderItem={({ item }) => (
                    <View style={styles.storys}>
                        <Pressable style={styles.circuloStorys}  onPress={() => navigation.navigate('Destaques')}>
                            <View style={styles.imgLogo}>
                                <Image
                                    style={styles.storyImage}
                                    source={item.photoURL}
                                />
                            </View>
                        </Pressable>
                        <View style={styles.nomeStorys}>
                            <Text style={styles.textStorys}>{item.nome}</Text>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    storysContainer: {
        flexDirection: 'row',
        gap: 10,
        paddingHorizontal: 16,
    },
    storys: {
        alignItems: 'center',
    },
    circuloStorys: {
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#E3E3E3',
        borderRadius: 60,
        height: 60,
        width: 60,
        marginLeft: 5,
        marginRight: 5,
        borderWidth: 2,
    },
    imgLogo: {
        width: '90%',
        height: '90%',
        resizeMode: 'contain',
        borderRadius: 40,
    },
    storyImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
        borderRadius: 100
    },
});

Destaques.propTypes = {
    data: PropTypes.array.isRequired,
    navigation: PropTypes.object.isRequired,
};

export default Destaques;