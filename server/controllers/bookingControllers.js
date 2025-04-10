const Booking = require("../model/bookingModel");
const Show = require("../model/showModel");

// 🎯 Create Booking (Logged-in users only)
const createBooking = async (req, res) => {
  const { showId, seats } = req.body;
  const userId = req.user._id; // Comes from protect middleware

  console.log("🎟️ Booking request received:", { showId, seats, userId });

  // 🛑 Basic validation
  if (!showId || !seats || !Array.isArray(seats) || seats.length === 0) {
    console.warn("⚠️ Invalid booking request data");
    return res.status(400).json({ message: "Show ID and at least one seat are required." });
  }

  try {
    // 🔍 Fetch the show
    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ message: "Show not found." });
    }

    // 🚫 Check for overlapping seats
    const alreadyBooked = seats.some(seat => show.bookedSeats.includes(seat)); //bookedSeats is a field stored in MongoDB and part of each Show document.
    if (alreadyBooked) {
      return res.status(409).json({ message: "One or more selected seats are already booked." });
    }

    // 💰 Calculate total price (seats × show price)
    const totalPrice = seats.length * show.price;

    // 💾 Create booking
    const booking = new Booking({
      user: userId,
      show: showId,
      seats,
      totalPrice,
      paymentStatus: "paid" // For now we assume payment is done
    });

    await booking.save();

    // 📝 Update show with newly booked seats
    show.bookedSeats.push(...seats);
    await show.save();

    console.log("✅ Booking successful:", booking._id);

    res.status(201).json({
      message: "Booking successful!",
      booking,
    });

  } catch (err) {
    console.error("❌ Error in createBooking:", err.message);
    res.status(500).json({ message: "Server error during booking." });
  }
};

module.exports = {
  createBooking,
};
