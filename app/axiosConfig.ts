import axios from 'axios';
import { Alert, Platform } from 'react-native';
import useUserStore from '@/app/store/userStore';

const axiosInstance = axios.create({
    baseURL: 'https://raverom.top/api/',
    headers: {
        'Content-Type': 'application/json',
    },
});

const requestCache = new Map();


axiosInstance.interceptors.response.use(
    response => response, // Pass through successful responses
    async error => {
        if (error?.response?.status === 401) {
            useUserStore.getState().clearUser();
            if (Platform.OS === 'web') {
                window.location.href = '/'; // Navigate to root for web
            } else {
                Alert.alert('Session Expired', 'You have been logged out.');
            }
        }
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.request.use(
    async config => {
        const user = useUserStore.getState().user; // Access user from userStore
        if (user?.token) {
            config.headers['Authorization'] = `Bearer ${user.token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    response => response, // Pass through successful responses
    error => {
        if (error && error.response && error.response.status === 400) {
            const errorMessage = error.response.data?.error || 'Bad Request';
            if (Platform.OS === 'ios' || Platform.OS === 'android') {
                Alert.alert('Error', errorMessage);
            } else {
                alert(errorMessage); // Fallback for web
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
