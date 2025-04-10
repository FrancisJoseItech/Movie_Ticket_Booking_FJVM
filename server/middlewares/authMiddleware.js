const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

// 🛡️ Middleware to protect routes - allows only logged-in users
const protect = async (req, res, next) => {
    try {
      // 🔍 Step 1: Extract the Authorization header
      const authHeader = req.headers.authorization;
  
      // ❌ Step 2: If no token or format is wrong, block access
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Not authorized. No token provided." });
      }
  
      // 🔐 Step 3: Extract token from header string "Bearer <token>"
      const token = authHeader.split(" ")[1];
      console.log("🔐 Received Bearer Token:", token);
  
      // 🧾 Step 4: Verify token with your JWT secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("📨 Decoded Token:", decoded); // { userId, role, iat, exp }
  
      // 👤 Step 5: Fetch user from DB (optional: omit password)
      req.user = await User.findById(decoded.userId).select("-password");
      console.log("👤 Authenticated User:", req.user);
  
      // ✅ Step 6: Pass control to the next middleware or controller
      next();
  
    } catch (err) {
      // ❌ Step 7: Catch and handle any token validation or DB errors
      console.error("❌ Error in protect middleware:", err.message);
      return res.status(401).json({ message: "Not authorized. Token verification failed." });
    }
  };

// 🔐 Middleware to allow access to specific roles (admin, theater_owner, etc.)
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied. Insufficient role." });
    }
    next(); //  User has the correct role
  };
};

module.exports = { protect, authorizeRoles };