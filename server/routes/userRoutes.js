// Route definitions for user operations

const express = require('express');
const router = express.Router();

// Import controller function
const { registerUser, loginUser, getUserProfile, logoutUser, getAllUsers,  } = require('../controllers/userControllers');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

// Define POST route for registration
router.post('/register', registerUser);
router.post('/login', loginUser); // Login route
router.get("/profile", protect, getUserProfile); //userProfile route
router.post("/logout", logoutUser ); //logout
router.get("/allusers", protect, authorizeRoles("admin"), getAllUsers); //getallusers


// Export the router
module.exports = router;