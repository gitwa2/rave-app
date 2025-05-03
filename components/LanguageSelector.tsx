import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

const LANGUAGES = [
    { code: 'en', flag: '🇬🇧' },
    { code: 'de', flag: '🇩🇪' }
];

export default function LanguageSelector() {
    const [selectedLanguage, setSelectedLanguage] = useState<string>('en');


    const handleLanguageSelect = async (language: string) => {
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
        opacity: 0,
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
