// 📦 React & Redux Imports
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

// 🌐 API Services
import { getAllMovies, deleteMovie, getAllTheaters, deleteShow, deleteTheater } from "../../services/adminServices";

// 🎬 Component for Add/Edit Movie
import AddMovieForm from "../../components/admin/AddMovieForm";

// 🎭 Component for Add Theater
import AddTheaterForm from "../../components/admin/AddTheaterForm";

// 🧠 Import component Add Theater_admin only
import RegisterTheaterOwnerForm from "../../components/admin/RegisterTheaterOwnerForm"; 

// 🧠 Admin-only API to fetch all users
import { getAllUsers } from "../../services/userServices";

import AddShowForm from "../../components/admin/AddShowForm"; // 🧩 Add Show form
import { getAllShows } from "../../services/adminServices"; // ✅ getAllShows



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
// 📦 Toggle theater form
  const [showAddTheater, setShowAddTheater] = useState(false); // 📦 Toggle theater form
  
  // 🎯 Store selected theater for editing (null if adding)
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [theaters, setTheaters] = useState([]);                // 🏢 Store all theaters

  // 🧾 Toggle visibility for Register Theater Owner Form
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  // 🎭 Store all registered users with role 'theater_owner'
  const [theaterOwners, setTheaterOwners] = useState([]);

  // ➕ Toggle show form
  const [showAddShowForm, setShowAddShowForm] = useState(false); // ➕ Toggle show form

  // 🎭 Store all shows
  const [shows, setShows] = useState([]);                         



  // ⏳ Boolean to show loading spinner while fetching movies
  const [loading, setLoading] = useState(false);

  // 🧭 Track active tab: 'movies' | 'theaters' | 'shows'
const [activeTab, setActiveTab] = useState("movies");

// 🧪 Track search query for each section
const [searchMovie, setSearchMovie] = useState("");
const [searchTheater, setSearchTheater] = useState("");
const [searchShow, setSearchShow] = useState("");

  

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

  const fetchShows = async () => {
    try {
      console.log("📡 Fetching all shows...");
      const data = await getAllShows();
      setShows(data);
      console.log("✅ Shows fetched:", data);
    } catch (err) {
      console.error("❌ Failed to fetch shows:", err.message);
      toast.error("Failed to fetch shows.");
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

  
    // 🗑️ Delete a show by its ID (Admin only)
    const handleDeleteShow = async (showId) => {
        // 🔐 Ask for confirmation before proceeding
        const confirmDelete = window.confirm("Are you sure you want to delete this show?");
        if (!confirmDelete) return; // 🚪 If canceled, exit early

        try {
            // 📡 Send DELETE request to backend using adminServices
            console.log("🛠️ Deleting show with ID:", showId);
            await deleteShow(showId);

            // ✅ Show success message
            toast.success("🗑️ Show deleted successfully!");

            // 🔄 Re-fetch updated show list to refresh UI
            fetchShows();

        } catch (err) {
            // ❌ If deletion fails, log and show error toast
            console.error("❌ Failed to delete show:", err.message);
            toast.error("Failed to delete show.");
        }
    };

    // ✏️ Trigger Edit: Prefill form with selected theater
    const handleEditTheater = (theater) => {
        console.log("✏️ Editing theater:", theater);
        setSelectedTheater(theater);   // 💾 Store selected for form; Props to AddTheaterForm
        setShowAddTheater(true);       // 👀 Show the form
    };

    // 🗑️ Delete a theater by its ID
    const handleDeleteTheater = async (id) => {
        const confirm = window.confirm("Are you sure you want to delete this theater?");
        if (!confirm) return;

        try {
            console.log("🗑️ Deleting theater ID:", id);
            await deleteTheater(id);
            toast.success("🧹 Theater deleted successfully!");
            fetchTheaters(); // 🔁 Refresh after deletion
        } catch (err) {
            console.error("❌ Failed to delete theater:", err.message);
            toast.error("Failed to delete theater.");
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
    fetchShows();
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

          {/* 🧭 Section Tabs */}
          <div className="tabs tabs-boxed mb-6 flex-wrap">
              <button className={`tab ${activeTab === "movies" ? "tab-active" : ""}`} onClick={() => setActiveTab("movies")}>
                  🎬 Movies
              </button>
              <button className={`tab ${activeTab === "theaters" ? "tab-active" : ""}`} onClick={() => setActiveTab("theaters")}>
                  🏢 Theaters
              </button>
              <button className={`tab ${activeTab === "shows" ? "tab-active" : ""}`} onClick={() => setActiveTab("shows")}>
                  🎭 Shows
              </button>
          </div>


      {/* 🎬 Section: All Movies Table */}
          {activeTab === "movies" && (
              <>
                  <h2 className="text-xl font-semibold mb-2">🎬 All Movies</h2>

                  {/* 🔍 Search Movies */}
                  <input
                      type="text"
                      placeholder="Search by title or genre..."
                      value={searchMovie}
                      onChange={(e) => setSearchMovie(e.target.value)}
                      className="input input-bordered mb-4 w-full"
                  />

                  {/* 🌀 Show Spinner while loading */}
                  {loading ? (
                      <div className="text-center py-10">Loading...</div>
                  ) : (
                      <div className="overflow-x-auto bg-base-100 rounded shadow mb-8">
                          <table className="table table-zebra">
                              <thead className="bg-base-300">
                                  <tr>
                                      <th>#</th><th>Poster</th><th>Title</th><th>Language</th><th>Genre</th><th>Description</th><th>Actions</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {movies
                                      .filter((m) =>
                                          m.title.toLowerCase().includes(searchMovie.toLowerCase()) ||
                                          m.genre.toLowerCase().includes(searchMovie.toLowerCase())
                                      )
                                      .map((movie, index) => (
                                          <tr key={movie._id}>
                                              <td>{index + 1}</td>
                                              <td><img src={movie.posterUrl} className="h-16 rounded" /></td>
                                              <td>{movie.title}</td>
                                              <td>{movie.language}</td>
                                              <td>{movie.genre}</td>
                                              <td>{movie.description?.slice(0, 50)}...</td>
                                              <td>
                                                  <div className="flex items-center justify-start gap-2">
                                                      <button
                                                          className="btn btn-xs btn-info"
                                                          onClick={() => {
                                                              console.log("✏️ Editing movie:", movie);
                                                              setSelectedMovie(movie);
                                                              setShowAddMovie(true);
                                                          }}
                                                      >
                                                          Edit
                                                      </button>

                                                      <button
                                                          className="btn btn-xs btn-error"
                                                          onClick={() => handleDelete(movie._id)}
                                                      >
                                                          Delete
                                                      </button>
                                                  </div>
                                              </td>
                                          </tr>
                                      ))}
                              </tbody>
                          </table>
                      </div>
                  )}
                  <div className="flex justify-end">
                      <button className="btn btn-primary" onClick={() => { setSelectedMovie(null); setShowAddMovie(true); }}>➕ Add New Movie</button>
                  </div>
              </>
          )}

      

      {/* 🧾 Render Form Conditionally (Add/Edit) */}
      {showAddMovie && (
        <AddMovieForm
          onClose={handleFormClose}         // ⬅️ Function passed to child
          onMovieAdded={fetchMovies}        // ⬅️ Function passed to refresh parent
          selectedMovie={selectedMovie}     // ⬅️ Movie data passed to child
        />
      )}

          {/* 🏢 Theater Management Section */}
          {activeTab === "theaters" && (
              <>
                  <h2 className="text-xl font-semibold mb-2">🏢 All Theaters</h2>

                  {/* 🔍 Search Theaters */}
                  <input
                      type="text"
                      placeholder="Search by name or location..."
                      value={searchTheater}
                      onChange={(e) => setSearchTheater(e.target.value)}
                      className="input input-bordered mb-4 w-full"
                  />

                  <div className="flex justify-end gap-2 mb-4">
                      <button onClick={() => setShowRegisterForm(true)} className="btn btn-secondary">🏢 Register Theater Owner</button>
                      <button onClick={() => setShowAddTheater(true)} className="btn btn-accent">➕ Add New Theater</button>
                  </div>

                  <div className="overflow-x-auto bg-base-100 rounded shadow mb-10">
                      <table className="table table-zebra">
                          <thead className="bg-base-300">
                              <tr><th>#</th><th>Name</th><th>Location</th><th>Total Seats</th></tr>
                          </thead>
                          <tbody>
                              {theaters
                                  .filter((t) =>
                                      t.name.toLowerCase().includes(searchTheater.toLowerCase()) ||
                                      t.location.toLowerCase().includes(searchTheater.toLowerCase())
                                  )
                                  .map((theater, index) => (
                                      <tr key={theater._id}>
                                          <td>{index + 1}</td>
                                          <td>{theater.name}</td>
                                          <td>{theater.location}</td>
                                          <td>{theater.totalSeats}</td>
                                          <td>
                                              <div className="flex gap-2">
                                                  <button className="btn btn-xs btn-info" onClick={() => handleEditTheater(theater)}>
                                                      Edit
                                                  </button>
                                                  <button className="btn btn-xs btn-error" onClick={() => handleDeleteTheater(theater._id)}>
                                                      Delete
                                                  </button>
                                              </div>
                                          </td>
                                      </tr>
                                  ))}
                          </tbody>
                      </table>
                  </div>
              </>
          )}

          
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
          

          {/* 
🧾 Conditionally Render AddTheaterForm Component (Admin only)
---------------------------------------------------------------
👉 This form handles both Add and Edit modes based on `selectedTheater` prop.

🔸 Props Passed:
---------------------------------------------------------------
1. onClose (Function)            → 🔐 Closes the form and resets edit state
2. onTheaterAdded (Function)     → 🔁 Callback to refresh theater list after success
3. theaterOwners (Array)         → 📦 List of users with role = 'theater_owner' for dropdown
4. selectedTheater (Object/null) → ✏️ Theater object if editing, null if adding
*/}

          {showAddTheater && (
              <AddTheaterForm
                  // 🔐 Close form: called when cancel is clicked or after successful submit
                  onClose={() => {
                      console.log("🔒 Closing Add/Edit Theater Form");
                      setShowAddTheater(false);     // 👁️ Hide form from UI
                      setSelectedTheater(null);     // 🧼 Clear edit mode
                  }}

                  // 🔁 Callback to refresh the theater list in the parent (AdminDashboard)
                  onTheaterAdded={fetchTheaters}

                  // 📦 Dropdown data (used only when admin adds theater and assigns to a user)
                  theaterOwners={theaterOwners}

                  // ✏️ Theater object passed if editing; null = Add mode; // ✏️ If this is not null, form switches to Edit Mode
                  selectedTheater={selectedTheater}
              />
          )}


          {/* 🎭 Shows Section */}
            {activeTab === "shows" && (
                <>
                    <h2 className="text-xl font-semibold mb-2">🎭 All Shows</h2>

                    {/* 🔍 Search Shows */}
                    <input
                        type="text"
                        placeholder="Search by movie or theater..."
                        value={searchShow}
                        onChange={(e) => setSearchShow(e.target.value)}
                        className="input input-bordered mb-4 w-full"
                    />

                    <div className="flex justify-end mb-4">
                        <button onClick={() => setShowAddShowForm(true)} className="btn btn-success">
                            ➕ Add New Show
                        </button>
                    </div>

                    <div className="overflow-x-auto bg-base-100 rounded shadow mb-10">
                        <table className="table table-zebra">
                            <thead className="bg-base-300">
                                <tr><th>#</th><th>Movie</th><th>Theater</th><th>Date</th><th>Time</th><th>Price</th><th>Total Seats</th><th>Action</th></tr>
                            </thead>
                            <tbody>
                                {shows
                                    .filter((s) =>
                                        s.movieId?.title?.toLowerCase().includes(searchShow.toLowerCase()) ||
                                        s.theaterId?.name?.toLowerCase().includes(searchShow.toLowerCase())
                                    )
                                    .map((show, index) => (
                                        <tr key={show._id}>
                                            <td>{index + 1}</td>
                                            <td>{show.movieId?.title || "N/A"}</td>
                                            <td>{show.theaterId?.name || "N/A"} - {show.theaterId?.location || ""}</td>
                                            <td>{new Date(show.date).toLocaleDateString()}</td>
                                            <td>{show.time}</td>
                                            <td>{show.price}</td>
                                            <td>{show.theaterId?.totalSeats}</td>
                                            <td>
                                                <button className="btn btn-sm btn-error" onClick={() => handleDeleteShow(show._id)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}


            {showAddShowForm && (
                <AddShowForm
                    onClose={() => setShowAddShowForm(false)}  // 🔐 Hide form
                    onShowAdded={fetchShows}                  // 🔁 Refresh show list
                    movies={movies}                           // 🎬 Dropdown source
                    theaters={theaters}                       // 🏢 Dropdown source
                />
            )}



        </div>
    );

  

};

export default AdminDashboard;
