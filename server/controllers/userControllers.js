const User = require('../model/userModel');
const bcrypt = require('bcryptjs');
const generateToken = require('../utilities/generateToken');
const jwt = require("jsonwebtoken"); 

// @desc    Register a new user
// @route   POST /api/user/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;
  
    // ✅ Step 1: Log the incoming registration request
    console.log("📨 Register Request Received:", req.body);
  
    // ✅ Step 2: Validate required fields
    if (!name || !email || !password || !role) {
      console.log("⚠️ Missing required fields");
      return res.status(400).json({ message: "All fields (name, email, password, role) are required." });
    }
  
    try {
      // ✅ Step 3: Check if a user already exists with the same email
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log("⚠️ User already exists with email:", email);
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // ✅ Step 4: Hash the password using bcrypt
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // ✅ Step 5: Create a new user instance
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role, // can be 'user', 'admin', or 'theater_owner'
      });
  
      console.log("💾 Creating new user:", newUser);
  
      // ✅ Step 6: Save the user to the database
      await newUser.save();
      console.log("✅ User registered and saved successfully");
  
      // ✅ Step 7: Send success response
      res.status(201).json({ message: '✅ User registered successfully' });
  
    } catch (err) {
      // ❌ Handle any server/database errors
      console.error("❌ Registration error:", err.message);
      res.status(500).json({ message: 'Server error during registration' });
    }
  };

  // @desc    Login user
// @route   POST /api/user/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    // ✅ Step 1: Log incoming login request
    console.log("📩 Login Request:", req.body);
  
    // ✅ Step 2: Validate required fields
    if (!email || !password) {
      console.log("⚠️ Missing email or password");
      return res.status(400).json({ message: "Both email and password are required." });
    }
  
    try {
      // ✅ Step 3: Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        console.log("❌ Login failed - email not found:", email);
        return res.status(401).json({ message: "Invalid credentials (email)" });
      }
  
      // ✅ Step 4: Compare passwords using bcrypt
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log("❌ Login failed - incorrect password for:", email);
        return res.status(401).json({ message: "Invalid credentials (password)" });
      }
  
      // ✅ Step 5: Generate JWT token
      const token = generateToken(user._id, user.role);
      console.log("🔐 JWT Token Generated");
  
      // ✅ Step 6: Decode token to get expiry timestamp
      const decoded = jwt.decode(token);
      const expiresAt = new Date(decoded.exp * 1000); // Convert to readable date
  
  
    //   // ✅ Step 6: Set token in HTTP-only cookie
    //   res.cookie('token', token, {
    //     httpOnly: true,         // Cookie can't be accessed via JS
    //     secure: false,          // Should be true in production (HTTPS)
    //     sameSite: 'strict',     // Prevents CSRF
    //     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    //   });
  
    console.log("✅ Login successful:", user.email);

    // ✅ Step 7: Return token and user data in response (Bearer Token style)
    res.status(200).json({
      message: "Login successful",
      token,            // 🔐 Token to be used as Bearer
      expiresAt,        // 🕒 Token expiry time
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    console.error("💥 Login error:", err.message);
    res.status(500).json({ message: "Server error during login" });
  }
};

// GET /api/user/profile
const getUserProfile = async (req, res) => {
    try {
        console.log("🔎 Requested User Profile:", req.user);
      const user = req.user; // Comes from protect middleware
  
      res.status(200).json({
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } catch (err) {
        console.error("❌ Error in getUserProfile:", err.message);
      res.status(500).json({ message: "Server error while fetching profile." });
    }
  };


  // @desc    Logout user (clear cookie)
// @route   POST /api/user/logout
// @access  Public
const logoutUser = (req, res) => {
    res.clearCookie('token'); // remove the auth cookie
    console.log("🛑 User logged out.");
    res.status(200).json({ message: 'User logged out successfully' });
  };


  // @desc    Get all users (Admin only)
// @route   GET /api/user/allusers
// @access  Admin
const getAllUsers = async (req, res) => {
    try {
      console.log("🔍 Admin fetching all users...");
      const users = await User.find().select("-password"); // Exclude passwords
      res.status(200).json(users);
    } catch (err) {
      console.error("❌ Error fetching users:", err.message);
      res.status(500).json({ message: "Server error while fetching users" });
    }
  };

module.exports = {
  registerUser,  // Registeration
  loginUser,    // Login
  getUserProfile,    //userprofile 
  logoutUser,
  getAllUsers   
};

