import { View, Text, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import Tab from '@/components/Tab';

export default function HomeScreen() {

    const [activeTab, setActiveTab] = useState('Home');


    return (
        <View style={styles.container}>
            <Text style={styles.text}>Welcome to the Home Page!</Text>
            <Tab activeTab={activeTab} setActiveTab={setActiveTab} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        paddingBottom:20
    },
    text: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
});
