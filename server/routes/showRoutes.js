const express = require("express");
const router = express.Router();
const { addShow, getAllShows, getPublicShows } = require("../controllers/showControllers");
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");

// 🛡️ Protected route, only admin can add shows
router.post("/addshow", protect, authorizeRoles("admin","theater_owner"), addShow);

// 📽️ Admin-only route to get all shows
router.get("/", protect, authorizeRoles("admin"), getAllShows);

// 🌍 Public route - anyone can access
router.get("/public", getPublicShows);

module.exports = router;
