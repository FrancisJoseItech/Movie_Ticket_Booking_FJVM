import React, { useState } from "react";
import { toast } from "sonner";
import { addMovieWithPoster } from "../../services/adminServices"; // 🧩 Create this service function

const AddMovieForm = ({ onMovieAdded }) => {
  // 🧠 Local state for form fields
  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    duration: "",
    language: "",
    description: "",
  });

  const [poster, setPoster] = useState(null); // 🖼️ Poster file

  // 🛠️ Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 📤 Handle file upload
  const handleFileChange = (e) => {
    setPoster(e.target.files[0]);
  };

  // 🚀 Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("📦 Submitting form data:", formData);
      const res = await addMovieWithPoster(formData, poster);
      console.log("✅ Movie added:", res.data);

      toast.success("🎉 Movie added successfully!");
      setFormData({ title: "", genre: "", duration: "", language: "", description: "" });
      setPoster(null);

      // 🔄 Call parent update function
      onMovieAdded();
    } catch (err) {
      console.error("❌ Failed to add movie:", err.message);
      toast.error("Failed to add movie.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-base-200 p-4 rounded shadow space-y-4 w-full max-w-2xl">
      <h2 className="text-xl font-semibold">🎬 Add New Movie</h2>

      {/* 🔤 Title */}
      <input
        type="text"
        name="title"
        placeholder="Movie Title"
        className="input input-bordered w-full"
        value={formData.title}
        onChange={handleChange}
        required
      />

      {/* 🎭 Genre */}
      <input
        type="text"
        name="genre"
        placeholder="Genre"
        className="input input-bordered w-full"
        value={formData.genre}
        onChange={handleChange}
        required
      />

      {/* 🕐 Duration */}
      <input
        type="text"
        name="duration"
        placeholder="Duration (e.g. 2h 15m)"
        className="input input-bordered w-full"
        value={formData.duration}
        onChange={handleChange}
        required
      />

      {/* 🌐 Language */}
      <input
        type="text"
        name="language"
        placeholder="Language (e.g. English, Malayalam)"
        className="input input-bordered w-full"
        value={formData.language}
        onChange={handleChange}
        required
      />

      {/* 📝 Description */}
      <textarea
        name="description"
        placeholder="Description"
        className="textarea textarea-bordered w-full"
        value={formData.description}
        onChange={handleChange}
        required
      ></textarea>

      {/* 🖼️ Poster File Upload */}
      <input
        type="file"
        accept="image/*"
        className="file-input file-input-bordered w-full"
        onChange={handleFileChange}
        required
      />

      <button type="submit" className="btn btn-primary w-full">Add Movie</button>
    </form>
  );
};

export default AddMovieForm;
