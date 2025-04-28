import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { setLanguage,setUser, getUser } from '@/app/storage';

const LANGUAGES = [
    { code: 'en', flag: '🇬🇧' },
    { code: 'de', flag: '🇩🇪' }
];

export default function LanguageSelector() {
    const [selectedLanguage, setSelectedLanguage] = useState<string>('en');

    useEffect(() => {
        (async () => {
            const user = await getUser();
            if (user?.language) {
                setSelectedLanguage(user.language);
            }else{
                setUser(0, '', 0);
            }
        })();
    }, []);

    const handleLanguageSelect = async (language: string) => {
        await setLanguage(language);
        setSelectedLanguage(language);
    };

    const renderLanguageOption = ({ code, flag }: { code: string; flag: string }) => (
        <Pressable key={code} onPress={() => handleLanguageSelect(code)}>
            <Text style={[styles.flag, selectedLanguage !== code && styles.inactiveFlag]}>
                {flag}
            </Text>
        </Pressable>
    );

    return <View style={styles.flagContainer}>{LANGUAGES.map(renderLanguageOption)}</View>;
}

const styles = StyleSheet.create({
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
    inactiveFlag: {
        opacity: 0.5,
    },
});
