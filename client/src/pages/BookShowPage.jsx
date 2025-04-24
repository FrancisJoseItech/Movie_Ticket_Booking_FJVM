// 📁 src/pages/BookShowPage.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner"; // 🔔 Toast notifications
import { useSelector } from "react-redux"; // 🔐 Get user info from Redux
import SeatSelector from "../components/seats/SeatSelector"; // 🪑 Seat selector component

// 📡 Backend API services
import { getShowById, createCheckoutSession } from "../services/showServices";

// 💳 Stripe integration
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY); // ✅ Replace with your Stripe key

const BookShowPage = () => {
  // 🎯 Extract show ID from URL
  const { showId } = useParams();
  const navigate = useNavigate();

  // 🔐 Auth info from Redux store
  const { user } = useSelector((state) => state.auth);

  // 🎬 Store fetched show details
  const [show, setShow] = useState(null);

  // 🪑 Seats selected by user
  const [selectedSeats, setSelectedSeats] = useState([]);

  // ⚙️ Loader state
  const [loading, setLoading] = useState(true);

  // 🔐 Redirect to login if user not logged in
  useEffect(() => {
    if (!user) {
      toast.warning("Please login to book your seat.");
      navigate("/login", {
        state: { redirectTo: `/book/${showId}` },
      });
    }
  }, [user, navigate, showId]);

  // 📥 Fetch show details on mount
  useEffect(() => {
    const fetchShow = async () => {
      try {
        const data = await getShowById(showId);
        console.log("🎬 Loaded show details:", data);
        setShow(data);
      } catch (err) {
        console.error("❌ Error loading show:", err.message);
        toast.error("Failed to load show. Try again.");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchShow();
  }, [showId, user]);

  // 🎯 Handle user clicking a seat
  const handleSeatClick = (seat) => {
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
    console.log("🪑 Seat clicked:", seat);
  };

  // 💳 Stripe checkout
  const handleBookNow = async () => {
    if (selectedSeats.length === 0) {
      toast.warning("Please select at least one seat.");
      return;
    }

    console.log("💳 Booking initiated:", {
      showId,
      selectedSeats,
      totalPrice: selectedSeats.length * show.price,
    });

    try {
      const { id: sessionId } = await createCheckoutSession(showId, selectedSeats);
      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      console.error("❌ Stripe session failed:", err.message);
      toast.error("Failed to initiate payment.");
    }
  };

  // 🌀 If still loading
  if (loading) return <div className="p-6">⏳ Loading show details...</div>;

  // 🚫 If show not found
  if (!show) return <div className="p-6 text-red-500">🚫 Show not found</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* 🎬 Show Header */}
      <h1 className="text-3xl font-bold mb-2">
        🎬 {show.movieId?.title || "Movie Show"}
      </h1>

      {/* 🖼️ Poster */}
      <img
        src={show.movieId?.posterUrl || "/default-movie.jpg"}
        alt="Poster"
        className="w-full max-w-xs rounded shadow mb-4"
      />

      {/* 📅 Show Details */}
      <p className="mb-4 text-gray-600">
        🏢 <strong>{show.theaterId?.name}</strong> | 📅 {new Date(show.date).toLocaleDateString()} | ⏰ {show.time} | 💰 ₹{show.price} per seat
      </p>

      {/* 🪑 Seat Selector */}
      <SeatSelector
        totalSeats={show.theaterId?.totalSeats || 100} // 📤 Prop: total theater capacity
        bookedSeats={show.bookedSeats || []}           // 📤 Prop: seats already booked
        selectedSeats={selectedSeats}                  // 📤 Prop: user's selected seats
        onSeatClick={handleSeatClick}                  // 📤 Prop: callback for toggling
      />

      {/* 💳 Confirm Booking */}
      <button
        onClick={handleBookNow}
        disabled={selectedSeats.length === 0}
        className="btn btn-primary w-full"
      >
        💳 Pay ₹{selectedSeats.length * show.price} & Book Now
      </button>
    </div>
  );
};

export default BookShowPage;
