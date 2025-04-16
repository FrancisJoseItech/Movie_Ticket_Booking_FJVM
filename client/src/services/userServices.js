import { axiosInstance } from '../axios/axiosInstance';

// 🔐 Login API
export const loginUser = (email, password) => {
    return axiosInstance.post("/user/login", { email, password });
};

// ✅ Register API (🌟 added role explicitly with default as 'user')
export const registerUser = (name, email, password, role = "user") => {
    console.log("📦 Sending registration payload:", { name, email, password, role }); // ✅ Debug API payload
    return axiosInstance.post("/user/register", { name, email, password, role }); //
  };

  // 🧠 Function to fetch all users (admin-only route)
export const getAllUsers = async () => {
    console.log("📤 Calling API: /users/allusers");
    const res = await axiosInstance.get("/users/allusers");
    console.log("📥 Response from /users/allusers:", res.data);
    return res.data;
  };