import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json'
    }
});

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
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`);
    return response.data;
};

export default api;
