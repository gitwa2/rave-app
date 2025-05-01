import {DarkTheme, NavigationProp, ThemeProvider,useNavigation} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import useUserStore from "@/app/store/userStore";
import axiosInstance from '@/app/axiosConfig';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

    // const navigation = useNavigation<NavigationProp<Record<string, undefined>>>();
    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state) => state.setUser);


    const fetchUserData = async () => {
        if (user?.token) {
            console.log('token', user.token);

            try {
                const {data} = await axiosInstance.get('me');
                setUser({token: user.token,language: user.language || '', ...data});
            }  catch (error) {
                console.error('Error fetching user data:', error);
            }

        }
    }

    useEffect(() => {
        fetchUserData();
    }, []);


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
          <Stack.Screen name="(pages)/index" options={{
            gestureEnabled: false,
          }} />
          <Stack.Screen name="(pages)/invite" />
          <Stack.Screen
              name="(pages)/home"
              options={{
                gestureEnabled: false,
              }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
  );
}
