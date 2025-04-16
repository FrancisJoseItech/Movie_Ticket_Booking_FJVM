const express = require("express");
const router = express.Router();
const { addMovie, getAllMovies, updateMovie, deleteMovie } = require("../controllers/movieControllers");
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/multer"); // ✅ Multer for image upload

// 🎯 Admin-only route to add movie with poster upload
router.post("/addmovie", protect, authorizeRoles("admin"),upload.single("poster"), addMovie);
router.put("/:id", protect, authorizeRoles("admin"),upload.single("poster"), updateMovie);  // ⬅️ Optional image update
router.delete("/:id", protect, authorizeRoles("admin"), deleteMovie);

// 🌐 Public route to fetch all movies
router.get("/", getAllMovies );

module.exports = router;
