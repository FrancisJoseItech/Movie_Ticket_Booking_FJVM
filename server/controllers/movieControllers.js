const Movie = require("../model/movieModel");

const fs = require("fs");
const uploadToCloudinary = require("../utilities/uploadToCloudinary"); // ✅ Cloudinary upload utility



// 🎬 Add Movie with (optional) Poster Upload (Admin Only)
const addMovie = async (req, res) => {
  try {
    // 🧠 Extracting fields from request body
    const { title, genre, duration, language, description } = req.body;
    console.log("📥 Add Movie Request Body:", req.body);

    // ❗ Step 1: Validate required fields
    if (!title || !genre || !duration || !language || !description) {
      console.log("⚠️ Missing required fields");
      return res.status(400).json({ message: "All movie fields (title, genre, duration, language, description) are required." });
    }

    // 🔍 Step 2: Check if movie already exists
    const existingMovie = await Movie.findOne({ title });
    if (existingMovie) {
      console.log("⚠️ Duplicate Movie Title:", title);
      return res.status(400).json({ message: "Movie already exists with the same title." });
    }

    let posterUrl = ""; // 🌟 Initialize poster URL as empty

    // 🖼️ Step 3: If poster file is provided, upload to Cloudinary
    if (req.file) {
      const localPath = req.file.path;
      console.log("🖼️ Poster File Path:", localPath);

      try {
        console.log("📤 Uploading poster to Cloudinary...");

        // 🗂️ Optional: upload into 'fjvm-posters' folder
        posterUrl = await uploadToCloudinary(localPath, "fjvm-posters");
        console.log("🌐 Cloudinary Upload Success, URL:", posterUrl);

        // ⚠️ Vercel has no persistent file system, only use this in dev
        if (process.env.NODE_ENV === "development") {
          fs.unlinkSync(localPath);
          console.log("🧹 Local file deleted successfully:", localPath);
        } else {
          console.log("⚠️ Skipped local file deletion on production (e.g., Vercel)");
        }

      } catch (cloudErr) {
        // 🧯 Do NOT crash — just continue without poster
        console.error("❌ Cloudinary Upload Error:", cloudErr.message || cloudErr);
        posterUrl = "";
      }
    } else {
      console.log("ℹ️ No poster uploaded with this movie.");
    }

    // 💾 Step 4: Create new movie document
    const newMovie = new Movie({
      title,
      genre,
      duration,
      language,
      description,
      posterUrl, // 🖼️ Save posterUrl if available, otherwise empty string
    });

    const savedMovie = await newMovie.save();
    console.log("✅ Movie saved successfully:", savedMovie);

    // 📤 Step 5: Send success response
    res.status(201).json({
      message: "✅ Movie added successfully",
      movie: savedMovie,
    });

  } catch (err) {
    console.error("❌ Server Error while adding movie:", err.message);
    res.status(500).json({ message: "Server error while adding movie" });
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
