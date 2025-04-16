// ✅ src/pages/Userdashboard.jsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserBookings } from "../services/bookingService"; // 📦 Booking API

const UserDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [bookings, setBookings] = useState([]);

  //📡 Fetch user bookings from backend
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        console.log("📡 Fetching bookings for user:", user?.email);
        const res = await getUserBookings();

        // 🔃 Sort bookings by show date (latest first)
        const sortedBookings = [...res.data].sort(
          (a, b) => new Date(b.show.date) - new Date(a.show.date)
        );

        console.log("🎫 Sorted bookings:", sortedBookings);
        setBookings(sortedBookings);
      } catch (err) {
        console.error("❌ Error fetching bookings:", err.message);
      }
    };

    if (user?.id) {
      fetchBookings();
    }
  }, [user]);



  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">👤 User Dashboard</h2>

      {/* 🧾 Profile Section */}
      <div className="bg-base-200 p-4 rounded shadow mb-6">
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> {user?.role}</p>
      </div>

      {/* 🎟️ My Bookings Section */}
      <h3 className="text-xl font-semibold mb-2">🎟️ My Bookings</h3>

      <div className="space-y-3">
        {bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-base-100 p-4 rounded shadow border border-base-300"
            >
              {/* ✅ Movie ID or Movie Name (if populated) */}
              <p><strong>Movie:</strong> {booking.show?.movieId?.title}</p>

              {/* ✅ Theater ID */}
              <p><strong>Theater:</strong> {booking.show?.theaterId?.name}</p>

              {/* ✅ Date formatted nicely */}
              <p>
                <strong>Date:</strong>{" "}
                {new Date(booking.show?.date).toLocaleDateString()}
              </p>

              {/* ✅ Time */}
              <p><strong>Time:</strong> {booking.show?.time}</p>

              {/* ✅ Booked Seats */}
              <p><strong>Seats:</strong> {booking.seats.join(", ")}</p>
            </div>
          ))
        )}
      </div>
      
    </div>
  );
};

export default UserDashboard;
