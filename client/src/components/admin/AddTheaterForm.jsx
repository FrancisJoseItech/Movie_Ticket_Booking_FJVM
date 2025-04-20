import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useSelector } from "react-redux";

// ✅ Import API functions
import { addTheater, updateTheater } from "../../services/adminServices";

/**
 * 🎭 Reusable Form for Adding and Editing Theaters
 * Props:
 * - onClose: function to close/hide the form
 * - onTheaterAdded: callback to refresh the parent theater list
 * - theaterOwners: list of users with role 'theater_owner' (for admin dropdown)
 * - selectedTheater (optional): if passed, switches to Edit mode
 */
const AddTheaterForm = ({ onClose, onTheaterAdded, theaterOwners, selectedTheater }) => {
  // 📦 Form state
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    totalSeats: "",
    owner: "", // admin will select from dropdown
  });

  // 🔐 Get logged-in user info from Redux
  const { user } = useSelector((state) => state.auth);

  // ✏️ If editing, prefill form with selectedTheater data
  useEffect(() => {
    if (selectedTheater) {
      console.log("✏️ Pre-filling edit form with:", selectedTheater);
      setFormData({
        name: selectedTheater.name || "",
        location: selectedTheater.location || "",
        totalSeats: selectedTheater.totalSeats || "",
        owner: selectedTheater.owner || "",
      });
    }
  }, [selectedTheater]);

  // 🔁 Handle changes in input fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🚀 Form Submit Handler (Handles Both Add and Update)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    console.log("📤 Submitting form data:", formData);

    try {
      if (selectedTheater) {
        // ✏️ Edit Mode
        console.log("🔄 Updating theater ID:", selectedTheater._id);
        await updateTheater(selectedTheater._id, formData);
        toast.success("✅ Theater updated successfully!");
      } else {
        // ➕ Add Mode
        console.log("➕ Creating new theater...");
        await addTheater(formData);
        toast.success("✅ Theater added successfully!");
      }

      onTheaterAdded(); // 🔁 Refresh the parent component list
      onClose();        // 🔐 Close the form
    } catch (err) {
      console.error("❌ Error submitting theater:", err.message);
      toast.error("Failed to save theater. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-base-200 p-4 rounded shadow space-y-4 w-full max-w-2xl"
    >
      <h2 className="text-xl font-semibold">
        {selectedTheater ? "✏️ Edit Theater" : "🏢 Add New Theater"}
      </h2>

      {/* 🎭 Theater Name Input */}
      <input
        type="text"
        name="name"
        placeholder="Theater Name"
        className="input input-bordered w-full"
        value={formData.name}
        onChange={handleChange}
        required
      />

      {/* 🗺️ Location Input */}
      <input
        type="text"
        name="location"
        placeholder="Location"
        className="input input-bordered w-full"
        value={formData.location}
        onChange={handleChange}
        required
      />

      {/* 💺 Total Seats */}
      <input
        type="number"
        name="totalSeats"
        placeholder="Total Seats"
        className="input input-bordered w-full"
        value={formData.totalSeats}
        onChange={handleChange}
        required
      />

      {/* 👤 Theater Owner Dropdown - Visible only to Admin */}
      {user?.role === "admin" && (
        <select
          name="owner"
          className="select select-bordered w-full"
          value={formData.owner}
          onChange={handleChange}
          required
        >
          <option value="">Select Theater Owner</option>
          {theaterOwners?.map((owner) => (
            <option key={owner._id} value={owner._id}>
              {owner.name} ({owner.email})
            </option>
          ))}
        </select>
      )}

      {/* 🔘 Submit + Cancel */}
      <div className="flex gap-4">
        <button type="submit" className="btn btn-primary w-full">
          {selectedTheater ? "Update Theater" : "Add Theater"}
        </button>
        <button
          type="button"
          className="btn btn-ghost w-full"
          onClick={() => {
            console.log("🔒 Cancel clicked – Closing form.");
            onClose();
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddTheaterForm;
