import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { deleteMovie, getAllMovies } from "../../services/adminServices"; // 📡 API call
import AddMovieForm from "../../components/admin/AddMovieForm"; // 🎬 Add movie component


const AdminDashboard = () => {
    // ✅ Get logged-in admin from Redux
    const { user } = useSelector((state) => state.auth);
  
    // 🧠 Local state for movies and AddMovie toggle
    const [movies, setMovies] = useState([]);
    const [showAddMovie, setShowAddMovie] = useState(false);
  
    // 📡 Fetch all movies from backend
    const fetchMovies = async () => {
      try {
        console.log("🎬 Fetching all movies...");
        const data = await getAllMovies();
        console.log("✅ Fetched movies:", data);
        setMovies(data);
      } catch (err) {
        console.error("❌ Failed to fetch movies:", err.message);
      }
    };
  
    // ⏱️ Run once on component mount
    useEffect(() => {
      console.log("👑 AdminDashboard Loaded | Logged-in User:", user);
      fetchMovies();
    }, []);
  
    // 🗑️ Delete a movie
    const handleDelete = async (movieId) => {
      try {
        const confirm = window.confirm("Are you sure you want to delete this movie?");
        if (!confirm) return;
  
        console.log("🗑️ Deleting movie with ID:", movieId);
        await deleteMovie(movieId);
        console.log("✅ Movie deleted successfully");
  
        fetchMovies(); // 🔁 Refresh movie list
      } catch (error) {
        console.error("❌ Error deleting movie:", error.message);
      }
    };
  
    return (
      <div className="p-6">
        {/* 🧾 Admin Greeting */}
        <h1 className="text-3xl font-bold mb-4">👑 Admin Dashboard</h1>
        <div className="bg-base-200 p-4 rounded shadow mb-6">
          <p>Welcome, <span className="font-bold">{user?.name || "Admin"}</span>!</p>
          <p>Role: <span className="capitalize">{user?.role}</span></p>
        </div>
  
        {/* 🎬 All Movies Table */}
        <h2 className="text-xl font-semibold mb-2">🎬 All Movies</h2>
        <div className="overflow-x-auto bg-base-100 rounded shadow mb-8">
          <table className="table table-zebra">
            <thead className="bg-base-300">
              <tr>
                <th>#</th>
                <th>Poster</th>
                <th>Title</th>
                <th>Language</th>
                <th>Genre</th>
                <th>Description</th>
                {/* 🔧 New actions column */}
                <th>Actions</th> 
              </tr>
            </thead>
            <tbody>
              {movies.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">No movies found</td>
                </tr>
              ) : (
                movies.map((movie, index) => (
                  <tr key={movie._id}>
                    <td>{index + 1}</td>
                    <td>
                      <img src={movie.posterUrl} alt={movie.title} className="h-16 rounded" />
                    </td>
                    <td>{movie.title}</td>
                    <td>{movie.language}</td>
                    <td>{movie.genre?.slice(0, 25)}</td>
                    <td>{movie.description?.slice(0, 50)}...</td>
                    <td>
                      {/* 🗑️ Delete Button */}
                      <button
                        className="btn btn-xs btn-error"
                        onClick={() => handleDelete(movie._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
  
        {/* ➕ Add Movie Button */}
        <div className="flex justify-end mt-10 mb-4">
          <button
            onClick={() => setShowAddMovie(true)}
            className="btn btn-primary"
          >
            ➕ Add New Movie
          </button>
        </div>
  
        {/* 📦 Show Form Component */}
        {showAddMovie && (
          <AddMovieForm
            onClose={() => setShowAddMovie(false)}
            onMovieAdded={fetchMovies} // 🔁 Refresh after new movie
          />
        )}
      </div>
    );
  };

export default AdminDashboard;
