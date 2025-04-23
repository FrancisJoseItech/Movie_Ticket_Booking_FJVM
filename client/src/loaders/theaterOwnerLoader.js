// 📁 src/loaders/theaterOwnerLoader.js

// 👉 Import the service that fetches theaters
import { getMyTheaters } from "../services/theaterServices";
import { getAllMovies } from "../services/movieServices";

// 🎯 This function will be called before TheaterOwnerDashboard loads
export const theaterOwnerLoader = async () => {
    try {
      const theaters = await getMyTheaters(); // 🏢 Owned theaters
      const movies = await getAllMovies();    // 🎬 All movies
  
      console.log("🎯 Loader fetched:", { theaters, movies });
  
      return { theaters, movies }; // 🧾 Return combined data
    } catch (error) {
      console.error("❌ Loader error:", error.message);
      return { theaters: [], movies: [] };
    }
  };