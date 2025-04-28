import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = 'USER_KEY';

interface UserData {
    id: number;
    name: string;
    group_id: number;
    status?: string;
    drinkneed?: boolean;
    language?: string;
}

export const setUser = async (id: number, name: string, group_id: number) => {
    const userData: UserData = { id, name, group_id };
    try {
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
    } catch (error) {
        console.error('Error saving user data:', error);
    }
};

export const setStatus = async (status: string) => {
    await updateUserField('status', status);
};

export const setDrinkNeed = async (drinkneed: boolean | 0 | 1) => {
    await updateUserField('drinkneed', !!drinkneed);
};

export const setLanguage = async (language: string) => {
    await updateUserField('language', language);
};

export const getUser = async (): Promise<UserData | null> => {
    try {
        const json = await AsyncStorage.getItem(USER_KEY);
        return json ? JSON.parse(json) : null;
    } catch (error) {
        console.error('Error retrieving user data:', error);
        return null;
    }
};

export const clearUser = async () => {
    try {
        await AsyncStorage.removeItem(USER_KEY);
    } catch (error) {
        console.error('Error clearing user data:', error);
    }
};

// ✨ helper function to update any field
const updateUserField = async <K extends keyof UserData>(key: K, value: UserData[K]) => {
    try {
        const json = await AsyncStorage.getItem(USER_KEY);
        if (json) {
            const userData: UserData = JSON.parse(json);
            userData[key] = value;
            await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
        }
    } catch (error) {
        console.error(`Error updating ${key}:`, error);
    }
};

