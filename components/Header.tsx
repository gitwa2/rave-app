import {Alert, Image, Platform, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React from "react";
import {useRouter} from "expo-router";
import useUserStore from "@/app/store/userStore";

export default function Header() {

    const user = useUserStore((state) => state.user);
    const clearUser = useUserStore((state) => state.clearUser);
    const router = useRouter();
    const handleLogout = async () => {

        if (Platform.OS === 'web') {
            const confirm = window.confirm("Are you sure you want to log out?");
            if (confirm) {
                clearUser();
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
                            clearUser();
                            router.push('/');
                        },
                        style: "destructive",
                    },
                ]
            );
        }
    };

    return (<View style={styles.header}>
        <Text style={{ fontSize: 30, color: '#fff' }}>{user?.name?.replace(/\b\w/g, char => char.toUpperCase())}</Text>
        <Text style={{ fontSize: 30, color: 'red', paddingRight: 10, paddingLeft: 10 }}>
            {user?.code}
        </Text>
        <TouchableOpacity onPress={handleLogout}>
            <Image source={require('@/assets/images/logout.png')} style={{ alignSelf: 'center', width: 40, height: 40 }} />
        </TouchableOpacity>
    </View>)
}


const styles = StyleSheet.create({
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
});
