import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useLoaderData } from "react-router-dom"; // 📦 For loader-based data
import AddShowForm from "../../components/admin/AddShowForm"; // 🧩 Add Show form 🎬 Reusing show form
import { toast } from "sonner"; // 🔔 Notification for feedback

const TheaterOwnerDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  // 📦 Get preloaded data (theaters & movies) from loader
  const { theaters: ownedTheaters, movies: allMovies } = useLoaderData();

  // 🎛️ Toggle for showing the Add Show form
  const [showFormVisible, setShowFormVisible] = useState(false);

  console.log("🎭 Logged-in user:", user);
  console.log("🏟️ Owned Theaters from loader:", ownedTheaters);
  console.log("🎬 Movies from loader:", allMovies);

  return (
    <div className="p-6">
      {/* 🥳 Welcome message */}
      <h1 className="text-3xl font-bold mb-4">🎭 Theater Owner Dashboard</h1>

      <div className="bg-base-200 p-4 rounded shadow mb-6">
        <p>
          Welcome, <span className="font-bold">{user?.name || "Theater Owner"}</span>!
        </p>
        <p>
          Role: <span className="capitalize">{user?.role || "theater_owner"}</span>
        </p>
      </div>

      {/* 🎬 List of Owned Theaters */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">🏢 Your Theaters</h2>

        {ownedTheaters.length === 0 ? (
          <p className="text-gray-500">You don't have any theaters yet.</p>
        ) : (
          <ul className="list-disc pl-5 space-y-2">
            {ownedTheaters.map((theater) => (
              <li key={theater._id}>
                <strong>{theater.name}</strong> – {theater.location} ({theater.totalSeats} seats)
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ➕ Add Show Button */}
      <div className="mb-4">
        <button
          className="btn btn-primary"
          onClick={() => setShowFormVisible(true)}
        >
          ➕ Add New Show
        </button>
      </div>

      {/* 📋 Add Show Form (conditionally rendered) */}
      {showFormVisible && (
        <AddShowForm
          movies={allMovies}                // 🎥 All movies available
          theaters={ownedTheaters}          // 🏢 Only owned theaters
          onClose={() => setShowFormVisible(false)} // 🔙 Close form
          onShowAdded={() => {
            toast.success("✅ Show added successfully!");
            setShowFormVisible(false);
          }}
        />
      )}
    </div>
  );
};

export default TheaterOwnerDashboard;
