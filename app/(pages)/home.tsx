import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Tab from '@/components/Tab';
import { clearUser } from '@/app/storage';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
    const [activeTab, setActiveTab] = useState('Home');
    const router = useRouter();

    const handleLogout = async () => {
        await clearUser();
        router.push('/');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Welcome to the Home Page!</Text>
            <TouchableOpacity onPress={handleLogout}>
                <Text style={styles.text}>logout</Text>
            </TouchableOpacity>
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
        paddingBottom: 20,
    },
    text: {
        color: 'white',
        fontSize: 24,
        margin: 30,
        fontWeight: 'bold',
    },
});
