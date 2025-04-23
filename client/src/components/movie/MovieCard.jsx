// ✅ MovieCard.jsx - Displays individual movie info with Book button
import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

// 🧾 Props: movie object comes from HomePage
const MovieCard = ({ movie }) => {
  console.log("🎬 MovieCard props received:", movie); // ✅ Should include hasUpcomingShow
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth); // 🔐 Check login

  // 🧭 When Book button is clicked
  const handleBookClick = () => {
    if (!user) {
      console.warn("⚠️ Not logged in. Redirecting to login...");
      return navigate("/login", {
        state: { redirectTo: `/shows?movieId=${movie._id}` }, // 📌 Go back after login
      });
    }

    navigate(`/shows?movieId=${movie._id}`); // ✅ Proceed to Show listing
  };

  return (
    <div className="card bg-base-100 shadow-md p-4 rounded-md w-full">
      {/* 🖼️ Poster */}
      <img
        src={movie.posterUrl}
        alt={`${movie.title} Poster`}
        className="w-full h-60 object-cover rounded mb-3"
      />

      {/* 🎬 Title */}
      <h2 className="text-lg font-semibold">{movie.title}</h2>

      {/* 🧾 Genre */}
      <p className="text-sm text-gray-500 capitalize">{movie.genre}</p>

      {/* ⏱️ Duration + Language */}
      <p className="text-xs text-gray-400 mt-1">
        ⏱️ {movie.duration} min • {movie.language}
      </p>

      {/* 📅 Booking or fallback message */}
      {movie.hasUpcomingShow ? (
        <button onClick={handleBookClick} className="btn btn-primary mt-3">
          🎟️ Book Now
        </button>
      ) : (
        <p className="text-red-500 text-sm mt-3">
          ❌ No upcoming shows. Please check later.
        </p>
      )}
    </div>
  );
};

export default MovieCard;
