import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { addMovieWithPoster, updateMovieWithPoster } from "../../services/adminServices";

const AddMovieForm = ({ onClose, onMovieAdded, selectedMovie }) => {
  // 🧠 Local state for form fields
  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    duration: "",
    language: "",
    description: "",
  });

  const [poster, setPoster] = useState(null); // 🖼️ New poster file
  const isEditing = Boolean(selectedMovie);   // ✏️ Check if it's edit mode

  // 🧠 Pre-fill form if editing
  useEffect(() => {
    if (isEditing) {
      console.log("✏️ Edit Mode: Populating form with selected movie:", selectedMovie);
      setFormData({
        title: selectedMovie.title,
        genre: selectedMovie.genre,
        duration: selectedMovie.duration,
        language: selectedMovie.language,
        description: selectedMovie.description,
      });
    }
  }, [selectedMovie]);

  // 🔁 Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 📷 Handle poster file
  const handleFileChange = (e) => {
    setPoster(e.target.files[0]);
  };

  // ✅ Submit handler (Add or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        console.log("📤 Updating movie:", formData);
        await updateMovieWithPoster(selectedMovie._id, formData, poster);
        toast.success("✅ Movie updated successfully!");
      } else {
        console.log("📥 Adding new movie:", formData);
        await addMovieWithPoster(formData, poster);
        toast.success("🎉 Movie added successfully!");
      }

      // 🔁 Refresh parent component and close form
      onMovieAdded();
      onClose();
    } catch (err) {
      console.error("❌ Error submitting form:", err.message);
      toast.error("Something went wrong while saving the movie.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-base-200 p-4 rounded shadow space-y-4 w-full max-w-2xl">
      <h2 className="text-xl font-semibold">
        {isEditing ? "✏️ Edit Movie" : "🎬 Add New Movie"}
      </h2>

      <input
        type="text"
        name="title"
        placeholder="Movie Title"
        className="input input-bordered w-full"
        value={formData.title}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="genre"
        placeholder="Genre"
        className="input input-bordered w-full"
        value={formData.genre}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="duration"
        placeholder="Duration (e.g. 2h 15m)"
        className="input input-bordered w-full"
        value={formData.duration}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="language"
        placeholder="Language (e.g. English, Malayalam)"
        className="input input-bordered w-full"
        value={formData.language}
        onChange={handleChange}
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        className="textarea textarea-bordered w-full"
        value={formData.description}
        onChange={handleChange}
        required
      ></textarea>

      {/* 📂 Only required if adding new or replacing existing poster */}
      <input
        type="file"
        accept="image/*"
        className="file-input file-input-bordered w-full"
        onChange={handleFileChange}
        {...(!isEditing && { required: true })}
      />

      <div className="flex gap-4">
        <button type="submit" className="btn btn-primary w-full">
          {isEditing ? "Update Movie" : "Add Movie"}
        </button>
        <button type="button" className="btn btn-ghost w-full" onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddMovieForm;
