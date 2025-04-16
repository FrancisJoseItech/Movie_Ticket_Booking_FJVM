import React from "react";
import { useSelector } from "react-redux";

const TheaterDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  console.log("🎭 TheaterDashboard - Logged in user:", user);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">🎭 Theater Dashboard</h1>
      <p>Welcome, {user?.name || "Theater Owner"}!</p>
      {/* 🎬 Future theater management tools will go here */}
    </div>
  );
};

export default TheaterDashboard;