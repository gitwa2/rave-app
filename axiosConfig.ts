import axios from 'axios';
import { Alert, Platform } from 'react-native';
import { getUser,clearUser } from '@/app/storage';

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
            await clearUser(); // Clear user data
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
        const user = await getUser();
        if (user?.token) {
            config.headers['Authorization'] = `Bearer ${user.token}`;
        }

        const requestKey = config.url;
        const now = Date.now();

        if (requestKey && requestCache.has(requestKey)) {
            const lastRequestTime = requestCache.get(requestKey);
            if (now - lastRequestTime < 800) {
                return Promise.reject(); // Silently block the request
            }
        }

        if (requestKey) {
            requestCache.set(requestKey, now);
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
