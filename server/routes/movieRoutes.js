const express = require("express");
const router = express.Router();
const { addMovie, getAllMovies, updateMovie, deleteMovie } = require("../controllers/movieControllers");
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");

// 🎯 Admin-only route to add movie
router.post("/addmovie", protect, authorizeRoles("admin"), addMovie);
router.put("/:id", protect, authorizeRoles("admin"), updateMovie);
router.delete("/:id", protect, authorizeRoles("admin"), deleteMovie);

// 🌐 Public route to fetch all movies
router.get("/", getAllMovies );

module.exports = router;
