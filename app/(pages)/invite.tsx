import { Text, View, ScrollView, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { getUser, userEventEmitter } from '@/app/storage';

export default function InviteScreen() {
    const [code, setCode] = React.useState<string>('');
    const router = useRouter();

    const fetchUser = async () => {
        const user = await getUser();
        console.log(user);
        setCode(user?.code || '');
    };

    useEffect(() => {
        fetchUser(); // Initial fetch

        const listener = () => {
            fetchUser(); // Re-fetch when user data changes
        };

        userEventEmitter.on('userDataChanged', listener);

        return () => {
            userEventEmitter.off('userDataChanged', listener); // Cleanup listener
        };
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={{ flex: 2, padding: 20, marginTop: 50, alignItems:'center', justifyContent: 'center'  }}>
                <Text style={{ fontSize: 32, fontFamily: 'SpaceMono', color: '#999' }}>
                    <Text style={{ fontWeight: 'bold', color: '#fff'}}>You are</Text> the group master.
                    <Text style={{ fontWeight: 'bold', color: '#fff'}}>Share</Text> the{' '}
                    <Text style={{ fontWeight: 'bold', color: '#000', backgroundColor:'red' }}>party code</Text> with your friends.
                </Text>
            </View>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontWeight: 'bold', fontSize: 55, color: 'red' }}>{code}</Text>
            </View>
            <View style={{ width: '100%' }}>
                <TouchableOpacity style={styles.button} onPress={() => router.push('/home')}>
                    <Text style={styles.buttonText}>🕶️ Start</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: Platform.OS === 'ios' ? 40 : 0,
        paddingLeft: 45,
        paddingRight: 45,
        paddingBottom: 45,
    },
    button: {
        backgroundColor: 'white',
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'black',
        fontSize: 22,
        paddingTop: 5,
        paddingBottom: 5,
        fontWeight: 'bold',
        fontFamily: 'SpaceMono',
    },
});
