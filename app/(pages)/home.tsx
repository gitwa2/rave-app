import {View,ScrollView, Text, StyleSheet,Vibration, Alert, SafeAreaView,TouchableOpacity, Platform, StatusBar, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import Tab from '@/components/Tab';
import { useRouter } from 'expo-router';
import useUserStore from "@/app/store/userStore";
import axiosInstance from "@/app/axiosConfig";

interface Friend {
    id: number;
    name: string;
    status: string;
    need_drink: boolean;
}

export default function HomeScreen() {
    const [activeTab, setActiveTab] = useState('Home');
    const [friends, setFriends] = useState([] as Friend[]);
    const router = useRouter();
    const user = useUserStore((state) => state.user);
    const updateField = useUserStore((state) => state.updateField);

    const updateUser = async (
        field: string,
        value: string | boolean
    ) => {
        if (field === 'status') updateField('status', value as string);
        if (field === 'need_drink') updateField('need_drink', value as boolean);
        const { data } = await axiosInstance.post('change-status', {
            status: field === 'status' ? value : user?.status,
            need_drink: field === 'need_drink' ? value : user?.need_drink,
        });
        console.log(data);
    }

    const getMe= async () => {
        try {
            const { data } = await axiosInstance.get('me');
            updateField('status', data.status);
            updateField('need_drink', data.need_drink);
        } catch (error) {
            console.error('Failed to fetch user data:', error);
            Alert.alert('Error', 'Unable to fetch user data. Please try again later.');
        }
    }

    const getFriends = async () => {
        try {
            const { data } = await axiosInstance.get('friends');
            setFriends(data);
        } catch (error) {
            console.error('Failed to fetch friends:', error);
            Alert.alert('Error', 'Unable to fetch friends. Please try again later.');
        }
    };

    const gettingWater = async (id: number) => {
        try {
            await axiosInstance.get(`getting-water/${id}`);
            await getFriends();
        } catch (error) {
            console.error('Error while getting water:', error);
        }
    };

    useEffect(() => {
        if(activeTab==='Friends'){
            getFriends();
        }else {
            getMe();
        }
    }, [activeTab]);

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
        {key: 'Main', name: 'Main dance floor'},
        {key: 'Second', name: 'Second dance floor'},
        {key: 'Break', name: "I'm taking a break"},
        {key: 'Home', name: "I'm going home"},
    ];

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={{ fontSize: 30, color: '#fff' }}>{user?.name?.replace(/\b\w/g, char => char.toUpperCase())}</Text>
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
                            onLongPress={() => {
                                if(item.key === user?.status) {
                                    console.log('Long press detected');
                                    Vibration.vibrate([0, 100, 200, 100]);
                                }
                            }}
                            onPress={() => {
                                if(item.key === user?.status) return;
                                updateUser('status', item.key);
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
                        onPress={() => {
                            updateUser('need_drink', !user?.need_drink);
                        }}
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

                        {friends.length === 0 ? (
                            <Text style={[styles.text,{fontSize: 30}]}>Share the invite code
                                {' '} <Text style={{backgroundColor:'red',paddingRight:10,paddingLeft:10,marginLeft:8,marginRight:8}}>{user?.code}</Text> {' '}
                                with your friends to join the rave group.</Text>
                        ) : (

                            (friends.map((friend: Friend, index: number) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => console.log(friend.id.toString())}
                                    onLongPress={() => {
                                        gettingWater(friend.id);
                                        Vibration.vibrate([0, 100, 200, 100]);
                                    }}
                                    style={[
                                        styles.friendItem,
                                        {justifyContent:'space-between',flexDirection:'row'}
                                    ]}
                                >
                                    <Text style={[styles.friendItemText]}>{friend.name}</Text>
                                    <Text style={[styles.friendItemText]}>{friend.status || '#'}{friend.need_drink?('💧'):''}</Text>

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
        paddingRight:10,
        paddingLeft:10,
        borderColor:'#444',
    },
    friendItemText:{
        color: '#fff',
        padding: 10,
        fontSize: 25,
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
