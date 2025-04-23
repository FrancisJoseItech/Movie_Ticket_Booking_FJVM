// 📁 src/components/movie/MovieSearchBar.jsx

import React from "react";

// 📌 This component accepts `searchTerm` and `onSearchChange` as props from the parent (HomePage)
const MovieSearchBar = ({ searchTerm, onSearchChange }) => {
  console.log("🔍 MovieSearchBar received searchTerm:", searchTerm); // 🧪 Debug prop

  return (
    <div className="my-4">
      {/* 📥 Controlled input tied to searchTerm */}
      <input
        type="text"
        placeholder="🔎 Search for a movie..."
        value={searchTerm}
        onChange={(e) => {
          console.log("🎯 Search input changed to:", e.target.value); // 🔍 Log user input
          onSearchChange(e.target.value); // 📨 Send back to parent
        }}
        className="input input-bordered w-full max-w-md"
      />
    </div>
  );
};

export default MovieSearchBar;
