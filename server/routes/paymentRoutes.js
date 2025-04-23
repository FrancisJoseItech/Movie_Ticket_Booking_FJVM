const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { createCheckoutSession } = require("../controllers/paymentController");

router.post("/create-checkout-session", protect, createCheckoutSession);

module.exports = router;
