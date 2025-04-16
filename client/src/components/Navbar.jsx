import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice"; // ✅ Redux logout action
import { toast } from "sonner";

import DarkModeToggle from "../components/DarkModeToggle";


const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  

  // 🧠 Pulling auth state from Redux
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  console.log("🧠 Navbar - Authenticated:", isAuthenticated, "| User:", user);

  // 🔓 Logout Handler
  const handleLogout = () => {
    console.log("🔴 Logging out user:", user?.email);
    dispatch(logout());
    toast.success("✅ Logged out successfully.");
    navigate("/");
  };

  // 🧭 Get dashboard route based on role
  const getDashboardPath = () => {
    if (user?.role === "admin") return "/admin/dashboard";
    if (user?.role === "theater_owner") return "/theater/dashboard";
    return "/user/dashboard";
  };

  return (
    <div className="navbar bg-base-100 shadow-md px-4">
      
      <div className="flex-1">
        {/* 🎬 App Title */}
        <Link to="/" className="text-xl font-bold">🎬 FJVM</Link>
      </div>

       {/* 🌐 Right-side Controls */}
       <div className="flex gap-4 items-center">
        {/* 🌗 Theme Toggle */}
        <DarkModeToggle />
      
        {/* 🔓 Non-authenticated user links */}
        {!isAuthenticated && (
          <>
            <Link to="/shows" className="btn btn-ghost">Shows</Link>
            <Link to="/login" className="btn btn-ghost">Login</Link>
            <Link to="/register" className="btn btn-ghost">Register</Link>
          </>
        )}

        {/* 🔐 Authenticated user links */}
        {isAuthenticated && (
          <>
            {/* 🧍‍♂️ Welcome user */}
            <span className="text-sm hidden md:inline">
              Welcome, <span className="font-bold">{user?.name}</span>
            </span>

            {/* 🧭 Shared Links */}
            <Link to="/shows" className="btn btn-ghost">Shows</Link>
            {/* <Link to="/user/dashboard" className="btn btn-ghost">Profile</Link> */}
            <Link to={getDashboardPath()} className="btn btn-ghost">Dashboard</Link>

            {/* 🛑 Logout */}
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


