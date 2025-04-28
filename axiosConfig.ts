import axios from 'axios';
import { Alert, Platform } from 'react-native';

const axiosInstance = axios.create({
    baseURL: 'https://raverom.top/',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a response interceptor
axiosInstance.interceptors.response.use(
    response => response, // Pass through successful responses
    error => {
        if (error.response && error.response.status === 400) {
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
