// 📁 src/services/adminServices.js
import {axiosInstance} from "../axios/axiosInstance";


// 📡 Fetch all movies
export const getAllMovies = async () => {
  const res = await axiosInstance.get("/movies/");
  console.log("📽️ Fetched movies:", res.data);
  return res.data;
};

// 🧩 Add movie with poster (multipart/form-data)
export const addMovieWithPoster = async (formData, posterFile) => {
    const payload = new FormData();
  
    // 🧱 Append text fields
    Object.entries(formData).forEach(([key, value]) => {
      payload.append(key, value);
    });
  
    // 🖼️ Append poster file
    payload.append("poster", posterFile);
  
    console.log("🚀 Uploading Movie + Poster to backend:", payload);
  
    // 📤 API call
    const res = await axiosInstance.post("/movies/addmovie", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  
    return res;
  };

  // ✅ Delete a movie by ID
export const deleteMovie = async (movieId) => {
    try {
      const res = await axiosInstance.delete(`/movies/${movieId}`);
      console.log("🗑️ Movie deleted:", res.data);
      return res.data;
    } catch (error) {
      console.error("❌ Failed to delete movie:", error.message);
      throw error;
    }
  };