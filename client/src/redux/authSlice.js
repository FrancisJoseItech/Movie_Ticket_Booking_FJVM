// Import createSlice from Redux Toolkit to manage a piece of the global state
import { createSlice } from '@reduxjs/toolkit';

// Read token and user data from localStorage when app loads
// So even if user refreshes the page, they're still logged in
const tokenFromStorage = localStorage.getItem('token');
const userFromStorage = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user')) // stored as JSON string
  : null;

// Define initial state for the auth slice
const initialState = {
  user: userFromStorage,                  // user object (name, email, role, etc.)
  token: tokenFromStorage,                // JWT token
  isAuthenticated: !!tokenFromStorage,    // convert to boolean — true if token exists
};

// Create a slice of the Redux store called "auth"
const authSlice = createSlice({
  name: 'auth',          // name of this slice
  initialState,          // default state
  reducers: {
    // ✅ When login is successful
    loginSuccess: (state, action) => {
      state.user = action.payload.user;         // Save user info
      state.token = action.payload.token;       // Save token
      state.isAuthenticated = true;             // Mark as logged in

      // 🔒 Save to localStorage so it persists on refresh
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));

      // ✅ Log to console for debugging
      console.log("✅ Login Successful:", action.payload);
    },

    // 🔒 Logout action
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      console.log("🔓 Logged out successfully");
    },
  },
});

// Export the actions so we can call them in components (e.g. dispatch(loginSuccess))
export const { loginSuccess, logout } = authSlice.actions;

// Export the reducer so we can include it in the Redux store
export default authSlice.reducer;
