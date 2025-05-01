import {View,ScrollView, Text, StyleSheet, Alert, SafeAreaView,TouchableOpacity, Platform, StatusBar, Image} from 'react-native';
import React, { useState } from 'react';
import Tab from '@/components/Tab';
import { useRouter } from 'expo-router';
import useUserStore from "@/app/store/userStore";

interface Friend {
    id: number;
    name: string;
    status: string;
    need_drink: boolean;
}

export default function HomeScreen() {
    const [activeTab, setActiveTab] = useState('Home');
    const router = useRouter();
    const user = useUserStore((state) => state.user);

    const handleLogout = async () => {

        if (Platform.OS === 'web') {
            const confirm = window.confirm("Are you sure you want to log out?");
            if (confirm) {
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
                            router.push('/');
                        },
                        style: "destructive",
                    },
                ]
            );
        }
    };



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
                    <Text style={{ fontSize: 30, color: '#fff' }}>{user?.name}</Text>
                    <Text style={{ fontSize: 30, color: 'red', paddingRight: 10, paddingLeft: 10 }}>
                        {user?.code}
                    </Text>


                    <TouchableOpacity onPress={handleLogout}>
                        <Image source={require('@/assets/images/logout.png')} style={{ alignSelf: 'center', width: 40, height: 40 }} />
                    </TouchableOpacity>

                </View>


                {activeTab === 'Home' ? (
                <View  style={styles.main}>
                    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                    {items.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => {
                                console.log(item.key);
                            }}
                            style={[
                                styles.listItem,
                                {
                                    backgroundColor: item.key === user?.status ? 'red' : '#000',
                                    borderColor: item.key === user?.status ? 'red' : '#444',
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.listItemText,
                                    item.key === user?.status && { fontSize: 40, color: '#fff' },
                                ]}
                            >
                                {item.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                        onPress={() => console.log(!user?.need_drink)}
                        style={[styles.listItem,{
                            borderColor: 'blue',
                            backgroundColor: user?.need_drink ? 'blue' : '#000'
                        }]}
                    >
                        <Text style={[
                            styles.listItemText,{
                                color: user?.need_drink ? '#fff' : '#999',
                                fontSize: user?.need_drink ? 30 : 25,
                            }
                        ]}>💧 Water, please</Text>
                    </TouchableOpacity>
                </ScrollView>
                </View>
                ): (<View  style={styles.main}>
                    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>

                        {[].length === 0 ? (
                            <Text style={[styles.text,{fontSize: 30}]}>Share the invite code
                                {' '} <Text style={{backgroundColor:'red',paddingRight:10,paddingLeft:10,marginLeft:8,marginRight:8}}>{user?.code}</Text> {' '}
                                with your friends to join the rave group.</Text>
                        ) : (

                            ([].map((friend: Friend, index: number) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => console.log(friend.id.toString())}
                                    style={[
                                        styles.friendItem,
                                        {justifyContent:'space-between',flexDirection:'row'}
                                    ]}
                                >
                                    <Text style={[styles.friendItemText]}>{friend.name}</Text>
                                    <Text style={[styles.friendItemText]}>{friend.status || '#'}</Text>

                                </TouchableOpacity>
                            )))

                        )}

                    </ScrollView>
                </View>)}


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
        padding:20
    },
    listItem: {
        marginBottom: 10,
        width: '100%',
        alignItems: 'center',
        borderWidth:2,
        borderColor:'#444',
    },
    friendItem:{
        marginBottom: 10,
        width: '100%',
        alignItems: 'center',
        borderWidth:2,
        borderColor:'#444',
    },
    friendItemText:{
        color: '#fff',
        padding: 10,
        fontSize: 35,
        fontFamily: 'SpaceMono',
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
        fontFamily: 'SpaceMono',
    },
});
