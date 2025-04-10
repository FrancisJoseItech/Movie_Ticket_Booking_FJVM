// server/model/theaterModel.js
const mongoose = require("mongoose");

// 🎭 Theater Schema
const theaterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  totalSeats: {
    type: Number,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  
}, {
  timestamps: true
});

module.exports = mongoose.model("Theater", theaterSchema);
