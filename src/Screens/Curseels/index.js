import React from 'react';
import {SafeAreaView, View, Text, ScrollView, TouchableOpacity, Image, StatusBar, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './styles';

export default function Curseels(){ 
  return (
    <SafeAreaView style={styles.container}>
      {/* Feed Content */}
      <ScrollView style={styles.ContainerCont}>
        {/*Header*/}
        <View style={styles.Header}>
            <View style={styles.curseelsContainer}>
                <Text style={styles.curseelsTitle}>Curseels</Text>
            </View>
    
        </View>
 
      </ScrollView>
    </SafeAreaView>
  );
};

