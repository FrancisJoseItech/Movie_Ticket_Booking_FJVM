import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux"; // 🔐 Logged-in user
import { useLoaderData } from "react-router-dom"; // 📦 Data from loader
import AddShowForm from "../../components/admin/AddShowForm"; // 🎬 Show form
import { toast } from "sonner";
import { getPublicShows } from "../../services/showServices"; // 📡 API to get shows

const TheaterOwnerDashboard = () => {
  const { user } = useSelector((state) => state.auth); // 📥 Logged-in user info
  const { theaters: ownedTheaters, movies: allMovies } = useLoaderData(); // 📥 Props from loader

  const [showFormVisible, setShowFormVisible] = useState(false); // 🔘 Toggle AddShowForm
  console.log("🎭 Logged-in user:", user);
  console.log("🏟️ Owned Theaters from loader:", ownedTheaters);
  console.log("🎬 Movies from loader:", allMovies);

  const [allShows, setAllShows] = useState([]); // 🎟️ All fetched shows

  const [loadingShows, setLoadingShows] = useState(true); // 🚦 Spinner control

  // 🧠 Fetch shows (used inside useEffect and after add)
  const fetchShows = async () => {
    try {
      setLoadingShows(true); // 🛜 Start loading
      const data = await getPublicShows();
      setAllShows(data);
      console.log("🎟️ Refreshed show list:", data);
    } catch (err) {
      console.error("❌ Failed to fetch shows:", err.message);
      toast.error("Could not fetch shows.");
    } finally {
      setLoadingShows(false); // 🛑 Stop loading
    }
  };

  useEffect(() => {
    fetchShows(); // 🚀 Run once on mount
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">🎭 Theater Owner Dashboard</h1>

      {/* 🧍 Welcome Info */}
      <div className="bg-base-200 p-4 rounded shadow mb-6">
        <p>Welcome, <span className="font-bold">{user?.name}</span>!</p>
        <p>Role: <span className="capitalize">{user?.role}</span></p>
      </div>

      <h2 className="text-xl font-semibold mb-3">🏢 Your Theaters & Shows</h2>

      {/* 🎭 Theater List Section */}
      {loadingShows ? (
        // 🚦 While shows are loading, show a spinner
        <div className="flex justify-center my-10">
          <span className="loading loading-spinner loading-lg"></span> {/* ⏳ Tailwind DaisyUI Spinner */}
        </div>
      ) : (
        // ✅ After loading complete
        <>
          {ownedTheaters.length === 0 ? (
            // ❗ No theaters owned
            <p className="text-gray-500">No theaters owned yet.</p>
          ) : (
            // 🎟️ Loop through owned theaters
            <div className="space-y-6">
              {ownedTheaters.map((theater) => {
                // 🎯 Filter shows belonging to this theater
                const showsOfThisTheater = allShows.filter(
                  (show) => show.theaterId?._id === theater._id
                );

                return (
                  <div key={theater._id} className="border p-4 rounded shadow-sm">
                    {/* 🏢 Theater Info */}
                    <h3 className="text-lg font-semibold mb-2">
                      🏢 {theater.name} — {theater.location} ({theater.totalSeats} seats)
                    </h3>

                    {/* 🎟️ Show List for This Theater */}
                    {showsOfThisTheater.length > 0 ? (
                      <ul className="mt-2 pl-4 list-none space-y-2">
                        {showsOfThisTheater.map((show) => {
                          // 🧠 Debugging Poster URL
                          console.log("🎞️ Poster URL for show:", show.movieId?.posterUrl);

                          return (
                            <li key={show._id} className="flex items-center gap-4">
                              {/* 🎞️ Poster Thumbnail */}
                              {show.movieId?.posterUrl && (
                                <img
                                  src={show.movieId.posterUrl}
                                  alt={show.movieId.title}
                                  className="w-12 h-16 object-cover rounded"
                                />
                              )}

                              {/* 📋 Show Info */}
                              <div className="flex flex-col">
                                <span className="font-semibold">{show.movieId?.title}</span>
                                <span className="text-xs text-gray-600">
                                  📅 {new Date(show.date).toLocaleDateString()} | 🕒 {show.time} | 💵 ₹{show.price}
                                </span>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      // ❗ No shows yet
                      <p className="text-sm text-red-500 mt-1">No shows added yet.</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ➕ Add Show Button */}
      <div className="mt-6">
        <button
          className="btn btn-primary"
          onClick={() => {
            console.log("🧩 Showing AddShowForm");
            setShowFormVisible(true);
          }}
        >
          ➕ Add New Show
        </button>
      </div>

      {/* 📋 AddShowForm Modal */}
      {showFormVisible && (
        <AddShowForm
          movies={allMovies} // 📤 Passing movies list
          theaters={ownedTheaters} // 📤 Passing owned theaters
          onClose={() => {
            console.log("❌ Closing AddShowForm");
            setShowFormVisible(false);
          }}
          onShowAdded={() => {
            toast.success("✅ Show added successfully!");
            fetchShows(); // 🔄 Refresh shows after adding new
            setShowFormVisible(false); // 🔙 Close form
          }}
        />
      )}
    </div>
  );
};

export default TheaterOwnerDashboard;
