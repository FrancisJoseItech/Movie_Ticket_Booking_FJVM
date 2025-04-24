const express = require("express");
const router = express.Router();
const { addShow, getAllShows, getPublicShows, deleteShow, getShowById, getShowsForOwner } = require("../controllers/showControllers");
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");

// 🛡️ Protected route, only admin can add shows
router.post("/addshow", protect, authorizeRoles("admin","theater_owner"), addShow);

// 📽️ Admin-only route to get all shows
router.get("/", protect, authorizeRoles("admin"), getAllShows);

// 🌍 Public route - anyone can access
router.get("/public", getPublicShows);

// DELETE /api/shows/:id
router.delete("/:id", protect, authorizeRoles("admin"), deleteShow);

// ✅ Get individual show details
router.get("/:id", getShowById); 

// ✅ Get individual show details of Theater_owner
router.get("/my-shows", protect, authorizeRoles("theater_owner"), getShowsForOwner)


module.exports = router;
