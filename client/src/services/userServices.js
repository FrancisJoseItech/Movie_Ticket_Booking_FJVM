import { axiosInstance } from '../axios/axiosInstance';

// 🔐 Login API
export const loginUser = (email, password) => {
    return axiosInstance.post("/user/login", { email, password });
};

// register
export const registerUser = (name, email, password) => {
    return axiosInstance.post("/api/user/register", { name, email, password });
  };