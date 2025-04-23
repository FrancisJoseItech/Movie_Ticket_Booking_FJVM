// 📁 src/pages/HomePage.jsx

import React, { useState, useEffect } from "react";
import MovieSearchBar from "../components/movie/MovieSearchBar";   // 🔍 Child: search box
import MovieCard from "../components/movie/MovieCard";             // 🎬 Child: individual card
import { getAllMovies } from "../services/movieServices";          // 📡 API call to fetch movies
import { getPublicShows } from "../services/showServices";         // 📡 API call to fetch shows

const HomePage = () => {
  // 🎞️ All movies with hasUpcomingShow field attached
  const [movies, setMovies] = useState([]);

  // 🔍 User search term
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchMoviesAndShows = async () => {
      try {
        const [allMovies, allShows] = await Promise.all([
          getAllMovies(),       // 📡 Get movies from backend
          getPublicShows(),     // 📡 Get shows from backend
        ]);

        console.log("🎞️ All movies fetched:", allMovies);
        console.log("🎟️ All shows fetched:", allShows);

        const now = new Date();

        // 🔁 Attach custom flag to each movie
        // 🔁 Loop through every movie fetched from the backend
        const updatedMovies = allMovies.map((movie) => {

          // ✅ Check if this movie has *at least one* future show
          const hasUpcoming = allShows.some(
            (show) =>
              // 🛡️ Defensive check: ensure movieId is populated as an object (due to .populate in backend)
              show.movieId?._id?.toString() === movie._id.toString() &&  // 🎯 Compare movie IDs safely as strings

              // ⏱️ Also ensure the show date is in the future
              new Date(show.date) > now
          );

          // 🪵 Log the outcome of the check for this movie
          console.log(`🎬 ${movie.title} - hasUpcomingShow:`, hasUpcoming);

          // 📦 Return a new version of the movie with `hasUpcomingShow` added
          return {
            ...movie,                      // 🧬 Keep all existing movie fields (title, genre, etc.)
            hasUpcomingShow: hasUpcoming, // 🆕 Add a flag: true if upcoming shows exist, else false
          };
        });

        // 📥 Save the updated movie list (with hasUpcomingShow flags) into component state
        setMovies(updatedMovies);

        // 🧾 Log the final state to verify each movie's `hasUpcomingShow` value
        updatedMovies.forEach((m) =>
          console.log("📦 Final Movie State:", m.title, m.hasUpcomingShow)
        );

      } catch (err) {
        console.error("❌ Failed to fetch movies/shows:", err.message);
      }
    };

    fetchMoviesAndShows(); // 🚀 Trigger on load
  }, []);

  // 🔍 Filter movies based on search input (case insensitive)
  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log("🔎 Filtered movies to show:", filteredMovies);

  return (
    <div className="p-6">
      {/* 🏷️ Page heading */}
      <h1 className="text-3xl font-bold mb-4">🎬 Now Showing</h1>

      {/* 🔍 MovieSearchBar receives searchTerm and updater function */}
      <MovieSearchBar
        searchTerm={searchTerm}                 // 🔄 Value passed to child input
        onSearchChange={setSearchTerm}         // 🔁 Function passed to child to update
      />

      {/* 🎥 MovieCard receives movie object including hasUpcomingShow */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))
        ) : (
          <p className="text-gray-500">No movies found. Try another title!</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
