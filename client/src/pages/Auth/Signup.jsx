import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { registerUser } from "../../services/userServices"; // Your API call

const Signup = () => {
  // 🌟 Local state for form inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🚀 Navigation
  const navigate = useNavigate();

  // 🔐 Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
  
    console.log("🟡 Registering with:", { name, email, password }); // Debug input
  
    try {
      const role = "user"; // ✅ Setting role explicitly for registration
      const res = await registerUser({ name, email, password, role }); // ✅ Proper format (object) // ✅ Send role to backend
      console.log("✅ Registration success:", res.data); // Debug API success
  
      // Show toast notification
      toast.success("🎉 Registration successful! Please log in.");
  
      // Navigate to login page after successful signup
      navigate("/login");
    } catch (error) {
      console.error("❌ Registration failed:", error.response?.data?.message || error.message); // Log the exact error
      toast.error("Registration failed. Please try again.");
    }
  };

  // 🧾 JSX Output
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-lg">
        <div className="card-body">
          {/* 🏷️ Title */}
          <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
  
          {/* 🧾 Register Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 🙍‍♂️ Name Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="input input-bordered w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
  
            {/* ✉️ Email Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="input input-bordered w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
  
            {/* 🔐 Password Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="********"
                className="input input-bordered w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
  
            {/* 🎯 Submit Button */}
            <div className="form-control">
              <button type="submit" className="btn btn-primary w-full">
                Register
              </button>
            </div>
          </form>
  
          {/* 🔗 Login Redirect */}
          <p className="text-sm text-center mt-6">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 underline">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
