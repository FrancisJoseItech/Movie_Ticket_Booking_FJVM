import {axiosInstance} from "../axios/axiosInstance";

// 🔄 Get bookings for logged-in user
export const getUserBookings = () => {
  console.log("📡 Fetching user bookings...");
  return axiosInstance.get("/bookings/my-bookings");
};

// 🎯 Confirm Booking After Payment Success
export const confirmBooking = async (showId, seats) => {
  try {
    const res = await axiosInstance.post("/bookings/book", {
      showId,
      seats,
    });

    console.log("✅ Booking confirmed on server:", res.data);
    return res.data;
  } catch (error) {
    console.error("❌ Booking confirmation failed:", error.message);
    throw error;
  }
};