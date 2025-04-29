import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Tab({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) {
    return (
        <View style={styles.tabContainer}>
            <TouchableOpacity onPress={() => setActiveTab('Home')}>
                <Text style={[styles.tabText, activeTab === 'Home' && styles.activeTab]}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveTab('Friends')}>
                <Text style={[styles.tabText, activeTab === 'Friends' && styles.activeTab]}>Friends</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        justifyContent: "space-around",
        width: '100%',
    },
    tabText: {
        fontFamily: 'SpaceMono',
        fontSize: 30,
        fontWeight: 'bold',
        color: '#888',
        borderTopWidth: 4,
        padding: 10,
        paddingBottom:20,
    },
    activeTab: {
        color: 'white',
        borderTopColor: 'red',
        borderTopWidth: 4,
    },
});
