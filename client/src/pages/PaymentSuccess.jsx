import React, { useEffect, useRef } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { toast } from "sonner"; // 🔔 Toast notifications
import { confirmBooking } from "../services/bookingService"; // 📡 Import API logic

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams(); // 🔍 Parse URL query parameters
  const navigate = useNavigate();

  // 🧠 Extract query params
  const showId = searchParams.get("showId"); // 🎟️ Get show ID from URL
  const seats = searchParams.get("seats")?.split(",") || []; // 🪑 Get seats from URL

  // 🛡️ Prevent booking from being called multiple times
  const hasBooked = useRef(false);

  // 🧠 Trigger backend booking confirmation once on page load
  useEffect(() => {
    const book = async () => {
      try {
        console.log("📦 Booking with showId:", showId, "seats:", seats); // 🔍 Debug input

        await confirmBooking(showId, seats); // 📡 Call service to confirm booking

        toast.success("🎉 Your booking has been confirmed!"); // ✅ Toast success
      } catch (err) {
        console.error("❌ Booking confirmation failed:", err.message); // ❌ Console error
        toast.error("Booking failed. Please contact support.");
        navigate("/shows"); // 🔁 Optional redirect
      }
    };

    // 🛑 Prevent double booking due to re-renders or double redirects
    if (showId && seats.length > 0 && !hasBooked.current) {
      hasBooked.current = true; // ✅ Mark as booked
      book(); // 🔁 Trigger booking confirmation
    }
  }, [showId, seats, navigate]);

  return (
    <div className="p-6 max-w-3xl mx-auto text-center">
      {/* 🎉 Success Header */}
      <h1 className="text-3xl font-bold text-green-600 mb-4">🎉 Payment Successful!</h1>
      <p className="text-lg mb-2">
        Thank you for booking with <strong>FJVM</strong>! 🎟️
      </p>

      {/* 📝 Booking Info */}
      <div className="bg-base-200 p-4 rounded shadow mt-4 mb-6">
        <h2 className="text-xl font-semibold mb-2">🎬 Booking Details</h2>
        <p><strong>Show ID:</strong> {showId}</p>
        <p><strong>Seats Booked:</strong> {seats.join(", ")}</p>
      </div>

      {/* 🔗 Action */}
      <Link to="/shows" className="btn btn-primary mt-4">🎬 View More Shows</Link>
    </div>
  );
};

export default PaymentSuccess;
