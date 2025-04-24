// 📁 src/pages/ShowsPage.jsx

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // 🔗 For navigation (redirects)
import { toast } from "sonner"; // 🔔 Notifications
import { useSelector } from "react-redux"; // 🔐 Access user auth info
import { getPublicShows } from "../services/showServices"; // 📡 Fetch shows from backend

function ShowsPage() {
  // 🎬 State: All shows (from backend, filtered later)
  const [shows, setShows] = useState([]);

  // ⚙️ Loading indicator while fetching data
  const [loading, setLoading] = useState(true);

  // 🔐 Authenticated user info from Redux
  const { user } = useSelector((state) => state.auth);

  // 🔀 Used for programmatic navigation (login redirect)
  const navigate = useNavigate();

  // 📦 On component mount: fetch shows
  useEffect(() => {
    const fetchShows = async () => {
      try {
        const data = await getPublicShows(); // 📡 API call to backend
        console.log("📡 Raw shows fetched from backend:", data);

        // 🧠 Filter shows to include only future-dated ones
        const now = new Date();
        const upcoming = data.filter((show) => new Date(show.date) > now);

        console.log("🎯 Upcoming shows only:", upcoming);
        setShows(upcoming); // ✅ Save filtered shows

      } catch (err) {
        console.error("❌ Failed to load shows:", err.message);
        toast.error("Failed to load shows. Please try again later.");
      } finally {
        setLoading(false); // ✅ Stop loading
      }
    };

    fetchShows(); // 🚀 Initial load
  }, []);

  // 📤 Prop: show._id is passed to URL to identify show
  const handleBookNow = (showId) => {
    if (!user) {
      // 🚫 Not logged in → Redirect to login with return path
      console.warn("🔐 Redirecting unauthenticated user to login");
      return navigate("/login", {
        state: { redirectTo: `/book/${showId}` },
      });
    }

    // ✅ Logged in → Proceed to booking
    navigate(`/book/${showId}`);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* 📘 Page heading */}
      <h1 className="text-3xl font-bold mb-6">🎟️ All Available Shows</h1>

      {/* ⏳ Loading or no shows fallback */}
      {loading ? (
        <div>⏳ Loading shows...</div>
      ) : shows.length === 0 ? (
        <p className="text-gray-500">No upcoming shows available.</p>
      ) : (
        // 🎞️ Shows list
        <div className="grid grid-cols-1 gap-4">
          {shows.map((show) => (
            <div
              key={show._id}
              className="bg-base-200 p-4 rounded shadow flex flex-col md:flex-row justify-between items-center"
            >
              {/* 🎬 Left: Poster + Movie Details */}
              <div className="flex items-center gap-4">
                {/* 🖼️ Poster image (from movie prop) */}
                <img
                  src={show.movieId?.posterUrl || "/default-movie.jpg"}
                  alt={`${show.movieId?.title || "Untitled"} Poster`}
                  className="w-20 h-28 rounded object-cover"
                />

                {/* 📋 Show details */}
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

              {/* 📤 "Book Now" button → sends showId as param */}
              <button
                onClick={() => handleBookNow(show._id)}
                className="btn btn-primary mt-4 md:mt-0"
              >
                🎟️ Book Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ShowsPage;
