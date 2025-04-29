import {View, Text, StyleSheet, Alert, SafeAreaView,TouchableOpacity, Platform, StatusBar, Image} from 'react-native';
import React, { useState, useEffect } from 'react';
import Tab from '@/components/Tab';
import { clearUser, getUser } from '@/app/storage';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
    const [activeTab, setActiveTab] = useState('Home');
    const [status, setStatus] = useState('');
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const router = useRouter();


    const handleLogout = async () => {
        if (Platform.OS === 'web') {
            const confirm = window.confirm("Are you sure you want to log out?");
            if (confirm) {
                await clearUser();
                router.push('/');
            }
        } else {
            Alert.alert(
                "Confirm Logout",
                "Are you sure you want to log out?",
                [
                    {
                        text: "Cancel",
                        style: "cancel",
                    },
                    {
                        text: "Logout",
                        onPress: async () => {
                            await clearUser();
                            router.push('/');
                        },
                        style: "destructive",
                    },
                ]
            );
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            const user = await getUser();
            if (user) {
                setName(user.name || '');
                setCode(user.code || '');
            }
        };

        fetchUserData();
    }, []);

    const items = [
        {key: 'Main', name: 'First dance floor'},
        {key: 'Second', name: 'Second dance floor'},
        {key: 'Break', name: "I'm taking a break"},
        {key: 'Home', name: "I'm going home"},
    ];

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={{ fontSize: 30, color: '#fff' }}>{name}</Text>
                    <Text style={{ fontSize: 30, color: 'red', paddingRight: 10, paddingLeft: 10 }}>
                        {code}
                    </Text>


                    <TouchableOpacity onPress={handleLogout}>
                        <Image source={require('@/assets/images/logout.png')} style={{ alignSelf: 'center', width: 40, height: 40 }} />
                    </TouchableOpacity>

                </View>
                <View style={styles.main}>
                    {items.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => setStatus(item.key)}
                            style={[
                                styles.listItem,
                                {
                                    backgroundColor: item.key === status ? 'red' : '#000',
                                    borderColor: item.key === status ? 'red' : '#444',
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.listItemText,
                                    item.key === status && { fontSize: 44, color: '#fff' },
                                ]}
                            >
                                {item.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                        style={[styles.listItem,{ borderColor: 'blue'}]}
                    >
                        <Text style={styles.listItemText}>💧 Water, please</Text>
                    </TouchableOpacity>
                </View>
                <Tab activeTab={activeTab} setActiveTab={setActiveTab} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'black',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    header: {
        backgroundColor: '#222',
        height: 100,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 20,
        paddingRight: 20,
    },
    main: {
        width: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: 20,
        paddingLeft: 20,
    },
    listItem: {
        marginBottom: 10,
        width: '100%',
        alignItems: 'center',
        borderWidth:2,
        borderColor:'#444',
    },
    listItemText:{
        color: '#888',
        padding: 10,
        fontSize: 25,
        fontFamily: 'SpaceMono',
    },
    text: {
        color: 'white',
        fontSize: 24,
        margin: 30,
        fontWeight: 'bold',
    },
});
