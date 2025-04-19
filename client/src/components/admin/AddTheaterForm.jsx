import React, { useState } from "react";
import { toast } from "sonner";

// ✅ API call to add a new theater
import { addTheater } from "../../services/adminServices";

// 🧠 Redux hook to get the logged-in user
import { useSelector } from "react-redux";

// 🧩 Component to add a theater (used by both admin and theater_owner)
const AddTheaterForm = ({ onClose, onTheaterAdded, theaterOwners }) => {
  // 🎯 Local form state
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    totalSeats: "",
    owner: "", // Admin will select this from dropdown
  });

  // 🔐 Logged-in user info (used to determine role)
  const { user } = useSelector((state) => state.auth);

  // 🔁 Handle field change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🚀 Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault(); // Stop page reload
    console.log("🏢 Submitting theater:", formData); // Debug

    try {
      await addTheater(formData); // 📡 Call backend
      toast.success("🎉 Theater added successfully!");

      onTheaterAdded(); // 🔄 Tell parent to refresh theater list
      onClose();        // 🔐 Close form
    } catch (err) {
      console.error("❌ Failed to add theater:", err.message);
      toast.error("Failed to add theater.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-base-200 p-4 rounded shadow space-y-4 w-full max-w-2xl"
    >
      <h2 className="text-xl font-semibold">🏢 Add New Theater</h2>

      {/* 🎭 Theater Name */}
      <input
        type="text"
        name="name"
        placeholder="Theater Name"
        className="input input-bordered w-full"
        value={formData.name}
        onChange={handleChange}
        required
      />

      {/* 📍 Location */}
      <input
        type="text"
        name="location"
        placeholder="Location"
        className="input input-bordered w-full"
        value={formData.location}
        onChange={handleChange}
        required
      />

      {/* 💺 Seats */}
      <input
        type="number"
        name="totalSeats"
        placeholder="Total Seats"
        className="input input-bordered w-full"
        value={formData.totalSeats}
        onChange={handleChange}
        required
      />

      {/* 👑 Owner Dropdown – Shown ONLY to Admins */}
      {user?.role === "admin" && (
        <select
          name="owner"
          className="select select-bordered w-full"
          value={formData.owner}
          onChange={handleChange}
          required
        >
          <option value="">Select Theater Owner</option>
          {theaterOwners?.map((o) => (
            <option key={o._id} value={o._id}>
              {o.name} ({o.email})
            </option>
          ))}
        </select>
      )}

      {/* ✅ Buttons */}
      <div className="flex gap-4">
        <button type="submit" className="btn btn-primary w-full">
          Add Theater
        </button>
        <button type="button" className="btn btn-ghost w-full" onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddTheaterForm;
