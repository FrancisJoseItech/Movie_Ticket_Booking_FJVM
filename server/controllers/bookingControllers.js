// 📦 Required models
const Booking = require("../model/bookingModel");
const Show = require("../model/showModel");

// 🎯 Controller: Create or update a booking for logged-in users
const createBooking = async (req, res) => {
  const { showId, seats } = req.body;
  const userId = req.user._id; // 🛡️ Comes from protect middleware after auth

  console.log("🎟️ Booking request received:", { showId, seats, userId });

  // 🧪 Basic input validation
  if (!showId || !Array.isArray(seats) || seats.length === 0) {
    console.warn("⚠️ Invalid booking data. Show ID and at least one seat are required.");
    return res.status(400).json({ message: "Show ID and at least one seat are required." });
  }

  try {
    // 🔍 Fetch the show
    const show = await Show.findById(showId);
    if (!show) {
      console.warn("🚫 Show not found with ID:", showId);
      return res.status(404).json({ message: "Show not found." });
    }

    // 🔒 Check if any of the seats are already booked
    const alreadyBooked = seats.some(seat => show.bookedSeats.includes(seat));
    if (alreadyBooked) {
      console.warn("🚫 One or more seats are already booked:", seats);
      return res.status(409).json({ message: "Some seats are already booked." });
    }

    // 🔁 Check if user has an existing booking for this show
    let existingBooking = await Booking.findOne({ user: userId, show: showId });

    if (existingBooking) {
      console.log("🔁 Existing booking found. Adding new seats...");

      // ✨ Merge existing seats with new seats (removes duplicates automatically)
      const mergedSeats = [...new Set([...existingBooking.seats, ...seats])];
      const addedCount = mergedSeats.length - existingBooking.seats.length;

      // 💰 Recalculate price and update seats
      existingBooking.seats = mergedSeats;
      existingBooking.totalPrice = mergedSeats.length * show.price;

      // 💾 Save updated booking
      await existingBooking.save();

      // 🧾 Update bookedSeats in the Show
      show.bookedSeats.push(...seats);
      await show.save();

      console.log(`✅ Booking updated: ${existingBooking._id}, new seats added: ${addedCount}`);
      return res.status(200).json({
        message: `Booking updated with ${addedCount} new seat(s).`,
        booking: existingBooking
      });
    }

    // 🆕 No existing booking — create a fresh one
    const newBooking = new Booking({
      user: userId,
      show: showId,
      seats,
      totalPrice: seats.length * show.price,
      paymentStatus: "paid", // ✅ Assume paid for now
    });

    await newBooking.save();

    // 📌 Update the show with new booked seats
    show.bookedSeats.push(...seats);
    await show.save();

    console.log("✅ New booking created:", newBooking._id);
    return res.status(201).json({
      message: "Booking successful!",
      booking: newBooking
    });

  } catch (err) {
    console.error("❌ Booking process failed:", err.message);
    return res.status(500).json({ message: "Server error during booking." });
  }
};

/// ✅ Controller to fetch all bookings for the logged-in user
const getUserBookings = async (req, res) => {
  try {
    console.log("📡 Fetching bookings for user ID:", req.user._id);

    // 🔍 Fetch bookings for the current user and deeply populate the show details
    const bookings = await Booking.find({ user: req.user._id })
      .populate({
        path: "show",
        populate: [
          {
            path: "movieId",
            select: "title posterUrl", // 🎬 Include movie title and poster image
          },
          {
            path: "theaterId",
            select: "name location", // 🏢 Include theater name and location
          },
        ],
      });

    console.log(`✅ Found ${bookings.length} booking(s) for the user`);

    // 🔎 Debug output for each booking
    bookings.forEach((booking, i) => {
      console.log(`📄 Booking ${i + 1}:`);
      console.log("    🎬 Movie:", booking.show?.movieId?.title);
      console.log("    🏢 Theater:", booking.show?.theaterId?.name);
      console.log("    📆 Date:", booking.show?.date);
      console.log("    ⏰ Time:", booking.show?.time);
      console.log("    🎟️ Seats:", booking.seats.join(", "));
    });

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
