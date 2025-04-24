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
        .populate("theaterId", "name location totalSeats"); // populate theater details
  
      console.log("📽️ Retrieved All Shows:", shows.length);
  
      res.status(200).json(shows);
    } catch (err) {
      console.error("❌ Error fetching shows:", err.message);
      res.status(500).json({ message: "Server error while fetching shows" });
    }
  };


 // 🎯 Controller: Get all upcoming public shows
const getPublicShows = async (req, res) => {
  try {
    const now = new Date();

    // ⏳ Only include shows that are scheduled for a future date
    const shows = await Show.find({ date: { $gt: now } })
      .populate("movieId", "title posterUrl genre duration language")
      .populate("theaterId", "name location totalSeats");

    console.log("🎟️ Public Shows Fetched:", shows.length);
    res.status(200).json(shows);
  } catch (err) {
    console.error("❌ Error fetching public shows:", err.message);
    res.status(500).json({ message: "Server error while fetching shows" });
  }
};

  // delete shows 
  const deleteShow = async (req, res) => {
    try {
      const deleted = await Show.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: "Show not found" });
  
      res.status(200).json({ message: "Show deleted successfully" });
    } catch (err) {
      console.error("❌ Error deleting show:", err.message);
      res.status(500).json({ message: "Server error" });
    }
  };

// ✅ Controller to fetch a single show by ID with full movie and theater info
const getShowById = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate("movieId", "title posterUrl genre duration language") // ✅ Get full movie object
      .populate("theaterId", "name location totalSeats");             // ✅ Get full theater info

    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }

    console.log("🎯 Single Show Fetched:", show.movieId?.title);
    res.status(200).json(show);
  } catch (err) {
    console.error("❌ Error fetching show by ID:", err.message);
    res.status(500).json({ message: "Error fetching show by ID" });
  }
};



// 🎯 Get shows for theaters owned by a specific theater owner
const getShowsForOwner = async (req, res) => {
  try {
    const shows = await Show.find({ theaterId: { $in: req.user.theatersOwned } })
      .populate("movieId", "title posterUrl")
      .populate("theaterId", "name location");

    console.log("🎟️ Fetched shows for owner:", req.user._id);
    res.status(200).json(shows);
  } catch (err) {
    console.error("❌ Error fetching owner's shows:", err.message);
    res.status(500).json({ message: "Server error while fetching shows" });
  }
};

module.exports = { getShowsForOwner };
  

module.exports = {
     addShow,
     getAllShows,
     getPublicShows,
     deleteShow,
     getShowById,
     getShowsForOwner,

};
