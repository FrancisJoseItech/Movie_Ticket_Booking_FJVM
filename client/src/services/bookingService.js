import {axiosInstance} from "../axios/axiosInstance";

// 🔄 Get bookings for logged-in user
export const getUserBookings = () => {
  console.log("📡 Fetching user bookings...");
  return axiosInstance.get("/bookings/my-bookings");
};