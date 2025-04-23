const mongoose = require("mongoose");

// 🎬 Movie schema definition
const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true, // 🛑 Prevent duplicate movie titles
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
      required: false, // 🖼️ Optional poster
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // 🕒 Adds createdAt and updatedAt fields
    toObject: { virtuals: true }, // ✅ Include virtuals in object outputs
    toJSON: { virtuals: true },   // ✅ Include virtuals in JSON responses
  }
);

// 🔁 Virtual field: `shows` to link this movie to all its shows
// 📌 This does not store data but lets us populate all shows per movie
movieSchema.virtual("shows", {
  ref: "Show",              // 🔗 Reference to the Show model
  localField: "_id",        // 🧷 Movie's ID
  foreignField: "movieId",  // 🎯 In Show model, 'movieId' should match
});

// ✅ Log when model is loaded (for dev)
console.log("🎬 Movie model loaded with virtual 'shows'");

module.exports = mongoose.model("Movie", movieSchema);
