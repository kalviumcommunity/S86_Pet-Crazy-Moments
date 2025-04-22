import axios from 'axios';

// Set default base URL for all requests
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://s86-pet-crazy-moments.onrender.com/',
});

export default axiosInstance;