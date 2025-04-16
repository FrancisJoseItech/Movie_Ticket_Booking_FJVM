// 📁 Multer Middleware for Handling File Uploads
// 📦 Dependencies
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 📁 Step 1: Ensure 'uploads' directory exists
const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("📂 'uploads' folder created at:", uploadDir);
} else {
  console.log("📁 'uploads' folder already exists.");
}

// 💾 Step 2: Configure Multer storage
const storage = multer.diskStorage({
  // 📍 Set destination folder
  destination: (req, file, cb) => {
    console.log("📥 Saving uploaded file to:", uploadDir);
    cb(null, uploadDir);
  },
  // 📛 Set unique filename
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname); // e.g. '.jpg'
    const generatedName = file.fieldname + "-" + uniqueSuffix + ext;
    console.log("🧾 Generated filename:", generatedName);
    cb(null, generatedName);
  },
});

// 🛡️ Step 3: Filter file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    console.log("✅ Valid file type:", file.mimetype);
    cb(null, true);
  } else {
    console.warn("❌ Invalid file type:", file.mimetype);
    cb(new Error("Only image files (jpeg, jpg, png) are allowed."), false);
  }
};

// 🚀 Step 4: Create Multer instance with config
const upload = multer({ storage, fileFilter });

// 📤 Export the middleware to use in routes
module.exports = upload;
