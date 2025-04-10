const mongoose = require("mongoose");

// 🎬 Movie schema definition
const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true, // prevent duplicate movie titles
  },
  genre: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  posterUrl: {
    type: String,
    required: false, //optional
  },
  description: {
    type: String,
    required: true,
  },
}, {
  timestamps: true // createdAt and updatedAt
});

module.exports = mongoose.model("Movie", movieSchema);
