// 📁 Utility to upload a file to Cloudinary
const cloudinary = require("../config/cloudinaryConfig");

const uploadToCloudinary = (filePath) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      { folder: "movie_posters" },
      (error, result) => {
        if (error) {
          console.error("❌ Cloudinary Upload Failed:", error);
          return reject(error);
        }

        console.log("✅ Cloudinary Upload Success:", result.secure_url);
        return resolve(result.secure_url); // ✅ This must be returned!
      }
    );
  });
};

module.exports = uploadToCloudinary; // ✅ Must be default export
