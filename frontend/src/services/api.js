import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json'
    }
});

// 🛡️ THE ENTERPRISE FLEX: Axios Request Interceptor
// Automatically attaches the JWT token to every single request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('aeronexus_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ==========================================
// 🔐 AUTHENTICATION ENDPOINTS
// ==========================================

export const loginUser = async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
};

export const requestRegistration = async (userData) => {
    const response = await api.post('/api/auth/register-request', userData);
    return response.data;
};

export const verifyRegistrationOtp = async (verificationData) => {
    const response = await api.post('/api/auth/verify-otp', verificationData);
    return response.data;
};

// ==========================================
// ✈️ DATA & ROUTING ENDPOINTS
// ==========================================

export const getAnalytics = async () => {
    const response = await api.get('/api/analytics');
    return response.data;
};

export const getRoute = async (originCode, destCode) => {
    const response = await api.get(`/api/route?from=${originCode}&to=${destCode}`);
    return response.data;
};

export const getTraffic = async () => {
    const response = await api.get('/api/traffic');
    return response.data;
};

export const getWeather = async (lat, lon, units = 'metric') => {
    // Note: Weather calls directly to OpenWeather, bypassing your local API base URL
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`);
    return response.data;
};

export default api;