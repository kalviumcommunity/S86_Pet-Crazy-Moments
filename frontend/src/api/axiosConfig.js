import axios from 'axios';

// Set default base URL for all requests
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

export default axiosInstance;