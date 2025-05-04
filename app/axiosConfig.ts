import axios from 'axios';
import { Alert, Platform } from 'react-native';
import useUserStore from '@/app/store/userStore';
import { useRouter } from 'expo-router';

const axiosInstance = axios.create({
    baseURL: 'https://raverom.top/api/',
    headers: {
        'Content-Type': 'application/json',
    },
});



// Request Interceptor
axiosInstance.interceptors.request.use(
    async config => {
        const user = useUserStore.getState().user;
        if (user?.token) {
            config.headers['Authorization'] = `Bearer ${user.token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

// Response Interceptor

const router = useRouter();

axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const status = error?.response?.status;
        if (status === 401) {
            useUserStore.getState().clearUser();
            if (Platform.OS === 'web') {
                window.location.href = '/';
            } else {
                Alert.alert('Session Expired', 'You have been logged out.');
                router.push('/');
            }
        } else if (status === 400) {
            const errorMessage = error.response.data?.error || 'Bad Request';
            if (Platform.OS === 'ios' || Platform.OS === 'android') {
                Alert.alert('Error', errorMessage);
            } else {
                alert(errorMessage);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
