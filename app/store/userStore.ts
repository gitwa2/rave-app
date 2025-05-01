import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserData } from '@/app/types/user';

interface UserStore {
    user: UserData | null;
    setUser: (user: UserData) => void;
    clearUser: () => void;
    updateField: <K extends keyof UserData>(key: K, value: UserData[K]) => void;
}

const useUserStore = create(
    persist<UserStore>(
        (set) => ({
            user: null,
            setUser: (user: UserData) => set({ user }),
            clearUser: () => set({ user: null }),
            updateField: (key, value) =>
                set((state) => ({
                    user: state.user
                        ? { ...state.user, [key]: value }
                        : null,
                })),
        }),
        {
            name: 'user-storage',
            storage: {
                getItem: async (key) => {
                    const value = await AsyncStorage.getItem(key);
                    return value ? JSON.parse(value) : null;
                },
                setItem: async (key, value) => {
                    await AsyncStorage.setItem(key, JSON.stringify(value));
                },
                removeItem: async (key) => {
                    await AsyncStorage.removeItem(key);
                },
            },
        }
    )
);

export default useUserStore;
