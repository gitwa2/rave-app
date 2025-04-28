import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { getUser, setUser, userEventEmitter } from '@/app/storage';
import 'react-native-reanimated';
import axiosInstance from "@/axiosConfig";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const fetchUser = async () => {
    const user = await getUser();
    if (user?.token !== '') {
      const response = await axiosInstance.get('me');
      const res = response.data;
      setUser(res.id, res.name, res.code);
    }
  };

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

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

  if (!loaded) {
    return null;
  }

  return (
      <ThemeProvider value={DarkTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(pages)/index" />
          <Stack.Screen name="(pages)/explore" />
          <Stack.Screen name="(pages)/invite" />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
  );
}
