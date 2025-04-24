// 📁 src/components/seats/SeatSelector.jsx

import React from "react";

// 🧾 PROPS:
// ✅ totalSeats: number - Total number of seats in the theater (e.g., 120)
// ✅ bookedSeats: array - Already booked seat labels like ['S7', 'S8']
// ✅ selectedSeats: array - Seats currently selected by the user
// ✅ onSeatClick: function - Callback to handle click on a seat (toggle selection)

const SeatSelector = ({
  totalSeats = 40,
  bookedSeats = [],
  selectedSeats = [],
  onSeatClick,
}) => {
  // 🛠️ Generate seat labels: ["S1", "S2", ..., "S120"]
  const seatArray = [...Array(totalSeats)].map((_, i) => `S${i + 1}`);

  console.log("🪑 Total seats rendered:", totalSeats);
  console.log("🔴 Booked seats:", bookedSeats);
  console.log("🟢 Selected seats:", selectedSeats);

  return (
    <div className="grid grid-cols-8 gap-2 mb-6">
      {seatArray.map((seat) => {
        const isBooked = bookedSeats.includes(seat); // 🚫 Already booked
        const isSelected = selectedSeats.includes(seat); // ✅ Selected by user

        return (
          <button
            key={seat}
            onClick={() => {
              if (!isBooked) {
                console.log(`🖱️ Seat clicked: ${seat}`);
                onSeatClick(seat); // 🔁 Trigger parent's selection logic
              }
            }}
            disabled={isBooked}
            className={`border px-4 py-2 rounded font-medium ${
              isBooked
                ? "bg-red-400 text-white cursor-not-allowed"  // 🔴 Booked
                : isSelected
                ? "bg-green-500 text-white"                  // 🟢 Selected
                : "hover:bg-green-100"                        // ⚪ Default
            }`}
          >
            {seat}
          </button>
        );
      })}
    </div>
  );
};

export default SeatSelector;
