import React, { useState } from "react";
import { addShow } from "../../services/adminServices"; // 📡 API call to add show
import { toast } from "sonner"; // 🔔 Notification system

// 🎭 Form component to add a new show (used by Admin)
const AddShowForm = ({ movies, theaters, onClose, onShowAdded }) => {
  // 🧠 Local form state to hold input values
  const [formData, setFormData] = useState({
    movieId: "",
    theaterId: "",
    date: "",
    time: "",
    price: "", // 💰 Individual ticket price (required by backend)
  });

  // 🔄 Handles form input changes for all fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🚀 Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    console.log("🎬 Submitting new show:", formData); // 📦 Debug log

    try {
      await addShow(formData); // 📡 API call to backend
      toast.success("✅ Show added successfully!");

      onShowAdded(); // 🔁 Prop: Inform parent to refresh the list
      onClose();     // 🔐 Prop: Close the form
    } catch (error) {
      console.error("❌ Failed to add show:", error.message);
      toast.error("Failed to add show. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-base-200 p-4 rounded shadow space-y-4 w-full max-w-2xl">
      <h2 className="text-xl font-semibold">🎭 Add New Show</h2>

      {/* 🎬 Movie Dropdown */}
      <select
        name="movieId"
        value={formData.movieId}
        onChange={handleChange}
        className="select select-bordered w-full"
        required
      >
        <option value="">🎬 Select a Movie</option>
        {movies.map((movie) => (
          <option key={movie._id} value={movie._id}>
            {movie.title}
          </option>
        ))}
      </select>

      {/* 🏢 Theater Dropdown */}
      <select
        name="theaterId"
        value={formData.theaterId}
        onChange={handleChange}
        className="select select-bordered w-full"
        required
      >
        <option value="">🏢 Select a Theater</option>
        {theaters.map((theater) => (
          <option key={theater._id} value={theater._id}>
            {theater.name} - {theater.location}
          </option>
        ))}
      </select>

      {/* 📅 Show Date */}
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        className="input input-bordered w-full"
        required
      />

      {/* 🕒 Show Time */}
      <input
        type="time"
        name="time"
        value={formData.time}
        onChange={handleChange}
        className="input input-bordered w-full"
        required
      />

      {/* 💰 Price per Seat */}
      <input
        type="number"
        name="price"
        value={formData.price}
        onChange={handleChange}
        placeholder="💰 Price per ticket (e.g. 250)"
        className="input input-bordered w-full"
        required
      />

      {/* 🎯 Action Buttons */}
      <div className="flex gap-4">
        <button type="submit" className="btn btn-primary w-full">
          ➕ Add Show
        </button>
        <button type="button" className="btn btn-ghost w-full" onClick={onClose}>
          ❌ Cancel
        </button>
      </div>
    </form>
  );
};

export default AddShowForm;
