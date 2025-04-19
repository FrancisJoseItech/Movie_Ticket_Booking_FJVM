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

  // 🔄 Update a movie by ID with optional new poster
export const updateMovieWithPoster = async (movieId, formData, posterFile) => {
    try {
      const payload = new FormData();
  
      // 🧱 Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        payload.append(key, value);
      });
  
      // 🖼️ Append new poster if it exists
      if (posterFile) {
        payload.append("poster", posterFile);
      }
  
      console.log("✏️ Updating movie:", movieId, formData);
  
      const res = await axiosInstance.put(`/movies/${movieId}`, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      console.log("✅ Movie updated:", res.data);
      return res.data;
    } catch (error) {
      console.error("❌ Failed to update movie:", error.message);
      throw error;
    }
  };

  // 🏢 GET all theaters (Admin or Public)
export const getAllTheaters = async () => {
  const res = await axiosInstance.get("/theaters/");
  console.log("🎭 Fetched theaters:", res.data);
  return res.data;
};

// 🆕 POST new theater
export const addTheater = async (theaterData) => {
  const res = await axiosInstance.post("/theaters/addtheater", theaterData);
  console.log("🏗️ Theater added:", res.data);
  return res.data;
};

// ✏️ PUT update theater by ID
export const updateTheater = async (id, updatedData) => {
  const res = await axiosInstance.put(`/theaters/update/${id}`, updatedData);
  console.log("✏️ Theater updated:", res.data);
  return res.data;
};

// 🗑️ DELETE theater by ID
export const deleteTheater = async (id) => {
  const res = await axiosInstance.delete(`/theaters/delete/${id}`);
  console.log("🗑️ Theater deleted:", res.data);
  return res.data;
};
