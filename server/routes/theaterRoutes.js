// server/routes/theaterRoutes.js
const express = require("express");
const router = express.Router();
const { addTheater, getAllTheaters, updateTheater, deleteTheater, getMyTheaters, getTheatersByOwner } = require("../controllers/theaterControllers");
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");

// 🎯 Admin-only route
router.post("/addtheater", protect, authorizeRoles("admin","theater_owner"), addTheater);

// 🌐 Public route
router.get("/", getAllTheaters);

// ✏️ Admin-only route to update a theater by ID
router.put("/update/:id", protect, authorizeRoles("admin"), updateTheater);

// 🗑️ Admin-only route to delete a theater by ID
router.delete("/delete/:id", protect, authorizeRoles("admin"), deleteTheater);

// 👤 Theater Owner - View their own theaters
router.get("/my-theaters", protect, authorizeRoles("theater_owner"), getMyTheaters);

// 👑 Admin - View theaters by specific owner
router.get("/owner/:ownerId", protect, authorizeRoles("admin"), getTheatersByOwner);

module.exports = router;
