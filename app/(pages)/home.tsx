import {View,ScrollView, Text, StyleSheet,Vibration, Alert, SafeAreaView,TouchableOpacity, Platform, StatusBar, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Tab from '@/components/Tab';
import Header from '@/components/Header';
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
    const user = useUserStore((state) => state.user);
    const updateField = useUserStore((state) => state.updateField);
    const navigation = useNavigation<NavigationProp<Record<string, undefined>>>();

    const updateUser = async (
        field: string,
        value: string | boolean
    ) => {
        if (field === 'status') updateField('status', value as string);
        if (field === 'need_drink') updateField('need_drink', value as boolean);
        await axiosInstance.post('change-status', {
            status: field === 'status' ? value : user?.status,
            need_drink: field === 'need_drink' ? value : user?.need_drink,
            dance_floor_position: ""
        });
    }

    const getMe = async () => {
        try {
            const { data } = await axiosInstance.get('me');
            updateField('status', data.status);
            updateField('need_drink', data.need_drink);
            updateField('dance_floor_position', data.dance_floor_position);
            updateField('locker_code', data.locker_code);
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




    const items = [
        {key: 'Main', name: 'Main Dance Floor'},
        {key: 'Second', name: 'Second Dance Floor'},
        {key: 'Break', name: "I'm Taking a Break"},
        {key: 'Home', name: "I'm Going Home"},
    ];

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Header/>
                {activeTab === 'Home' ? (
                <View  style={styles.main}>
                    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                    {items.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            onLongPress={() => {
                                if(item.key === user?.status) {
                                    if(['Main','Second'].includes(item.key)) {
                                        navigation.navigate('(pages)/danceFloor');
                                        console.log('Long press detected');
                                        Vibration.vibrate([0, 100, 200, 100]);
                                    }
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
                                    item.key === user?.status && { fontSize: 38, color: '#fff' },
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
