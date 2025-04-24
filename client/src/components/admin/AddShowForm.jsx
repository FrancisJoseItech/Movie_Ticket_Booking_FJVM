import React, { useState } from "react";
import { addShow } from "../../services/adminServices"; // 📡 API service to add a new show
import { toast } from "sonner"; // 🔔 Toast notifications

// 📦 Props:
// - movies: Array of all movies (used for dropdown)
// - theaters: Array of theaters (admin or theater_owner specific)
// - onClose: Function to close the form (sent by parent)
// - onShowAdded: Callback to inform parent after successful add
const AddShowForm = ({ movies, theaters, onClose, onShowAdded }) => {
  // 🧠 State to manage form inputs
  const [formData, setFormData] = useState({
    movieId: "",
    theaterId: "",
    date: "",
    time: "",
    price: "",
  });

  // 🔁 Generic change handler for all inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🚀 Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🎬 Submitting new show with data:", formData); // ✅ Log current form data

    try {
      await addShow(formData); // 📡 API call to backend to add show
      toast.success("✅ Show added successfully!");

      onShowAdded(); // 🔁 Inform parent to refresh show list (especially important for TheaterOwnerDashboard)
      onClose();     // ❌ Close form after success
    } catch (error) {
      console.error("❌ Failed to add show:", error.message);
      toast.error("Something went wrong while adding show.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-base-200 p-4 rounded shadow space-y-4 w-full max-w-2xl">
      <h2 className="text-xl font-semibold">🎭 Add New Show</h2>

      {/* 🎬 Select Movie (Dropdown) */}
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

      {/* 🏢 Select Theater (Dropdown) */}
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

      {/* 📅 Select Date */}
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        className="input input-bordered w-full"
        required
      />

      {/* ⏰ Select Time */}
      <input
        type="time"
        name="time"
        value={formData.time}
        onChange={handleChange}
        className="input input-bordered w-full"
        required
      />

      {/* 💰 Price per ticket */}
      <input
        type="number"
        name="price"
        value={formData.price}
        onChange={handleChange}
        placeholder="💰 Price (e.g. 250)"
        className="input input-bordered w-full"
        required
      />

      {/* 🚀 Submit / ❌ Cancel */}
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
