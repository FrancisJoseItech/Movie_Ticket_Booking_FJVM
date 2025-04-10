const express = require("express");
const router = express.Router();

const { createBooking } = require("../controllers/bookingControllers");
const { protect } = require("../middlewares/authMiddleware");

// 🎟️ Create a booking (Only logged-in users)
router.post("/book", protect,createBooking);

module.exports = router;