import { Link, useNavigate, useLocation } from "react-router-dom"; // 🧭 Import location to detect the route
import { useSelector, useDispatch } from "react-redux"; // 🧠 For Redux state
import { logout } from "../redux/authSlice"; // 🔒 Redux logout action
import { toast } from "sonner"; // 📣 Toast notifications

import DarkModeToggle from "../components/DarkModeToggle"; // 🌗 Theme toggle component

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation(); // 🧭 Detect current URL route

  // 🧠 Grab authentication state from Redux store
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  console.log("🧠 Navbar - Authenticated:", isAuthenticated, "| User:", user);

  // 🔓 Logout handler function
  const handleLogout = () => {
    console.log("🔴 Logging out user:", user?.email);
    dispatch(logout()); // 🧼 Clears Redux state
    toast.success("✅ Logged out successfully."); // 🔔 Notify user
    navigate("/"); // 🔁 Redirect to homepage
  };

  // 🧭 Helper: Get dashboard route based on user's role
  const getDashboardPath = () => {
    if (user?.role === "admin") return "/admin/dashboard";
    if (user?.role === "theater_owner") return "/theater/dashboard";
    return "/user/dashboard";
  };

  return (
    <div className="navbar bg-base-100 shadow-md px-4">
      {/* 👈 Left: Brand Logo */}
      <div className="flex-1 page-load-fadein inline-block">
        {/* 🎬 App Title - 'FJVM' */}
        {/* ✨ INTERACTION: This element will scale and change color when hovered */}
        {/* 🚫 NOTE: No animation happens automatically on page load */}
        <Link
          to="/"
          className="text-xl font-bold transform scale-100 transition-transform duration-300 inline-block relative hover-roll-move"
        >
          🎬 FJVM
        </Link>
      </div>

      {/* 👉 Right: Navigation Links and Controls */}
      <div className="flex gap-4 items-center">
        {/* 🌗 Theme toggle button (dark/light mode) */}
        <DarkModeToggle />

        {/* 👥 Non-Authenticated User Links */}
        {!isAuthenticated && (
          <>
            <Link to="/shows" className="btn btn-ghost">Shows</Link>
            <Link to="/login" className="btn btn-ghost">Login</Link>
            <Link to="/register" className="btn btn-ghost">Register</Link>
          </>
        )}

        {/* 🔐 Authenticated User Links */}
        {isAuthenticated && (
          <>
            {/* 👋 Welcome message with user's name */}
            <span className="text-sm hidden md:inline">
              Welcome, <span className="font-bold">{user?.name}</span>
            </span>

            {/* 🎟️ Show page */}
            <Link to="/shows" className="btn btn-ghost">Shows</Link>

            {/* 🧭 Dashboard based on user role */}
            <Link to={getDashboardPath()} className="btn btn-ghost">Dashboard</Link>

            {/* 🔓 Logout Button */}
            <button
              onClick={handleLogout}
              className="btn btn-outline btn-sm"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
