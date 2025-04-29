import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Welcome to the Home Page!</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    text: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
});
