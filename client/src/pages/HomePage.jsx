// 📁 src/pages/HomePage.jsx

import React, { useState, useEffect } from "react";
import MovieSearchBar from "../components/movie/MovieSearchBar";   // 🔍 Child component: search box
import MovieCard from "../components/movie/MovieCard";             // 🎬 Child component: individual movie card
import { getAllMovies } from "../services/movieServices";          // 📡 Service: API call to fetch movies
import { getPublicShows } from "../services/showServices";         // 📡 Service: API call to fetch shows

const HomePage = () => {
  // 🎞️ Local state: List of movies (each movie may have `hasUpcomingShow`)
  const [movies, setMovies] = useState([]);

  // 🔍 Local state: Search term typed by the user
  const [searchTerm, setSearchTerm] = useState("");

  // ⏳ Local state: Loading indicator (true when fetching, false after fetching)
  const [loading, setLoading] = useState(true);

  // 🚀 useEffect: Runs when page loads to fetch movies and shows
  useEffect(() => {
    const fetchMoviesAndShows = async () => {
      try {
        console.log("🚀 Starting to fetch movies and shows from backend...");
        setLoading(true); // ⏳ Show spinner while data is being fetched

        // 📡 Fetch movies and shows in parallel
        const [allMovies, allShows] = await Promise.all([
          getAllMovies(),
          getPublicShows(),
        ]);

        console.log("🎞️ Movies fetched:", allMovies);
        console.log("🎟️ Shows fetched:", allShows);

        const now = new Date(); // 📅 Get current time for filtering future shows

        // 🔁 Loop through each movie and attach a new field: hasUpcomingShow
        const updatedMovies = allMovies.map((movie) => {
          // ✅ Check if there’s any upcoming show related to this movie
          const hasUpcoming = allShows.some(
            (show) =>
              show.movieId?._id?.toString() === movie._id.toString() &&  // 🎯 Match movie ID safely
              new Date(show.date) > now                                  // ⏰ Future show date
          );

          console.log(`🎬 Movie: ${movie.title} | Has Upcoming Show:`, hasUpcoming);

          // 📦 Return movie object with new field `hasUpcomingShow`
          return {
            ...movie,
            hasUpcomingShow: hasUpcoming,
          };
        });

        // 📥 Save updated movies to state
        setMovies(updatedMovies);

        updatedMovies.forEach((m) =>
          console.log("📦 Final Movie State:", m.title, m.hasUpcomingShow)
        );

      } catch (err) {
        console.error("❌ Error fetching movies/shows:", err.message);
      } finally {
        setLoading(false); // ✅ Stop spinner whether success or failure
      }
    };

    fetchMoviesAndShows(); // 🚀 Trigger API calls on component mount
  }, []);

  // 🔍 Filter movies based on user search input (case insensitive match)
  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log("🔎 Filtered Movies after search:", filteredMovies);

  // ⏳ While loading data, show a loading spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {/* 🌀 Loading Spinner (from Tailwind + DaisyUI) */}
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // 🏁 After loading is done, show actual page content
  return (
    <div className="p-6">
      {/* 🏷️ Page heading */}
      <h1 className="text-3xl font-bold mb-4">🎬 Now Showing</h1>

      {/* 🔍 Search bar to filter movies */}
      <MovieSearchBar
        searchTerm={searchTerm}          // 🔄 Pass current search term
        onSearchChange={setSearchTerm}   // 🔁 Pass function to update search term
      />

      {/* 🎥 Movie Grid - shows filtered movies */}
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
