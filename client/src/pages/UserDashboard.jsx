// ✅ src/pages/UserDashboard.jsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserBookings } from "../services/bookingService"; // 📦 Booking API

const UserDashboard = () => {
  // 🔐 Get logged-in user from Redux store
  const { user } = useSelector((state) => state.auth);

  // 🎟️ Local state: List of bookings
  const [bookings, setBookings] = useState([]);

  // ⏳ Local state: Loading indicator
  const [loading, setLoading] = useState(true);

  // 📡 Fetch user bookings from backend
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        console.log("📡 Fetching bookings for user:", user?.email);
        setLoading(true); // ⏳ Start spinner when fetching

        const res = await getUserBookings(); // 📦 API call

        // 🔃 Sort bookings by show date (latest first)
        const sortedBookings = [...res.data].sort(
          (a, b) => new Date(b.show.date) - new Date(a.show.date)
        );

        console.log("🎫 Sorted bookings received:", sortedBookings);
        setBookings(sortedBookings);
      } catch (err) {
        console.error("❌ Error fetching bookings:", err.message);
      } finally {
        setLoading(false); // ✅ Stop spinner after success or failure
      }
    };

    // ✅ Only fetch if user is available
    if (user?.id) {
      fetchBookings();
    }
  }, [user]);

  // ⏳ Show loading spinner while fetching bookings
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {/* 🌀 Loading Spinner (from DaisyUI/Tailwind) */}
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // 🏁 After loading is complete, show dashboard content
  return (
    <div className="p-6">
      {/* 🧍‍♂️ User Profile Section */}
      <h2 className="text-2xl font-bold mb-4">👤 User Dashboard</h2>

      <div className="bg-base-200 p-4 rounded shadow mb-6">
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> {user?.role}</p>
      </div>

      {/* 🎟️ User Bookings Section */}
      <h3 className="text-xl font-semibold mb-2">🎟️ My Bookings</h3>

      <div className="space-y-3">
        {bookings.length === 0 ? (
          // 🚦 No bookings found - Show friendly empty state animation
          <div className="flex flex-col items-center justify-center text-center p-8">
            {/* 🎟️ Bouncing Ticket Emoji */}
            <div className="text-6xl animate-bounce mb-4">🎟️</div>

            {/* 📜 Friendly Message */}
            <p className="text-gray-500 text-lg">
              You don't have any bookings yet! <br />
              Start exploring shows and book your favorite one!
            </p>
          </div>
        ) : (
          // ✅ Bookings found - Loop through each booking and display nicely
          bookings.map((booking) => (
            <div
              key={booking._id}
              className="flex items-center gap-4 bg-base-100 p-4 rounded shadow border border-base-300"
            >
              {/* 🖼️ Movie Poster */}
              <img
                src={booking.show?.movieId?.posterUrl || "https://via.placeholder.com/150x220?text=No+Poster"} // ✅ Safe fallback if poster not available
                alt={booking.show?.movieId?.title || "Movie Poster"}
                className="w-24 h-36 object-cover rounded"
              />

              {/* 📄 Booking Details */}
              <div className="flex-1">
                {/* 🎬 Movie Title */}
                <h3 className="text-xl font-bold mb-1">{booking.show?.movieId?.title}</h3>

                {/* 🎭 Theater Name */}
                <p className="text-sm"><strong>Theater:</strong> {booking.show?.theaterId?.name}</p>

                {/* 📅 Show Date */}
                <p className="text-sm">
                  <strong>Date:</strong> {new Date(booking.show?.date).toLocaleDateString()}
                </p>

                {/* 🕒 Show Time */}
                <p className="text-sm"><strong>Time:</strong> {booking.show?.time}</p>

                {/* 🎟️ Booked Seats */}
                <p className="text-sm"><strong>Seats:</strong> {booking.seats.join(", ")}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
