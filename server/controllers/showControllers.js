const Show = require("../model/showModel"); 
const Theater = require("../model/theaterModel");

// @desc    Add a new show (Admin or Theater Owner)
// @route   POST /api/shows/addshow
// @access  Admin or Theater Owner
const addShow = async (req, res) => {
    const { movieId, theaterId, date, time, price } = req.body;
  
    console.log("🎬 Add Show Request:", req.body);
    console.log("👤 Requested by:", req.user.role, req.user._id);
  
    // 🚫 Validate input
    if (!movieId || !theaterId || !date || !time || !price) {
      return res.status(400).json({
        message: "All fields (movieId, theaterId, date, time, price) are required.",
      });
    }
  
    try {
      // 🔐 If theater_owner, check if the theaterId belongs to them
      if (req.user.role === "theater_owner") {
        const theater = await Theater.findOne({
          _id: theaterId, // the theater they're trying to add a show to
          owner: req.user._id,  // must belong to the logged-in theater owner
        });
  
        if (!theater) {
          console.warn("⛔ Unauthorized: Theater doesn't belong to this owner");
          return res.status(403).json({ message: "You can only add shows for your own theaters." });
        }
      }
  
      // ⚠️ Check for existing duplicate show (same movie, theater, date, time)
      const existingShow = await Show.findOne({ movieId, theaterId, date, time });
      if (existingShow) {
        return res.status(400).json({
          message: "A show already exists for the same movie, theater, date, and time.",
        });
      }
  
      // ✅ Create and save new show
      const newShow = new Show({
        movieId,
        theaterId,
        date,
        time,
        price,
        bookedSeats: [],
      });
  
      const savedShow = await newShow.save();
  
      console.log("✅ Show added successfully:", savedShow);
  
      res.status(201).json({
        message: "Show added successfully",
        show: savedShow,
      });
  
    } catch (err) {
      console.error("❌ Error while adding show:", err.message);
      res.status(500).json({ message: "Server error while adding show" });
    }
  };

// @desc    Get all shows (Admin only)
// @route   GET /api/shows
// @access  Admin only
const getAllShows = async (req, res) => {
    try {
      // ✅ Fetch all shows, populate movie & theater details
      const shows = await Show.find()
        .populate("movieId", "title genre duration language") // populate movie details
        .populate("theaterId", "name location"); // populate theater details
  
      console.log("📽️ Retrieved All Shows:", shows.length);
  
      res.status(200).json(shows);
    } catch (err) {
      console.error("❌ Error fetching shows:", err.message);
      res.status(500).json({ message: "Server error while fetching shows" });
    }
  };


  // 📽️ Get all public shows (for users to browse)
const getPublicShows = async (req, res) => {
    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  
      // 🌐 Fetch future shows and populate movie and theater details
      const shows = await Show.find({ date: { $gte: today } })
        .populate("movieId", "title genre duration language posterUrl")
        .populate("theaterId", "name location");
  
      console.log("🎟️ Public Shows Fetched:", shows.length);
      res.status(200).json(shows);
    } catch (err) {
      console.error("❌ Error in getPublicShows:", err.message);
      res.status(500).json({ message: "Server error while fetching shows" });
    }
  };

module.exports = {
     addShow,
     getAllShows,
     getPublicShows

};
