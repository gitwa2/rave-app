import {DarkTheme, ThemeProvider} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import useUserStore from "@/app/store/userStore";
import axiosInstance from '@/app/axiosConfig';
import { useRouter, usePathname } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state) => state.setUser);
    const router = useRouter();
    const pathname = usePathname();

    const fetchUserData = async () => {
        if (user?.token) {
            try {
                const { data } = await axiosInstance.get('me');
                setUser({ token: user.token, language: user.language || '', ...data });

                if (!['/home','/danceFloor','/invite'].includes(pathname)) {
                    router.replace('/home');
                }
            } catch (error: any) {
                if (error.response?.status === 401) {
                    if (pathname !== '/') {
                        router.replace('/');
                    }
                } else {
                    console.error('Error fetching user data:', error);
                }
            }
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [pathname]);

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <ThemeProvider value={DarkTheme}>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(pages)/index" options={{ gestureEnabled: false }} />
                <Stack.Screen name="(pages)/invite" />
                <Stack.Screen name="(pages)/danceFloor" options={{ headerShown: false, animation: 'slide_from_right' }} />
                <Stack.Screen
                    name="(pages)/home"
                    options={{ gestureEnabled: false }}
                />
                <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
        </ThemeProvider>
    );
}
