import { Outlet } from "react-router-dom"; // to render nested routes
import Navbar from "../components/Navbar"; // adjust if your Navbar is elsewhere

const UserLayout = () => {
  return (
    <div>
      {/* ✅ Common Navbar across pages */}
      <Navbar />

      {/* ✅ This is where page-specific content will appear */}
      <Outlet />

      {/* ✅ Optional: Footer can go here */}
    </div>
  );
};

export default UserLayout;
