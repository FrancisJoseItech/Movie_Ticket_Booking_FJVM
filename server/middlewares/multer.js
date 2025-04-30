// 📁 src/middleware/upload.js
const multer = require("multer");
const path = require("path");

// 📦 Load file system module only if needed
const fs = require("fs");

// 📁 Local uploads folder path (only used in development)
const uploadDir = path.join(__dirname, "../uploads");

// ✅ Ensure uploads folder exists only in development
if (process.env.NODE_ENV === "development") {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
    console.log("📂 Created 'uploads' folder at:", uploadDir);
  } else {
    console.log("📁 'uploads' folder already exists.");
  }
}

// 💾 1. Disk storage for development
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("📥 Saving file to local folder:", uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    console.log("🧾 Generated filename:", uniqueName);
    cb(null, uniqueName);
  },
});

// 🧠 2. Memory storage for Vercel (no disk writes allowed)
const memoryStorage = multer.memoryStorage();

// 🔀 3. Choose storage dynamically
const selectedStorage = process.env.NODE_ENV === "production" ? memoryStorage : diskStorage;

// 🛡️ 4. Accept only images
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/jpg"];
  if (allowed.includes(file.mimetype)) {
    console.log("✅ Valid image type:", file.mimetype);
    cb(null, true);
  } else {
    console.warn("❌ Invalid image type:", file.mimetype);
    cb(new Error("Only JPG, JPEG, PNG files are allowed."), false);
  }
};

// 🚀 5. Final multer export
const upload = multer({
  storage: selectedStorage,
  fileFilter,
});

module.exports = upload;
