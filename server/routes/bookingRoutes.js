const express = require("express");
const router = express.Router();

const { createBooking, getUserBookings } = require("../controllers/bookingControllers");
const { protect } = require("../middlewares/authMiddleware");

// 🎟️ Create a booking (Only logged-in users)
router.post("/book", protect,createBooking);

// ✅ Get user's bookings
router.get("/my-bookings", protect, getUserBookings);

module.exports = router;