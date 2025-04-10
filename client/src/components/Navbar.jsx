import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="navbar bg-base-100 shadow-md px-4">
      <div className="flex-1">
        <Link to="/" className="text-xl font-bold">🎬 Movie App</Link>
      </div>
      <div className="flex gap-4">
        <Link to="/login" className="btn btn-ghost">Login</Link>
        <Link to="/register" className="btn btn-ghost">Register</Link>
      </div>
    </div>
  );
};

export default Navbar;
