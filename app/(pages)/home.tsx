import {
    View,
    ScrollView,
    Text,
    StyleSheet,
    Vibration,
    Alert,
    SafeAreaView,
    TouchableOpacity,
    Platform,
    StatusBar, Image
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Tab from '@/components/Tab';
import Header from '@/components/Header';
import useUserStore from '@/app/store/userStore';
import axiosInstance from '@/app/axiosConfig';

interface Friend {
    id: number;
    name: string;
    status: string;
    need_drink: boolean;
    dance_floor_position: string;
    locker_code: string;
}

export default function HomeScreen() {
    const [activeTab, setActiveTab] = useState('Home');
    const [friends, setFriends] = useState<Friend[]>([]);
    const user = useUserStore((state) => state.user);
    const updateField = useUserStore((state) => state.updateField);
    const navigation = useNavigation<NavigationProp<Record<string, undefined>>>();

    const updateUser = async (field: string, value: string | boolean) => {
        if (field === 'status') updateField('status', value as string);
        if (field === 'need_drink') updateField('need_drink', value as boolean);
        const {data} = await axiosInstance.post('change-status', {
            status: field === 'status' ? value : user?.status,
            need_drink: field === 'need_drink' ? value : user?.need_drink,
            dance_floor_position: field === 'need_drink'? user?.dance_floor_position : '',
        });
        updateField('dance_floor_position', data.dance_floor_position);
    };

    const getMe = async () => {
        try {
            const { data } = await axiosInstance.get('me');
            updateField('status', data.status);
            updateField('need_drink', data.need_drink);
            updateField('dance_floor_position', data.dance_floor_position);
            updateField('locker_code', data.locker_code);
        } catch (error) {
            console.error('status error:', (error as any)?.status);
            Alert.alert('Error', 'Unable to fetch user data. Please try again later.');
        }
    };

    const getFriends = async () => {
        try {
            const { data } = await axiosInstance.get('friends');
            setFriends(data);
        } catch (error) {
            console.error('Failed to fetch friends:', error);
            Alert.alert('Error', 'Unable to fetch friends. Please try again later.');
        }
    };

    const setLockerCode = async (code: string) => {
        try {
            await axiosInstance.post('locker-code', { locker_code: code });
            updateField('locker_code', code);
        } catch (error) {
            console.error('Error while setting locker code:', error);
        }
    }

    const gettingWater = async (id: number) => {
        try {
            await axiosInstance.get(`getting-water/${id}`);
            await getFriends();
        } catch (error) {
            console.error('Error while getting water:', error);
        }
    };

    useEffect(() => {
        activeTab === 'Friends' ? getFriends() : getMe();
    }, [activeTab]);

    const items = [
        { key: 'Main', name: 'Main Floor' },
        { key: 'Second', name: 'Second Floor' },
        { key: 'Break', name: 'Break' },
        { key: 'Home', name: 'Home' }
    ];

    const danceFloorImages: Record<string, any> = {
        'center': require('@/assets/images/center.png'),
        'left': require('@/assets/images/left.png'),
        'right': require('@/assets/images/right.png'),
        'top': require('@/assets/images/top.png'),
        'left-top': require('@/assets/images/top-left.png'),
        'right-top': require('@/assets/images/top-right.png'),
        'left-bottom': require('@/assets/images/bottom-left.png'),
        'right-bottom': require('@/assets/images/bottom-right.png'),
        'bottom': require('@/assets/images/bottom-center.png'),
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Header />
                {activeTab === 'Home' ? (
                    <View style={styles.main}>
                        <ScrollView contentContainerStyle={styles.scrollContainer}>
                            {items.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onLongPress={() => {
                                        if (item.key === user?.status && ['Main', 'Second'].includes(item.key)) {
                                            navigation.navigate('(pages)/danceFloor');
                                            Vibration.vibrate([0, 100, 200, 100]);
                                        }
                                    }}
                                    onPress={() => {
                                        if (item.key !== user?.status) updateUser('status', item.key);
                                    }}
                                    style={[
                                        styles.statusButton,
                                        {
                                            backgroundColor: item.key === user?.status ? 'red' : '#000',
                                            borderColor: item.key === user?.status ? 'red' : '#444'
                                        }
                                    ]}
                                >
                                    <Text style={styles.statusText}>{item.name}</Text>

                                    {user?.need_drink && item.key === user?.status && (<View style={styles.statusIconBlue}>
                                        <Text style={{fontSize:25}}>💧</Text>
                                    </View>)}


                                    {item.key === user?.status && user?.dance_floor_position && (<View style={styles.statusIconGray}>
                                        <Image source={danceFloorImages[user?.dance_floor_position || '']} style={{ alignSelf: 'center', width: 25, height: 25 }} />
                                    </View>)}

                                </TouchableOpacity>
                            ))}

                            <TouchableOpacity
                                disabled={user?.status === ''}
                                onPress={() => updateUser('need_drink', !user?.need_drink)}
                                style={[
                                    styles.waterButton,
                                    {
                                        backgroundColor: user?.need_drink ? 'blue' : '#000',
                                        borderColor: 'blue',
                                        marginTop:10,
                                        opacity: user?.status === '' ? 0.4 : 1,
                                    }
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.waterButtonText,
                                        { color: user?.need_drink ? '#fff' : '#999' }
                                    ]}
                                >
                                    💧 Water, please
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.statusButton, { backgroundColor: '#000', marginTop: 40, borderColor: '#444' }]}
                                onPress={() => Alert.prompt(
                                    "Locker Code",
                                    "Enter your locker code:",
                                    [
                                        {
                                            text: "Cancel",
                                            style: "cancel"
                                        },
                                        {
                                            text: "Submit",
                                            onPress: (code) => {
                                                if (!code || code.length > 10) {
                                                    Alert.alert('Error', 'Locker code must be 10 characters or less.');
                                                    return;
                                                }
                                                setLockerCode(code);
                                            },
                                        }
                                    ],
                                    "plain-text"
                                )}
                            >
                                <Text style={[styles.statusText, { fontSize: 16, textAlign: 'center' }]}>
                                     {user?.locker_code===''?  'Locker Code ?':`Locker Code : ${user?.locker_code}`}
                                </Text>
                                <View style={styles.statusIconGray}>
                                    <Image source={require('@/assets/images/locker.png')} style={{ alignSelf: 'center', width: 25, height: 25 }} />
                                </View>
                            </TouchableOpacity>

                        </ScrollView>
                    </View>
                ) : (
                    <View style={styles.main}>
                        <ScrollView contentContainerStyle={styles.scrollContainer}>
                            {friends.length === 0 ? (
                                <Text style={styles.inviteText}>
                                    Share the invite code{' '}
                                    <Text style={styles.codeHighlight}>{user?.code}</Text>{' '}
                                    with your friends to join the rave group.
                                </Text>
                            ) : (

                                friends.map((friend, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={[
                                                styles.statusButton,
                                                {
                                                    borderColor: '#444'
                                                }
                                            ]}
                                        >
                                            <Text style={styles.statusText}>{friend.name}</Text>
                                            <Text style={[
                                                styles.statusText,
                                                {fontSize: 20}
                                            ]}>{friend.status}</Text>

                                            {friend?.need_drink && (<View style={styles.statusIconBlue}>
                                                <Text style={{fontSize:25}}>💧</Text>
                                            </View>)}


                                            {friend?.dance_floor_position !== '' && (<View style={styles.statusIconGray}>
                                                <Image source={danceFloorImages[friend?.dance_floor_position || '']} style={{ alignSelf: 'center', width: 25, height: 25 }} />
                                            </View>)}


                                        </TouchableOpacity>
                                    ))

                            )}
                        </ScrollView>
                    </View>
                )}
                <Tab activeTab={activeTab} setActiveTab={setActiveTab} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'black',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black'
    },
    main: {
        width: '100%',
        flex: 1,
        padding: 20
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    statusButton: {
        borderWidth: 2,
        marginBottom: 6,
        minHeight: 54,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    statusText: {
        fontSize: 25,
        paddingHorizontal: 8,
        color: '#fff',
        fontFamily: 'SpaceMono',
        flexGrow: 1,
        flexShrink: 1,
        flexWrap: 'wrap'
    },
    statusIconBlue: {
        width: 50,
        height: 50,
        backgroundColor: 'blue',
        flexShrink: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusIconGray: {
        width: 50,
        height: 50,
        backgroundColor: '#333',
        flexShrink: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    waterButton: {
        marginBottom: 10,
        width: '100%',
        alignItems: 'center',
        borderWidth: 2
    },
    waterButtonText: {
        padding: 8,
        fontSize: 25,
        fontFamily: 'SpaceMono'
    },
    friendItem: {
        marginBottom: 10,
        width: '100%',
        borderWidth: 2,
        borderColor: '#444',
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    friendText: {
        color: '#fff',
        padding: 10,
        fontSize: 25,
        fontFamily: 'SpaceMono'
    },
    inviteText: {
        color: 'white',
        fontSize: 30,
        margin: 30,
        fontFamily: 'SpaceMono',
        textAlign: 'center'
    },
    codeHighlight: {
        backgroundColor: 'red',
        paddingHorizontal: 10,
        marginHorizontal: 8
    }
});
