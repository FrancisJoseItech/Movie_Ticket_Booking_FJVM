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

/**
 * 🔍 Fetch a single show by its ID
 * @param {string} id - The MongoDB ObjectId of the show
 * @returns {Promise<Object>} - A promise that resolves to the show data
 */
export const getShowById = async (id) => {
    // 📡 Make a GET request to backend endpoint `/shows/:id`
    const res = await axiosInstance.get(`/shows/${id}`);
  
    // 📥 Return the full show object from the response
    return res.data;
  };

  
  // 📡 API CALL: Fetch Shows Belonging to Logged-In Theater Owner
// -------------------------------------------------------------
// 🔹 Endpoint: GET /shows/my-shows
// 🔹 Purpose: Fetches all shows created by the currently logged-in user
// 🔐 Requires: Bearer Token (automatically handled by axiosInstance)
// 🔄 Used In: TheaterOwnerDashboard or any page where theater owner needs to see their shows
// ✅ Returns: Array of show objects (movieId, theaterId, date, time, price, etc.)
export const getMyShows = async () => {
    const res = await axiosInstance.get("/shows/my-shows");
    return res.data;
  };
