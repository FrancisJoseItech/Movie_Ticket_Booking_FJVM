// 📦 React & Redux Imports
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

// 🌐 API Services
import { getAllMovies, deleteMovie, getAllTheaters } from "../../services/adminServices";

// 🎬 Component for Add/Edit Movie
import AddMovieForm from "../../components/admin/AddMovieForm";

// 🎭 Component for Add Theater
import AddTheaterForm from "../../components/admin/AddTheaterForm";

// 🧠 Import component Add Theater_admin only
import RegisterTheaterOwnerForm from "../../components/admin/RegisterTheaterOwnerForm"; 

// 🧠 Admin-only API to fetch all users
import { getAllUsers } from "../../services/userServices";


// 🔔 Toast notifications
import { toast } from "sonner";


// 🧩 Admin Dashboard Component
const AdminDashboard = () => {
  // 🧠 Fetching the logged-in user's info from Redux store
  const { user } = useSelector((state) => state.auth);

  // 🎞️ State to hold the list of movies (fetched from backend)
  const [movies, setMovies] = useState([]);

  // 🧾 Boolean to show/hide the AddMovieForm component
  const [showAddMovie, setShowAddMovie] = useState(false);

  // ✏️ State to hold a movie object when editing (null = add mode)
  const [selectedMovie, setSelectedMovie] = useState(null);

  const [showAddTheater, setShowAddTheater] = useState(false); // 📦 Toggle theater form
  const [theaters, setTheaters] = useState([]);                // 🏢 Store all theaters

  // 🧾 Toggle visibility for Register Theater Owner Form
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  // 🎭 Store all registered users with role 'theater_owner'
const [theaterOwners, setTheaterOwners] = useState([]);


  // ⏳ Boolean to show loading spinner while fetching movies
  const [loading, setLoading] = useState(false);

  

  // 📡 API Call: Fetch all movies and update `movies` state
  const fetchMovies = async () => {
    try {
      console.log("📡 Fetching movies...");
      setLoading(true); // Show spinner
      
    //   await new Promise((resolve) => setTimeout(resolve, 1000)); // ⏳ simulate delay
      const data = await getAllMovies(); // API GET call
      console.log("✅ Movies fetched:", data);

      setMovies(data); // Store result in state
    } catch (err) {
      console.error("❌ Error fetching movies:", err.message);
      toast.error("Failed to fetch movies.");
    } finally {
      setLoading(false); // Hide spinner
      console.log("🔚 Finished fetching movies.");
    }
  };

  const fetchTheaters = async () => {
    try {
      console.log("🎯 Fetching all theaters...");
      const data = await getAllTheaters();
      console.log("✅ Theaters fetched:", data);
      setTheaters(data);
    } catch (err) {
      console.error("❌ Failed to fetch theaters:", err.message);
    }
  };

  const fetchTheaterOwners = async () => {
    try {
      console.log("🎯 Fetching all users...");
      const users = await getAllUsers(); // 📡 API call from userServices
      const ownersOnly = users.filter(user => user.role === "theater_owner"); // 🎭 filter
  
      console.log("✅ Theater Owners Fetched:", ownersOnly);
      setTheaterOwners(ownersOnly); // 📦 store in state
    } catch (err) {
      console.error("❌ Failed to fetch users:", err.message);
    }
  };

  // 🗑️ API Call: Delete a movie by ID
  const handleDelete = async (movieId) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this movie?");
      if (!confirmDelete) return;

      console.log("🗑️ Deleting movie ID:", movieId);
      await deleteMovie(movieId); // API DELETE call

      toast.success("✅ Movie deleted successfully");

      fetchMovies(); // 🔁 Refresh movie list after deletion
    } catch (error) {
      console.error("❌ Error deleting movie:", error.message);
      toast.error("Failed to delete movie.");
    }
  };

  // 🔐 Called when AddMovieForm is closed
  const handleFormClose = () => {
    console.log("🔒 Closing Add/Edit form");
    setShowAddMovie(false);    // Hide the form
    setSelectedMovie(null);    // Reset edit state
  };

  // 🚀 Fetch movies once on component mount
  useEffect(() => {
    console.log("👑 AdminDashboard mounted | User:", user?.name);
    fetchMovies();
    fetchTheaters(); // 🏢 Load theaters on page load
    fetchTheaterOwners();
  }, []);

  // 📦 UI Rendering
  return (
    <div className="p-6">
      {/* 👋 Welcome message */}
      <h1 className="text-3xl font-bold mb-4">👑 Admin Dashboard</h1>
      <div className="bg-base-200 p-4 rounded shadow mb-6">
        <p>
          Welcome, <span className="font-bold">{user?.name || "Admin"}</span>!
        </p>
        <p>
          Role: <span className="capitalize">{user?.role}</span>
        </p>
      </div>

      {/* 🎬 Section: All Movies Table */}
      <h2 className="text-xl font-semibold mb-2">🎬 All Movies</h2>

      {/* 🌀 Show Spinner while loading */}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <span className="loading loading-bars loading-lg text-primary"></span>
          <p className="ml-4 text-sm">Loading movies...</p>
        </div>
      ) : (
        // 📊 Table of movies
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
                {/* ✏️ Edit / 🗑️ Delete */}
                <th>Actions</th> 
              </tr>
            </thead>
            <tbody>
              {movies.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    No movies found
                  </td>
                </tr>
              ) : (
                movies.map((movie, index) => (
                  <tr key={movie._id}>
                    <td>{index + 1}</td>
                    <td>
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="h-16 rounded"
                      />
                    </td>
                    <td>{movie.title}</td>
                    <td>{movie.language}</td>
                    <td>{movie.genre?.slice(0, 25)}</td>
                    <td>{movie.description?.slice(0, 50)}...</td>
                    <td>
                      <div className="flex gap-2">
                        {/* ✏️ Edit Button */}
                        <button
                          className="btn btn-xs btn-info"
                          onClick={() => {
                            console.log("✏️ Editing movie:", movie);
                            setSelectedMovie(movie);     // ⬅️ Set data to edit
                            setShowAddMovie(true);       // Show form
                          }}
                        >
                          Edit
                        </button>

                        {/* 🗑️ Delete Button */}
                        <button
                          className="btn btn-xs btn-error"
                          onClick={() => handleDelete(movie._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ➕ Add New Movie Button */}
      <div className="flex justify-end mt-10 mb-4">
        <button
          onClick={() => {
            setSelectedMovie(null);       // Reset edit state
            setShowAddMovie(true);        // Show form in Add mode
          }}
          className="btn btn-primary"
        >
          ➕ Add New Movie
        </button>
      </div>

      {/* 🧾 Render Form Conditionally (Add/Edit) */}
      {showAddMovie && (
        <AddMovieForm
          onClose={handleFormClose}         // ⬅️ Function passed to child
          onMovieAdded={fetchMovies}        // ⬅️ Function passed to refresh parent
          selectedMovie={selectedMovie}     // ⬅️ Movie data passed to child
        />
      )}

          {/* 🏢 Theater Management Section */}
          <h2 className="text-xl font-semibold mb-2">🏢 All Theaters</h2>

          {/* 👤 Register Theater Owner Button */}
          <div className="flex justify-end mt-6 mb-4">
              <button
                  onClick={() => setShowRegisterForm(true)}
                  className="btn btn-secondary"
              >
                  🏢 Register Theater Owner
              </button>
          </div>

          <div className="flex justify-end mb-4">
              <button
                  onClick={() => setShowAddTheater(true)}
                  className="btn btn-accent"
              >
                  ➕ Add New Theater
              </button>
          </div>

          {/* 🏢 Theater Table */}
          <div className="overflow-x-auto bg-base-100 rounded shadow mb-10">
              <table className="table table-zebra">
                  <thead className="bg-base-300">
                      <tr>
                          <th>#</th>
                          <th>Name</th>
                          <th>Location</th>
                          <th>Total Seats</th>
                      </tr>
                  </thead>
                  <tbody>
                      {theaters.length === 0 ? (
                          <tr>
                              <td colSpan="4" className="text-center py-4">No theaters found</td>
                          </tr>
                      ) : (
                          theaters.map((theater, index) => (
                              <tr key={theater._id}>
                                  <td>{index + 1}</td>
                                  <td>{theater.name}</td>
                                  <td>{theater.location}</td>
                                  <td>{theater.totalSeats}</td>
                              </tr>
                          ))
                      )}
                  </tbody>
              </table>
          </div>
          
          {/* 
🧾 Show Theater Owner Registration Form (Only when showRegisterForm is true)
- This component is rendered conditionally.
- It is used to let the admin register a new user with role = 'theater_owner'.
- We pass two props to this child component:
   ✅ onClose: function to hide the form (executed after successful or cancelled registration)
   ✅ onRegistered: callback function triggered after registration (can be used to refresh list or log, optional for now)
*/}
          {showRegisterForm && (
              <RegisterTheaterOwnerForm
                  onClose={() => setShowRegisterForm(false)}  // 🔐 Prop: Close/hide form from parent
                  onRegistered={() => {
                    console.log("✅ New theater owner registered!"); // ✅ Prop: optional callback after successful registration
                    fetchTheaterOwners(); // 🔁 Re-fetch owners for dropdown   
                  }}
              />
          )}
          

          {/* 🧾 Conditionally Render the Add Theater Form */}
          {showAddTheater && (
              <AddTheaterForm
                  onClose={() => setShowAddTheater(false)} // 🔐 Prop #1: Function to hide the form when Cancel or Success is clicked inside the form
                  onTheaterAdded={fetchTheaters}           // 🔄 Prop #2: Function to refresh the parent list after a new theater is added
                  theaterOwners={theaterOwners}            // 📦 Prop #3: Passing down the list of theater_owner users to be used in dropdown (admin only)
              />
          )}


    </div>
  );

  

};

export default AdminDashboard;
