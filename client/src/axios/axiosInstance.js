import axios from 'axios';

// 🌐 Pull the base URL from the .env file
const url = import.meta.env.VITE_BASE_URL;

// ✅ Add this line to test if it's working
// console.log("🌐 Base URL from .env:", url);

const axiosInstance = axios.create({
  baseURL: url,
  withCredentials: true,
});

export { axiosInstance };
