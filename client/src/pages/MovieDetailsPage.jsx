// 📁 src/pages/MovieDetailsPage.jsx

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getMovieById } from "../services/movieServices";   // 📡 Movie API call
import { getPublicShows } from "../services/showServices";   // 📡 Show API call
import { toast } from "sonner";

const MovieDetailsPage = () => {
  const { movieId } = useParams(); // 🎯 URL param (from route `/movies/:movieId`)
  const [movie, setMovie] = useState(null); // 🎬 Selected movie
  const [shows, setShows] = useState([]);   // 🎟️ Upcoming shows for this movie
  const [loading, setLoading] = useState(true); // 🌀 Loading state

  // 🚀 Fetch movie and its shows on mount
  useEffect(() => {
    const fetchMovieAndShows = async () => {
      try {
        // 📡 Fetch full movie details
        const movieData = await getMovieById(movieId);
        console.log("🎬 Movie Details Fetched:", movieData);
        setMovie(movieData);

        // 📡 Fetch all upcoming shows
        const allShows = await getPublicShows();

        // 🎯 Filter shows for this specific movie
        const filtered = allShows.filter(
          (show) => show.movieId?._id?.toString() === movieId
        );
        console.log("🎟️ Filtered Shows for movie:", filtered);

        setShows(filtered);
      } catch (err) {
        console.error("❌ Failed to load movie or shows:", err.message);
        toast.error("Error loading movie details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieAndShows();
  }, [movieId]);

  if (loading) return <div className="p-6">⏳ Loading movie details...</div>;
  if (!movie) return <div className="p-6 text-red-500">🚫 Movie not found</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* 🎬 Movie Title and Poster */}
      <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
      <img
        src={movie.posterUrl}
        alt={`${movie.title} Poster`}
        className="w-full max-w-md rounded mb-4 shadow"
      />

      {/* 📋 Movie Info */}
      <p className="text-gray-700 mb-2">🎭 Genre: {movie.genre}</p>
      <p className="text-gray-700 mb-2">🗣️ Language: {movie.language}</p>
      <p className="text-gray-700 mb-4">🕒 Duration: {movie.duration} mins</p>
      <p className="text-gray-600 italic mb-6">📝 {movie.description}</p>

      {/* 🎟️ Upcoming Shows */}
      <h2 className="text-2xl font-semibold mb-4">🎟️ Upcoming Shows</h2>
      {shows.length === 0 ? (
        <p className="text-red-500">❌ No upcoming shows for this movie.</p>
      ) : (
        <div className="space-y-4">
          {shows.map((show) => (
            <div
              key={show._id}
              className="bg-base-200 p-4 rounded shadow flex flex-col md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p>
                  🏢 <strong>{show.theaterId?.name}</strong> —{" "}
                  📅 {new Date(show.date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  ⏰ {show.time} — 💰 ₹{show.price} per seat
                </p>
              </div>
              <Link to={`/book/${show._id}`} className="btn btn-primary mt-3 md:mt-0">
                🎟️ Book Now
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieDetailsPage;
