import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/userServices"; // ✅ Axios login function

import { toast } from 'sonner';

const Login = () => {
  // ------------------ Local State ------------------
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ------------------ Redux + Navigation ------------------
  const dispatch = useDispatch(); // to update Redux state
  const navigate = useNavigate(); // to redirect after login

  // ------------------ Handle Form Submission ------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // 1️⃣ Confirm form submission
    console.log("🟡 Form submitted. Trying login for:", email);
  
    try {
        const res = await loginUser(email, password); // Call API
        const { token, user } = res.data;
      
        console.log("✅ Login successful:", res.data);
      
        dispatch(loginSuccess({ token, user }));
        toast.success("Login successful 🎉"); // ✅ Success toast
        navigate("/shows");
      
      } catch (error) {
        console.error("❌ Login failed:", error.response?.data?.message || error.message);
      
        toast.error(
          error.response?.data?.message || "Login failed. Please check credentials."
        ); // ✅ Error toast
      }
    }

  // ------------------ JSX Output ------------------
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-md">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="input input-bordered"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Field */}
            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="********"
                className="input input-bordered"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Submit Button */}
            <div className="form-control">
              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </div>
          </form>

          {/* Register Link */}
          <p className="text-sm text-center mt-4">
            Don’t have an account?{" "}
            <a href="/register" className="text-blue-500 underline">
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
