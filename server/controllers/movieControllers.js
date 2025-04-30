const Movie = require("../model/movieModel");

// 🎬 Add Movie with optional Cloudinary Poster Upload (Admin Only)
const fs = require("fs");
const uploadToCloudinary = require("../utilities/uploadToCloudinary");           // For local dev
const uploadBufferToCloudinary = require("../utilities/uploadBufferToCloudinary"); // For Vercel memory uploads

const addMovie = async (req, res) => {
  try {
    // 🧠 Extract fields from form-data (text inputs)
    const { title, genre, duration, language, description } = req.body;
    console.log("📥 Movie form submission:", req.body);

    // ⚠️ Validate all required fields
    if (!title || !genre || !duration || !language || !description) {
      console.warn("⚠️ Missing required movie fields.");
      return res.status(400).json({ message: "All movie fields are required." });
    }

    // 🔍 Check if movie already exists by title
    const duplicate = await Movie.findOne({ title });
    if (duplicate) {
      console.warn("⚠️ Duplicate movie title:", title);
      return res.status(400).json({ message: "Movie already exists." });
    }

    let posterUrl = ""; // 🖼️ Will store Cloudinary URL if uploaded

    // 📦 Handle file upload if poster is provided
    if (req.file) {
      console.log("🖼️ Poster file detected...");

      // 📦 1. If file is in memory (Vercel production)
      if (req.file.buffer) {
        console.log("🚀 Uploading from memory buffer (Vercel)...");
        try {
          posterUrl = await uploadBufferToCloudinary(req.file.buffer);
          console.log("🌐 Cloudinary upload (buffer) success:", posterUrl);
        } catch (err) {
          console.error("❌ Cloudinary upload (buffer) failed:", err.message);
        }

      // 💾 2. If file is saved locally (Dev)
      } else if (req.file.path) {
        const localPath = req.file.path;
        console.log("📁 Uploading from local path:", localPath);

        try {
          posterUrl = await uploadToCloudinary(localPath, "fjvm-posters");
          console.log("🌐 Cloudinary upload (file) success:", posterUrl);

          // 🧹 Delete the file locally only in development
          if (process.env.NODE_ENV === "development") {
            fs.unlinkSync(localPath);
            console.log("🧹 Local file deleted:", localPath);
          } else {
            console.log("⚠️ Skipping local file deletion (Vercel has read-only FS)");
          }

        } catch (err) {
          console.error("❌ Cloudinary upload (file) failed:", err.message);
        }
      }

    } else {
      console.log("ℹ️ No poster file uploaded. Proceeding without image.");
    }

    // 💾 Save new movie document
    const newMovie = new Movie({
      title,
      genre,
      duration,
      language,
      description,
      posterUrl, // 💡 will be empty string if upload fails or not provided
    });

    const savedMovie = await newMovie.save();
    console.log("✅ Movie created successfully:", savedMovie.title);

    // 📤 Send success response
    res.status(201).json({
      message: "✅ Movie added successfully",
      movie: savedMovie,
    });

  } catch (err) {
    console.error("❌ Server Error:", err.message);
    res.status(500).json({ message: "Server error while adding movie." });
  }
};


// @desc    Get all movies
// @route   GET /api/movies
// @access  Public
const getAllMovies = async (req, res) => {
  try {
    const today = new Date();

    const movies = await Movie.find()
      .populate({
        path: "shows",
        match: { date: { $gte: today } }, // Only upcoming shows
        populate: [
          { path: "theaterId", select: "name location" },
          { path: "movieId", select: "title" },
        ],
      });

    console.log("🎬 Populated movies with upcoming shows:", movies.length);
    res.status(200).json(movies);
  } catch (err) {
    console.error("❌ Error fetching movies with shows:", err.message);
    res.status(500).json({ message: "Error fetching movies" });
  }
};

 // ✏️ Update movie by ID (Admin only)
 const updateMovie = async (req, res) => {
  const movieId = req.params.id;
  const updates = req.body;

  console.log("✏️ Update Request for Movie ID:", movieId);
  console.log("📦 Update Data (before file):", updates);

  try {
    // ✅ Handle optional poster update
    if (req.file) {
      const localPath = req.file.path;
      console.log("🖼️ New Poster File Path:", localPath);

      const posterUrl = await uploadToCloudinary(localPath);
      updates.posterUrl = posterUrl;

      // 🧹 Delete local file
      fs.unlinkSync(localPath);
    }

    const updatedMovie = await Movie.findByIdAndUpdate(
      movieId,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedMovie) {
      console.warn("❌ Movie not found for update");
      return res.status(404).json({ message: "Movie not found" });
    }

    console.log("✅ Movie updated successfully:", updatedMovie);
    res.status(200).json({
      message: "Movie updated successfully",
      movie: updatedMovie,
    });

  } catch (err) {
    console.error("❌ Error updating movie:", err.message);
    res.status(500).json({ message: "Server error while updating movie" });
  }
};
  
  // 🗑️ Delete movie by ID (Admin only)
const deleteMovie = async (req, res) => {
    const movieId = req.params.id;
  
    console.log("🗑️ Delete Request for Movie ID:", movieId);
  
    try {
      const deletedMovie = await Movie.findByIdAndDelete(movieId);
  
      if (!deletedMovie) {
        console.warn("⚠️ Movie not found for deletion");
        return res.status(404).json({ message: "Movie not found" });
      }
  
      console.log("✅ Movie deleted:", deletedMovie.title);
      res.status(200).json({ message: "Movie deleted successfully" });
    } catch (err) {
      console.error("❌ Error deleting movie:", err.message);
      res.status(500).json({ message: "Server error while deleting movie" });
    }
  };

  // 📦 Controller: Get movie by ID
const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json(movie);
  } catch (err) {
    console.error("❌ Failed to fetch movie by ID:", err.message);
    res.status(500).json({ message: "Server error while fetching movie" });
  }
};


module.exports = {
    addMovie,
    getAllMovies,
    updateMovie,
    deleteMovie,
    getMovieById,
    };
