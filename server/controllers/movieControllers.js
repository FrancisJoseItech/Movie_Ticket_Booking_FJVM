const Movie = require("../model/movieModel");

// 🎬 Add Movie (Admin Only)
const addMovie = async (req, res) => {
  const { title, genre, duration, language, posterUrl, description } = req.body;

  // ✅ Log input
  console.log("📥 Add Movie Request:", req.body);

  // ❗ Check all fields
  if (!title || !genre || !duration || !language ||  !description) {
    return res.status(400).json({ message: "All movie fields are required." });
  }

  try {
    // ❌ Check for duplicate movie title
    const existingMovie = await Movie.findOne({ title });
    if (existingMovie) {
      return res.status(400).json({ message: "Movie already exists with the same title." });
    }

    // 💾 Create and save
    const newMovie = new Movie({ title, genre, duration, language, posterUrl, description });
    const savedMovie = await newMovie.save();

    // ✅ Log and respond
    console.log("✅ Movie added:", savedMovie);
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
      console.log("🎬 Fetching all movies...");
  
      // 🔍 Fetch all movie documents from DB
      const movies = await Movie.find();
  
      console.log(`✅ ${movies.length} movies found.`);
  
      // 📤 Send response
      res.status(200).json(movies);
    } catch (err) {
      console.error("❌ Error fetching movies:", err.message);
      res.status(500).json({ message: "Server error while fetching movies" });
    }
  };

 // ✏️ Update movie by ID (Admin only)
const updateMovie = async (req, res) => {
    const movieId = req.params.id;
    const updates = req.body;
  
    // ✅ Log the incoming update request
    console.log("✏️ Update Request Received for Movie ID:", movieId);
    console.log("📦 Update Data:", updates);
  
    try {
      const updatedMovie = await Movie.findByIdAndUpdate(
        movieId,
        updates,
        { new: true, runValidators: true }// new:true for updated data
      );
  
      if (!updatedMovie) {
        console.warn("❌ Movie not found for update");
        return res.status(404).json({ message: "Movie not found" });
      }
  
      console.log("✅ Movie updated:", updatedMovie);
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
