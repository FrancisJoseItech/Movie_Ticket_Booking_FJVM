// server/controllers/theaterControllers.js
const Theater = require("../model/theaterModel");
const User = require("../model/userModel");

// 🎯 Add Theater (Admin or Theater Owner)
const addTheater = async (req, res) => {
  const { name, location, totalSeats, owner } = req.body;

  console.log("🏢 Add Theater Request by:", req.user.role);
  console.log("📦 Request Body:", req.body);

  // 🛑 Validate mandatory fields
  if (!name || !location || !totalSeats) {
    console.warn("⚠️ Missing required fields in addTheater");
    return res.status(400).json({ message: "All fields (name, location, totalSeats) are required." });
  }

  try {
    // 🔐 Role-based access: Only admin or theater_owner
    if (!["admin", "theater_owner"].includes(req.user.role)) {
      console.warn("⛔ Unauthorized role trying to add theater:", req.user.role);
      return res.status(403).json({ message: "Access denied. Only admins or theater owners can add theaters." });
    }

    // 🔄 Determine the owner of the theater
    let ownerId;

    if (req.user.role === "admin") {
      // Admin can pass owner explicitly, fallback to self
      ownerId = owner || req.user._id;

      // 🛡️ Extra safety: Check if passed owner exists and is a theater_owner
      const targetUser = await User.findById(ownerId);
      if (!targetUser || targetUser.role !== "theater_owner") {
        console.warn("⚠️ Invalid owner ID passed by admin");
        return res.status(400).json({ message: "Invalid owner. Must be a valid theater_owner user." });
      }
    } else {
      // If theater_owner adds, use their own ID
      ownerId = req.user._id;
    }

    // 🔍 Check for existing theater with same name + location
    const existing = await Theater.findOne({ name, location });
    if (existing) {
      console.warn("⚠️ Duplicate theater found:", name, location);
      return res.status(400).json({ message: "Theater already exists at this location." });
    }

    // 🏗️ Create theater
    const newTheater = new Theater({ name, location, totalSeats, owner: ownerId });
    const saved = await newTheater.save();

    console.log("✅ Theater added successfully:", saved);

    // 🔄 OPTIONAL: Update theater_owner's theatersOwned array
if (req.user.role === "theater_owner") {
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { theatersOwned: saved._id } },
      { new: true }
    );
    console.log("📌 Theater ID pushed to user's theatersOwned array");
  }
  
  // 🟢 Send success response
  res.status(201).json({
    message: "Theater added successfully",
    theater: saved,
  });
  } catch (err) {
    console.error("❌ Error in addTheater:", err.message);
    res.status(500).json({ message: "Server error while adding theater" });
  }
};


// 🌐 Get All Theaters (Public)
const getAllTheaters = async (req, res) => {
  try {
    const theaters = await Theater.find();
    res.status(200).json(theaters);
  } catch (err) {
    console.error("❌ Error fetching theaters:", err.message);
    res.status(500).json({ message: "Server error while fetching theaters" });
  }
};


// 🔁 Update Theater by ID (Admin Only)
const updateTheater = async (req, res) => {
    const theaterId = req.params.id;
    const { name, location, totalSeats } = req.body;
  
    console.log("✏️ Update Request:", { theaterId, name, location, totalSeats });
  
    try {
      const theater = await Theater.findById(theaterId);
  
      if (!theater) {
        console.warn("⚠️ Theater not found for update");
        return res.status(404).json({ message: "Theater not found" });
      }
  
      // Update only the provided fields
      if (name) theater.name = name;
      if (location) theater.location = location;
      if (totalSeats) theater.totalSeats = totalSeats;
  
      const updatedTheater = await theater.save();
  
      console.log("✅ Theater updated:", updatedTheater);
      res.status(200).json({ message: "Theater updated successfully", theater: updatedTheater });
  
    } catch (err) {
      console.error("❌ Error updating theater:", err.message);
      res.status(500).json({ message: "Server error while updating theater" });
    }
  };


  // 🗑️ Delete Theater by ID (Admin Only)
const deleteTheater = async (req, res) => {
    const theaterId = req.params.id;
    console.log("🗑️ Delete Request for Theater ID:", theaterId);
  
    try {
      const deleted = await Theater.findByIdAndDelete(theaterId);
  
      if (!deleted) {
        console.warn("⚠️ Theater not found for deletion");
        return res.status(404).json({ message: "Theater not found" });
      }
  
      console.log("✅ Theater deleted:", deleted.name);
      res.status(200).json({ message: "Theater deleted successfully" });
  
    } catch (err) {
      console.error("❌ Error deleting theater:", err.message);
      res.status(500).json({ message: "Server error while deleting theater" });
    }
  };

  // 🔒 For Theater Owner - Get their own theaters
const getMyTheaters = async (req, res) => {
    try {
      const myTheaters = await Theater.find({ owner: req.user._id });
      console.log("🎭 Fetched theaters for owner:", req.user._id);
      res.status(200).json(myTheaters);
    } catch (err) {
      console.error("❌ Error fetching my theaters:", err.message);
      res.status(500).json({ message: "Server error while fetching your theaters" });
    }
  };
  
  // 🔍 For Admin - Get theaters of a specific owner
  const getTheatersByOwner = async (req, res) => {
    const ownerId = req.params.ownerId;
  
    try {
      const theaters = await Theater.find({ owner: ownerId });
      console.log("🧾 Fetched theaters for owner:", ownerId);
      res.status(200).json(theaters);
    } catch (err) {
      console.error("❌ Error fetching theaters by owner:", err.message);
      res.status(500).json({ message: "Server error while fetching theaters" });
    }
  };

module.exports = { 
    addTheater,
     getAllTheaters,
    updateTheater,
    deleteTheater,
    getMyTheaters,
    getTheatersByOwner
    };
