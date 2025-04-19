import React, { useState } from "react";
import { registerUser } from "../../services/userServices"; // ✅ API call to register user
import { toast } from "sonner";

// 🧩 Form component to register a new theater owner (only for admin use)
const RegisterTheaterOwnerForm = ({ onClose, onRegistered }) => {
  // 🧠 Form input states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // 🔁 Handle input field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🚀 Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("📝 Registering theater owner with:", formData);

    try {
      // 🔒 Explicitly setting role to 'theater_owner'
      const role = "theater_owner";

      // 📡 API call to backend
      const res = await registerUser({
        ...formData,
        role,
      });

      console.log("✅ Registered successfully:", res.data);

      toast.success("🎭 Theater owner registered!");
      onRegistered(); // 🔁 Notify parent to refresh if needed
      onClose(); // 🔐 Close form
    } catch (err) {
      console.error("❌ Registration failed:", err.message);
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-base-200 p-4 rounded shadow space-y-4 w-full max-w-2xl"
    >
      <h2 className="text-xl font-semibold">🎭 Register Theater Owner</h2>

      {/* 🧑 Name */}
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        className="input input-bordered w-full"
        value={formData.name}
        onChange={handleChange}
        required
      />

      {/* 📧 Email */}
      <input
        type="email"
        name="email"
        placeholder="Email"
        className="input input-bordered w-full"
        value={formData.email}
        onChange={handleChange}
        required
      />

      {/* 🔑 Password */}
      <input
        type="password"
        name="password"
        placeholder="Password"
        className="input input-bordered w-full"
        value={formData.password}
        onChange={handleChange}
        required
      />

      {/* ✅ Buttons */}
      <div className="flex gap-4">
        <button type="submit" className="btn btn-primary w-full">
          Register
        </button>
        <button type="button" className="btn btn-ghost w-full" onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default RegisterTheaterOwnerForm;
