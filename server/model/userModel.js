// Schema/model for user collection

const mongoose = require('mongoose');

// Define schema structure
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true // No duplicate emails
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'theater_owner'], // Allowed roles
    default: 'user'
  },
  // Optional: Link theaters owned by this user (used for future dashboards)
theatersOwned: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Theater"
  }]
  
});

// Export model to use in controllers
module.exports = mongoose.model('User', userSchema);
