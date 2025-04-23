// 📦 Import axios
import axios from "axios";

// 🌐 Get the API base URL from the environment variable
// Ensure your .env file (in client folder) contains: VITE_BASE_URL=http://localhost:9000/api
const url = import.meta.env.VITE_BASE_URL;

// 🧪 Log the loaded base URL to confirm it's working as expected
console.log("🌐 Loaded Base URL from .env:", url);

// 🚀 Create a reusable axios instance
const axiosInstance = axios.create({
  baseURL: url, // All API calls will be prefixed with this
  withCredentials: true, // 🛡️ Send cookies (useful if needed for session-based auth)
});

// 🛡️ Attach Authorization token to every outgoing request (if available)
axiosInstance.interceptors.request.use((config) => {
  // 📦 Get token from localStorage (you can also use Redux if needed)
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // ✅ Set token in header
  }

  // 🧠 Log the full request path and method for learning & debugging
  console.log(`📡 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  return config;
});

// ✅ Export the instance to use across your project
export { axiosInstance };
