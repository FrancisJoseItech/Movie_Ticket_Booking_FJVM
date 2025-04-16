import axios from 'axios';

// 🌐 Pull the base URL from the .env file
const url = import.meta.env.VITE_BASE_URL;

// ✅ Add this line to test if it's working
// console.log("🌐 Base URL from .env:", url);

const axiosInstance = axios.create({
  baseURL: url,
  withCredentials: true,
});

// ✅ Intercept request to attach token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // or from Redux store if you store it there
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { axiosInstance };
