// 📁 src/services/showServices.js

import {axiosInstance} from "../axios/axiosInstance";

// 🎬 Get all public shows (for /shows page)
export const getPublicShows = async () => {
    try {
      const res = await axiosInstance.get("/shows/public");
      console.log("getPublicShows - Response:", res.data);
      return res.data; // ✅ Return only res.data, not whole res
    } catch (error) {
      console.error("❌ getPublicShows failed:", error.message);
      throw error;
    }
  };

// 🎟️ Create Stripe session for booking
export const createCheckoutSession = async (showId, seats) => {
  try {
    const res = await axiosInstance.post("/payment/create-checkout-session", {
      showId,
      seats,
    });
    console.log("💳 Stripe session created:", res.data);
    return res.data;
  } catch (error) {
    console.error("❌ Stripe session error:", error.message);
    throw error;
  }
};
