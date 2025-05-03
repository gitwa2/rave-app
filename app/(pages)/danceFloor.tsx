import React, { useState } from 'react';
import {View, Text,SafeAreaView,Image, StyleSheet,ScrollView, TouchableOpacity, Platform, StatusBar} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Header from '@/components/Header';
import useUserStore from "@/app/store/userStore";
import axiosInstance from "@/app/axiosConfig";

const positions = [
    { key: 'left-top', label: '↖️', icon: require('@/assets/images/top-left.png') },
    { key: 'top', label: '⬆️', icon: require('@/assets/images/top.png') },
    { key: 'right-top', label: '↗️', icon: require('@/assets/images/top-right.png') },
    { key: 'left', label: '⬅️',icon: require('@/assets/images/left.png') },
    { key: 'center', label: 'center',icon: require('@/assets/images/center.png') },
    { key: 'right', label: '➡️',icon: require('@/assets/images/right.png') },
    { key: 'left-bottom', label: '↙️', icon: require('@/assets/images/bottom-left.png') },
    { key: 'bottom', label: '⬇️', icon: require('@/assets/images/bottom-center.png') },
    { key: 'right-bottom', label: '↘️', icon: require('@/assets/images/bottom-right.png') },
];


const status = {
    Main: 'Main Dance Floor',
    Second: 'Second Dance Floor',
};

export default function DanceFloor() {
    const user = useUserStore((state) => state.user);
    const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
    const navigation = useNavigation<NavigationProp<Record<string, undefined>>>();

    const handelSelectedPosition = async (position: string) => {
        setSelectedPosition(position);

        try {
            await axiosInstance.post('change-status', {
                status: user?.status,
                need_drink: user?.need_drink,
                dance_floor_position: position,
            });
            navigation.navigate('(pages)/home');

        } catch (error) {
            console.error('Failed to update status:', error);
        }


    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Header/>
                <Text style={[styles.text, { fontSize: 25, marginTop:20, marginBottom: 10 }]}>{user?.status && status[user.status as keyof typeof status]}</Text>
                <Image source={require('@/assets/images/dj.png')} style={{ width: 149, height: 108.52, marginBottom: 20 }} />
                <Text style={[styles.text, { fontSize: 20,color:'red' }]}>Your position</Text>

                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={styles.grid}>
                        {positions.map((position) => (
                            <TouchableOpacity
                                key={position.key}
                                style={[
                                    styles.gridItem,
                                    (selectedPosition === position.key || user?.dance_floor_position === position.key) && {
                                        backgroundColor: 'red',
                                    },
                                ]}
                                onPress={() => handelSelectedPosition(position.key)}
                            >
                                <Image source={position.icon} style={{ width: 50, height: 50 }} />
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
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
        alignItems: 'center',
        backgroundColor: 'black',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '95%',
    },
    gridItem: {
        width: '33.33%',
        height: '33.33%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        backgroundColor: '#222',
    },
    text: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'SpaceMono',
    },
    positionText: {
        color: 'gray',
        fontSize: 14,
        marginTop: 5,
    },
});
