import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux"; // 🔐 Logged-in user
import { useLoaderData } from "react-router-dom"; // 📦 Data from loader
import AddShowForm from "../../components/admin/AddShowForm"; // 🎬 Show form
import { toast } from "sonner";
import { getPublicShows } from "../../services/showServices"; // 📡 API to get shows

const TheaterOwnerDashboard = () => {
  const { user } = useSelector((state) => state.auth); // 📥 Logged-in user info
  const { theaters: ownedTheaters, movies: allMovies } = useLoaderData(); // 📥 Props from loader

  const [showFormVisible, setShowFormVisible] = useState(false); // 🔘 Toggle AddShowForm
  console.log("🎭 Logged-in user:", user);
  console.log("🏟️ Owned Theaters from loader:", ownedTheaters);
  console.log("🎬 Movies from loader:", allMovies);

  const [allShows, setAllShows] = useState([]); // 🎟️ All fetched shows

  // 🧠 Fetch shows (used inside useEffect and after add)
  const fetchShows = async () => {
    try {
      const data = await getPublicShows(); // ✅ Get all future shows
      setAllShows(data); // 💾 Save in state
      console.log("🎟️ Refreshed show list:", data);
    } catch (err) {
      console.error("❌ Failed to fetch shows:", err.message);
      toast.error("Could not fetch shows.");
    }
  };

  useEffect(() => {
    fetchShows(); // 🚀 Run once on mount
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">🎭 Theater Owner Dashboard</h1>

      {/* 🧍 Welcome Info */}
      <div className="bg-base-200 p-4 rounded shadow mb-6">
        <p>Welcome, <span className="font-bold">{user?.name}</span>!</p>
        <p>Role: <span className="capitalize">{user?.role}</span></p>
      </div>

      <h2 className="text-xl font-semibold mb-3">🏢 Your Theaters & Shows</h2>

      {/* 🏢 Render owned theaters + related shows */}
      {ownedTheaters.length === 0 ? (
        <p className="text-gray-500">No theaters owned yet.</p>
      ) : (
        <div className="space-y-6">
          {ownedTheaters.map((theater) => {
            // 🎯 Filter shows for this theater
            const showsOfThisTheater = allShows.filter(
              (show) => show.theaterId?._id === theater._id
            );

            return (
              <div key={theater._id} className="border p-4 rounded shadow-sm">
                <h3 className="text-lg font-semibold">
                  🏢 {theater.name} — {theater.location} ({theater.totalSeats} seats)
                </h3>

                {/* 🎟️ Show List */}
                {showsOfThisTheater.length > 0 ? (
                  <ul className="mt-2 pl-4 list-disc text-sm text-gray-700">
                    {showsOfThisTheater.map((show) => (
                      <li key={show._id}>
                        🎬 <strong>{show.movieId?.title}</strong> | 📅 {new Date(show.date).toLocaleDateString()} @ {show.time} | ₹{show.price}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-red-500 mt-1">No shows added yet.</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ➕ Add Show Button */}
      <div className="mt-6">
        <button
          className="btn btn-primary"
          onClick={() => {
            console.log("🧩 Showing AddShowForm");
            setShowFormVisible(true);
          }}
        >
          ➕ Add New Show
        </button>
      </div>

      {/* 📋 AddShowForm with props and callback */}
      {showFormVisible && (
        <AddShowForm
          movies={allMovies} // 📤 Props: from loader
          theaters={ownedTheaters} // 📤 Props: filtered owned theaters
          onClose={() => {
            console.log("❌ Hiding AddShowForm");
            setShowFormVisible(false);
          }}
          onShowAdded={() => {
            toast.success("✅ Show added successfully!");
            fetchShows(); // 🔁 Refresh show list
            setShowFormVisible(false); // 🔙 Close form
          }}
        />
      )}
    </div>
  );
};

export default TheaterOwnerDashboard;
