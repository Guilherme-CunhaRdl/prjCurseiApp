import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import TabNav from "./TabNav";
import Home from "../Screens/Home";
import Login from "../Screens/Login";
import { SafeAreaView, View, Text, ScrollView, TouchableOpacity, Image, StatusBar, Pressable } from 'react-native';

import ParaVoce from "../Screens/Explorar/ParaVocê";
import Assuntos from "../Screens/Explorar/Assuntos";
const Top = createMaterialTopTabNavigator();

const TopTabs = () => {
    return (
        <Top.Navigator>
            <Top.Screen
                name="Para Você"
                component={ParaVoce}
            />
            <Top.Screen
                name="Assuntos do Momento"
                component={Assuntos}
            />
        </Top.Navigator>
    )
}
export default TopTabs