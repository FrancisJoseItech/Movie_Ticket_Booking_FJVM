// 📦 Required models
const Booking = require("../model/bookingModel");
const Show = require("../model/showModel");

// 🎯 Create Booking (Logged-in users only)
const createBooking = async (req, res) => {
  const { showId, seats } = req.body;
  const userId = req.user._id; // 🛡️ From protect middleware

  // 📥 Log the incoming booking request
  console.log("🎟️ Booking request received:", { showId, seats, userId });

  // 🛑 Basic validation
  if (!showId || !Array.isArray(seats) || seats.length === 0) {
    console.warn("⚠️ Invalid booking data. Show ID and at least one seat required.");
    return res.status(400).json({ message: "Show ID and at least one seat are required." });
  }

  try {
    // 🔍 Fetch the show to validate and update seat info
    const show = await Show.findById(showId);
    if (!show) {
      console.warn("🚫 Show not found with ID:", showId);
      return res.status(404).json({ message: "Show not found." });
    }

    // 🔐 Check if any selected seats are already booked
    const alreadyBooked = seats.some(seat => show.bookedSeats.includes(seat));
    if (alreadyBooked) {
      console.warn("🚫 Some seats already booked:", seats);
      return res.status(409).json({ message: "One or more selected seats are already booked." });
    }

    // 🔁 Check if the user already has a booking for this show
    let existingBooking = await Booking.findOne({
      user: userId,
      show: showId,
    });

    if (existingBooking) {
      console.log("🔁 Existing booking found. Merging new seats...");

      // 📌 Merge new seats with existing ones, remove duplicates
      const updatedSeats = [...new Set([...existingBooking.seats, ...seats])];
      const addedSeatCount = updatedSeats.length - existingBooking.seats.length;

      // 💰 Recalculate price based on updated seats
      existingBooking.seats = updatedSeats;
      existingBooking.totalPrice = updatedSeats.length * show.price;

      // 💾 Save updated booking
      await existingBooking.save();

      // 📝 Add newly booked seats to the show's record
      show.bookedSeats.push(...seats);
      await show.save();

      // ✅ Success response
      console.log(`✅ Updated booking (${existingBooking._id}) with ${addedSeatCount} new seat(s).`);
      return res.status(200).json({
        message: `Booking updated with ${addedSeatCount} new seat(s).`,
        booking: existingBooking,
      });
    }

    // 🆕 No prior booking → create new one
    const newBooking = new Booking({
      user: userId,
      show: showId,
      seats,
      totalPrice: seats.length * show.price,
      paymentStatus: "paid", // Assume payment is successful for now
    });

    await newBooking.save();

    // 🧾 Update show’s bookedSeats list
    show.bookedSeats.push(...seats);
    await show.save();

    // ✅ New booking success
    console.log("✅ New booking created:", newBooking._id);
    return res.status(201).json({
      message: "Booking successful!",
      booking: newBooking,
    });

  } catch (err) {
    console.error("❌ Error during booking process:", err.message);
    return res.status(500).json({ message: "Server error during booking." });
  }
};

//// ✅ Controller to fetch all bookings for the logged-in user
const getUserBookings = async (req, res) => {
  try {
    console.log("📡 Fetching bookings for user ID:", req.user._id);

    const bookings = await Booking.find({ user: req.user._id }).populate({
      path: "show",
      populate: [
        { path: "movieId", select: "title" },     // Populate movie title
        { path: "theaterId", select: "name" },    // Populate theater name
      ],
    });

    console.log(`✅ Found ${bookings.length} booking(s) for the user`);
    res.status(200).json(bookings);
  } catch (err) {
    console.error("❌ Error fetching user bookings:", err.message);
    res.status(500).json({ message: "Error fetching bookings" });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
};
