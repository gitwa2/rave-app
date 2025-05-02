import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Platform,
    Keyboard,
    KeyboardAvoidingView,
    Image
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import axiosInstance from '@/app/axiosConfig';
import LanguageSelector from "@/components/LanguageSelector";
import useUserStore from '@/app/store/userStore';


export default function HomeScreen() {
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [hasGroupCode, setHasGroupCode] = useState(false);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const navigation = useNavigation<NavigationProp<Record<string, undefined>>>();
    const setUser = useUserStore((state) => state.setUser);

    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardVisible(true);
        });
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardVisible(false);
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);


    const handleRegister = async () => {
        try {
            const payload = {
                name: name,
                code: hasGroupCode ? code : '',
            };

            const {data} = await axiosInstance.post('register', payload);
            setUser({
                token: data.token,
                id: data.id,
                name: data.name,
                code: data.code,
                status: "",
                need_drink: false,
            });
            navigation.navigate('(pages)/invite');
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.flagContainer}>
                    <LanguageSelector/>
                </View>

                {!isKeyboardVisible && (
                    <View style={styles.logoContainer}>
                        <Image source={require('@/assets/images/logo.png')} style={{ alignSelf: 'center', width: 180, height: 180 }} />
                        <View style={{ flexDirection:'row' }}>
                            <Text style={{ color: 'white', fontSize: 34, fontWeight: 'bold' }}>RAVE</Text>
                            <Text style={{ backgroundColor:'red',position:'relative',top:19,fontSize: 20, height:24,fontWeight: 'bold'}}>ROOM</Text>
                        </View>
                    </View>)}


                <View style={styles.formContainer}>
                    <Text style={styles.label}>Your name</Text>
                    <TextInput
                        style={styles.input}
                        value={name.replace(/[^a-zA-Z\s]/g, '')}
                        onChangeText={(text) => setName(text.replace(/[^a-zA-Z\s]/g, ''))}
                        placeholder=""
                    />
                    <View style={styles.checkboxContainer}>
                        <TouchableOpacity
                            onPress={() => setHasGroupCode(!hasGroupCode)}
                            style={styles.checkbox}
                        >
                            {hasGroupCode && <View style={styles.checkedBox} />}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setHasGroupCode(!hasGroupCode)}>
                            <Text style={styles.checkboxText}>Do you have a party group code?</Text>
                        </TouchableOpacity>
                    </View>

                    {hasGroupCode && (
                        <TextInput
                            style={[styles.input, { textAlign: 'center' }]}
                            placeholder="Enter your party code"
                            placeholderTextColor="gray"
                            maxLength={4}
                            value={code}
                            onChangeText={(text) => {
                                setCode(text.replace(/[^a-zA-Z0-9]/g, '').toUpperCase());
                            }}
                        />
                    )}

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleRegister}
                    >
                        <Text style={styles.buttonText}>Let's go party! 🎉</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: Platform.OS === 'ios' ? 40 : 0,
    },
    flagContainer: {
        flexDirection: 'row',
        marginTop: 40,
        paddingLeft: 20,
        width: '100%',
    },
    flag: {
        width: 40,
        height: 40,
        marginRight: 20,
        fontSize: 40,
    },
    logoContainer: {
        flex: 1,
        marginTop: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mainText: {
        color: 'white',
        fontSize: 50,
        fontWeight: 'bold',
    },
    formContainer: {
        flex: 2,
        marginTop: 40,
        width: '80%',
        backgroundColor: 'black',
    },
    label: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'SpaceMono',
        marginBottom: 5,
    },
    input: {
        height: 40,
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 5,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
        paddingLeft: 10,
        marginBottom: 20,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: 'white',
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkedBox: {
        width: 12,
        height: 12,
        backgroundColor: 'white',
    },
    checkboxText: {
        color: 'white',
        fontFamily: 'SpaceMono',
        fontSize: 15,
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
        fontFamily: 'SpaceMono'
    },
});
