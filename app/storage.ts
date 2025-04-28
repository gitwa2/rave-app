import AsyncStorage from '@react-native-async-storage/async-storage';
import { EventEmitter } from 'events';

const USER_KEY = 'USER_KEY';
export const userEventEmitter = new EventEmitter();

interface UserData {
    token?: string;
    id: number;
    name: string;
    code: string;
    status?: string;
    need_drink?: boolean;
    language?: string;
}

export const setUser = async (id: number, name: string, code: string): Promise<void> => {
    await saveUserData({ id, name, code });
    userEventEmitter.emit('userDataChanged');
};

export const setStatus = (status: string) => updateUserField('status', status);
export const setToken = (token: string) => updateUserField('token', token);
export const setDrinkNeed = (drinkneed: boolean | 0 | 1) => updateUserField('need_drink', Boolean(drinkneed));
export const setLanguage = (language: string) => updateUserField('language', language);

export const getUser = async (): Promise<UserData | null> => {
    try {
        const json = await AsyncStorage.getItem(USER_KEY);
        return json ? JSON.parse(json) as UserData : null;
    } catch (error) {
        console.error('Error retrieving user data:', error);
        return null;
    }
};

export const clearUser = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem(USER_KEY);
        userEventEmitter.emit('userDataChanged');
    } catch (error) {
        console.error('Error clearing user data:', error);
    }
};

const saveUserData = async (data: Partial<UserData>): Promise<void> => {
    try {
        const existingData = await getUser();
        const newData = { ...existingData, ...data };
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(newData));
        userEventEmitter.emit('userDataChanged');
    } catch (error) {
        console.error('Error saving user data:', error);
    }
};

const updateUserField = async <K extends keyof UserData>(key: K, value: UserData[K]): Promise<void> => {
    await saveUserData({ [key]: value } as Partial<UserData>);
};
