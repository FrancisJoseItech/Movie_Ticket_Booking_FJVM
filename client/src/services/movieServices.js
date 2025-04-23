import {axiosInstance} from "../axios/axiosInstance"; // ✅ Make sure this path is correct

// 🎬 Fetch all movies (public route)
export const getAllMovies = async () => {
  try {
    console.log("🎥 Fetching all movies...");
    const res = await axiosInstance.get("/movies"); // Make sure this is the correct backend route
    console.log("✅ Movies fetched:", res.data);
    return res.data;
  } catch (error) {
    console.error("❌ Failed to fetch movies:", error.message);
    throw error;
  }
};