import React, { useState } from 'react';
import {View, Text,SafeAreaView, StyleSheet,ScrollView, TouchableOpacity, Platform, StatusBar} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Header from '@/components/Header';
import useUserStore from "@/app/store/userStore";
import axiosInstance from "@/app/axiosConfig";

const positions = [
    { key: 'left-top', label: '↖️' },
    { key: 'top', label: '⬆️' },
    { key: 'right-top', label: '↗️' },
    { key: 'left', label: '⬅️' },
    { key: 'center', label: 'center' },
    { key: 'right', label: '➡️' },
    { key: 'left-bottom', label: '↙️' },
    { key: 'bottom', label: '⬇️' },
    { key: 'right-bottom', label: '↘️' },
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
            const { data } = await axiosInstance.post('change-status', {
                status: user?.status,
                need_drink: user?.need_drink,
                main_dance_floor_position: user?.status === 'Main' ? position : "",
                second_dance_floor_position: user?.status === 'Second' ? position : "",
            });

            console.log('Status updated successfully:', data);

            navigation.navigate('(pages)/home');
        } catch (error) {
            console.error('Failed to update status:', error);
        }


    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Header/>
                <Text style={[styles.text, { fontSize: 35, marginTop:20, marginBottom: 10 }]}>{user?.status && status[user.status as keyof typeof status]}</Text>
                <Text style={[styles.text, { fontSize: 24, marginBottom: 10 }]}>🔊 DJ 🔊</Text>
                <View style={{width:150,height:4,backgroundColor:'#fff', borderRadius:100,marginBottom:10}}></View>
                <Text style={[styles.text, { fontSize: 14,color:'red' }]}>Your position</Text>

                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={styles.grid}>
                        {positions.map((position) => (
                            <TouchableOpacity
                                key={position.key}
                                style={[
                                    styles.gridItem,
                                    selectedPosition === position.key && { backgroundColor: 'red' },
                                ]}
                                onPress={() => handelSelectedPosition(position.key)}
                            >
                                <Text style={styles.text}>{position.label}</Text>
                                <Text style={[styles.positionText, selectedPosition === position.key && { color: 'white' }]}>{position.key}</Text>
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
