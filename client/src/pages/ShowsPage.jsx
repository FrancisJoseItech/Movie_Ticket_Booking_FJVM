// 📁 src/pages/ShowsPage.jsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { getPublicShows } from "../services/showServices"; // 📡 API call to fetch shows

function ShowsPage() {
  // 🎬 All shows (from backend)
  const [shows, setShows] = useState([]);

  // 🌀 UI loading indicator
  const [loading, setLoading] = useState(true);

  // ⌛ Current time used for filtering
  const now = new Date();

  // 📦 Fetch shows on page mount
  useEffect(() => {
    const fetchShows = async () => {
      try {
        const data = await getPublicShows(); // ✅ API call

        console.log("📡 Raw shows fetched from backend:", data);

        // 🧠 Filter: Only include shows scheduled in the future
        const upcoming = data.filter(
          (show) => new Date(show.date) > now
        );

        console.log("🎯 Upcoming shows only:", upcoming);
        setShows(upcoming); // ✅ Store filtered list

      } catch (err) {
        console.error("❌ Failed to load shows:", err.message);
        toast.error("Failed to load shows. Please try again later.");
      } finally {
        setLoading(false); // ✅ Hide loading
      }
    };

    fetchShows(); // 🚀 Trigger on first load
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* 🏷️ Page heading */}
      <h1 className="text-3xl font-bold mb-6">🎟️ All Available Shows</h1>

      {/* 🔄 Conditional content: loading, no-shows, or list */}
      {loading ? (
        <div>⏳ Loading shows...</div>
      ) : shows.length === 0 ? (
        <p className="text-gray-500">No upcoming shows available.</p>
      ) : (
        // 🎞️ Map over valid shows
        <div className="grid grid-cols-1 gap-4">
          {shows.map((show) => (
            <div
              key={show._id}
              className="bg-base-200 p-4 rounded shadow flex flex-col md:flex-row justify-between items-center"
            >
              {/* 🎬 Show Details Block */}
              <div className="flex items-center gap-4">
                {/* 🖼️ Poster */}
                <img
                  src={show.movieId?.posterUrl || "/default-movie.jpg"}
                  alt={`${show.movieId?.title || "Untitled"} Poster`}
                  className="w-20 h-28 rounded object-cover"
                />

                {/* 📋 Movie + Theater Info */}
                <div>
                  <h2 className="text-xl font-semibold">
                    🎬 {show.movieId?.title || "Untitled Movie"}
                  </h2>
                  <p className="text-gray-600">
                    🏢 {show.theaterId?.name} —{" "}
                    {new Date(show.date).toLocaleDateString()} @ {show.time}
                  </p>
                  <p className="text-sm text-green-700 font-medium">
                    💰 ₹{show.price} per seat
                  </p>
                </div>
              </div>

              {/* 🔗 Book Now Link */}
              <Link
                to={`/book/${show._id}`}
                className="btn btn-primary mt-4 md:mt-0"
              >
                🎟️ Book Now
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ShowsPage;
