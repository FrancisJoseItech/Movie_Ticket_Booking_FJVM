// Main entry point of the backend

// Import required modules
const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require("cookie-parser");
const cors = require('cors');

// Import custom files
const connectDB = require('./config/dbConnection');
const userRoutes = require('./routes/userRoutes');
const showRoutes = require("./routes/showRoutes");
const movieRoutes = require("./routes/movieRoutes");
const theaterRoutes = require("./routes/theaterRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

// Load environment variables from .env
dotenv.config();

// Connect to MongoDB database
connectDB();

// Initialize Express app
const app = express();

//This enables reading cookies from request
app.use(cookieParser()); 

// Enable Cross-Origin Resource Sharing (for frontend access)

app.use(cors({
  origin: "http://localhost:5173",  // frontend port
  credentials: true                // allow cookies/auth headers
}));

// Enable JSON parsing for incoming requests
app.use(express.json());

// Route middleware - handles all routes starting with /api/user
app.use('/api/user', userRoutes);
// Route middleware - handles all routes starting with /api/shows
app.use("/api/shows", showRoutes);
// Route middleware - handles all routes starting with /api/movies
app.use("/api/movies", movieRoutes);
// Route middleware - handles all routes starting with /api/theaters
app.use("/api/theaters", theaterRoutes);
// Route middleware - handles all routes starting with /api/bookings
app.use("/api/bookings",bookingRoutes);
// Route middleware - handles all routes starting with /api/payment
app.use("/api/payment", paymentRoutes);

// Start the server on PORT defined in .env
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
