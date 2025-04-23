const Movie = require("../model/movieModel");

// 🎬 Add Movie with Cloudinary Poster Upload (Admin Only)
const fs = require("fs");
const uploadToCloudinary = require("../utilities/uploadToCloudinary"); // ✅ Must match the export


// 🎬 Add Movie (Admin Only)
const addMovie = async (req, res) => {
  try {
    const { title, genre, duration, language, description } = req.body;

    console.log("📥 Add Movie Request Body:", req.body);

    // ❗ Validate required fields
    if (!title || !genre || !duration || !language || !description) {
      return res.status(400).json({ message: "All movie fields are required." });
    }

    // 🔍 Check for duplicate movie
    const existingMovie = await Movie.findOne({ title });
    if (existingMovie) {
      return res.status(400).json({ message: "Movie already exists with the same title." });
    }

    let posterUrl = "";
    if (req.file) {
      const localPath = req.file.path;
      console.log("🖼️ Poster File Path:", localPath);

      try {
        console.log("📤 Calling uploadToCloudinary...");
        posterUrl = await uploadToCloudinary(localPath);
        console.log("🌐 Cloudinary URL returned:", posterUrl);
      
        fs.unlinkSync(localPath);
        console.log("🧹 Local file deleted:", localPath);
      } catch (cloudErr) {
        console.error("❌ Cloudinary Upload Error:", cloudErr);
        return res.status(500).json({ message: "Cloudinary upload failed" });
      }

    }

    // 💾 Create and save movie
    const newMovie = new Movie({
      title,
      genre,
      duration,
      language,
      description,
      posterUrl,
    });

    const savedMovie = await newMovie.save();

    console.log("✅ Movie saved successfully:", savedMovie);
    res.status(201).json({
      message: "Movie added successfully",
      movie: savedMovie,
    });

  } catch (err) {
    console.error("❌ Error adding movie:", err.message);
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

module.exports = {
     addMovie,
    getAllMovies,
    updateMovie,
    deleteMovie
    };
