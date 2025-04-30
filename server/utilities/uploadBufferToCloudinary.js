// 📁 src/utilities/uploadBufferToCloudinary.js
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

// ✅ Configure Cloudinary (load from .env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 📤 Upload Buffer
const uploadBufferToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "fjvm-posters",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          console.error("❌ Buffer Upload Error:", error.message);
          reject(error);
        } else {
          console.log("🌐 Cloudinary Buffer Upload Success:", result.secure_url);
          resolve(result.secure_url);
        }
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

module.exports = uploadBufferToCloudinary;
