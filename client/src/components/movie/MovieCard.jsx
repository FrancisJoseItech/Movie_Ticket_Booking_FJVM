// 📁 src/components/movie/MovieCard.jsx

import React from "react";
import { useNavigate } from "react-router-dom";

// 🧾 Props received from HomePage: movie (object with full details + hasUpcomingShow flag)
const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  // 🧭 When poster is clicked → go to Movie Details Page
  const handlePosterClick = () => {
    console.log("🖼️ Poster clicked for:", movie.title);
    navigate(`/movies/${movie._id}`);
  };

  return (
    <div className="card bg-base-100 shadow-md p-4 rounded-xl">
      {/* 🖼️ Movie Poster (Clickable) */}
      <img
        src={movie.posterUrl || "/default-movie.jpg"} // 🔄 Fallback poster if not present
        alt={`${movie.title} Poster`}                 // ✅ Accessibility
        className="w-full h-64 object-contain rounded-xl"
        onClick={handlePosterClick}                   // 📦 Click to navigate to MovieDetailsPage
      />

      {/* 🎬 Movie Info */}
      <h2 className="text-lg font-semibold mt-2">{movie.title}</h2>
      <p className="text-sm text-gray-500 capitalize">🎭 {movie.genre}</p>
      <p className="text-xs text-gray-400 mt-1">🕒 {movie.duration} min • {movie.language}</p>

      {/* 📅 Availability Check */}
      {movie.hasUpcomingShow ? (
        <button
          className="btn btn-primary mt-3"
          onClick={() => navigate(`/shows?movieId=${movie._id}`)}
        >
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
