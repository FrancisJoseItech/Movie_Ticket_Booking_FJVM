// 📁 src/pages/BookShowPage.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";

// 📦 Import service functions instead of direct axios
import { getPublicShows, createCheckoutSession } from "../services/showServices";

// 🔑 Load Stripe with publishable key from .env (via Vite)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const BookShowPage = () => {
  // 🎯 Extract showId from route params
  const { showId } = useParams();
  const navigate = useNavigate();

  // 🎬 State to hold show details
  const [show, setShow] = useState(null);

  // 🎟️ State for selected seats by the user
  const [selectedSeats, setSelectedSeats] = useState([]);

  // 🌀 Loader state
  const [loading, setLoading] = useState(true);

  // 📥 Fetch show info on mount
  useEffect(() => {
    const fetchShow = async () => {
      try {
        const data = await getPublicShows(); // ✅ Use service function
        const found = data.find((s) => s._id === showId);
        setShow(found);
        console.log("🎬 Loaded show:", found);
      } catch (err) {
        console.error("❌ Error loading show:", err.message);
        toast.error("Failed to load show. Try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchShow();
  }, [showId]);

  // 🎯 Toggle seat selection
  const handleSeatClick = (seat) => {
    setSelectedSeats((prev) =>
      prev.includes(seat)
        ? prev.filter((s) => s !== seat) // ❌ Deselect seat
        : [...prev, seat]               // ✅ Add seat to selection
    );
    console.log("🪑 Seat clicked:", seat);
  };

  // 💳 Trigger Stripe checkout on click
  const handleBookNow = async () => {
    if (selectedSeats.length === 0) {
      toast.warning("Please select at least one seat.");
      return;
    }

    console.log("🧾 Proceeding to Stripe with:", {
      showId,
      selectedSeats,
      totalPrice: selectedSeats.length * show.price,
    });

    try {
      const { id: sessionId } = await createCheckoutSession(showId, selectedSeats); // ✅ Use service
      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      console.error("❌ Stripe redirect failed:", err.message);
      toast.error("Failed to initiate payment. Try again.");
    }
  };

  // 🌀 Loading screen
  if (loading) return <div className="p-6">⏳ Loading show details...</div>;

  // 🚫 Show not found
  if (!show) return <div className="p-6 text-red-500">🚫 Show not found</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* 🎬 Show Details */}
      <h1 className="text-3xl font-bold mb-2">🎬 {show.movieId?.title || "Movie Show"}</h1>
      <p className="mb-4 text-gray-600">
        🏢 <strong>{show.theaterId?.name}</strong> | 📅 {show.date} | ⏰ {show.time} | 💰 ₹{show.price} per seat
      </p>

          {/* 🪑 Seat Grid */}
          {/* 🪑 Dynamic Seat Grid Based on Theater Capacity */}
          <div className="grid grid-cols-8 gap-2 mb-6">
              {[...Array(show?.theaterId?.totalSeats || 40)].map((_, i) => {
                  const seat = `S${i + 1}`;
                  const isBooked = show.bookedSeats.includes(seat);
                  const isSelected = selectedSeats.includes(seat);

                  return (
                      <button
                          key={seat}
                          className={`border px-4 py-2 rounded font-medium ${isBooked
                                  ? "bg-red-400 text-white cursor-not-allowed"
                                  : isSelected
                                      ? "bg-green-500 text-white"
                                      : "hover:bg-green-100"
                              }`}
                          onClick={() => handleSeatClick(seat)}
                          disabled={isBooked}
                      >
                          {seat}
                      </button>
                  );
              })}
          </div>

      {/* 💳 Pay & Book Button */}
      <button
        className="btn btn-primary w-full"
        onClick={handleBookNow}
        disabled={selectedSeats.length === 0}
      >
        💳 Pay ₹{selectedSeats.length * show.price} & Book Now
      </button>
    </div>
  );
};

export default BookShowPage;
