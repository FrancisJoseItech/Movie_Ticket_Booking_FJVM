 🎬 Movie Ticket Booking App (MERN Stack)

This is a full-stack Movie Ticket Booking Web App built using the MERN stack (MongoDB, Express, React, Node.js) with role-based access for users, admins, and theater owners.

## 🌐 Tech Stack

- **Frontend:** React + Tailwind + DaisyUI
- **Backend:** Node.js + Express + MongoDB
- **Authentication:** JWT (Bearer Tokens)
- **Image Upload:** Cloudinary (Movie posters)
- **Payments:** Stripe Checkout Integration
- **State Management:** Redux Toolkit
- **Routing:** React Router with Loader API
- **Notifications:** Sonner Toasts

## 📦 Features

### 👤 Users
- Browse all movies on HomePage
- View upcoming shows per movie
- Book seats with Stripe Checkout
- View and manage their bookings

### 👑 Admin
- Add/edit/delete movies
- Add/edit/delete theaters
- Manage all shows
- Register theater owners

### 🏢 Theater Owner
- View owned theaters and their shows
- Add shows to owned theaters only

## 🧩 Modules
- `UserModule`: Registration, Login, Profile, Booking
- `AdminModule`: Movie/Theater/Show Management
- `TheaterModule`: Theater & Show Management (Owner)
- `BookingModule`: Seat selection, payment, confirmation

## 🔐 Authentication
- JWT tokens issued on login
- Stored in Redux (and optionally in localStorage)
- Role-based routes and components

## 📷 Movie Poster Upload
- Posters uploaded to Cloudinary from admin dashboard
- Cloudinary URL saved in DB and rendered in MovieCard and Details page

## 💳 Stripe Integration
- Dynamically calculates total based on selected seats
- Redirects to Stripe Checkout
- On success, booking is confirmed and updated in DB

## 📁 Folder Structure
├── client/ │ ├── components/ │ │ ├── movie/ │ │ ├── seats/ │ │ ├── admin/ │ ├── pages/ │ ├── redux/ │ ├── services/ │ └── App.jsx ├── server/ │ ├── controllers/ │ ├── routes/ │ ├── model/ │ ├── middlewares/ │ └── index.js

## 🛠️ Future Enhancements
- Admin dashboard analytics
- Theater seating map UI
- Email notifications
- Booking history sorting
- Coupon codes

## Navbar Overview – Role-Based Dynamic Navigation
This Navbar component is built using React + Redux and dynamically updates based on the user's authentication status and role.

✅ Features Implemented
Dynamic link rendering based on user role:

Shows Login/Register for guests

Displays Dashboard, Profile, and Logout for authenticated users

Routes to the correct dashboard based on role (user, admin, theater_owner)

Logout button clears Redux auth state and redirects to home

Clean DaisyUI styling for a responsive look

🛠 Key Logic

// Pull user and auth status from Redux
const { user, isAuthenticated } = useSelector((state) => state.auth);

// Get dashboard route based on role
const getDashboardPath = () => {
  if (user?.role === "admin") return "/admin/dashboard";
  if (user?.role === "theater_owner") return "/theater/dashboard";
  return "/user/dashboard";
};

🔁 Conditional Rendering Logic
Auth Status	Role	Visible Links
Not Logged In	—	Shows, Login, Register
Logged In	user	Shows, Profile, User Dashboard, Logout
Logged In	admin	Admin Dashboard, Profile, Logout
Logged In	theater_owner	Theater Dashboard, Profile, Logout

🔐 Logout Behavior
Dispatches logout() from Redux

Shows toast notification using Sonner

Navigates back to /

const handleLogout = () => {
  dispatch(logout());
  toast.success("✅ Logged out successfully.");
  navigate("/");
};

🧠 Things to Add Later
Highlight active links using NavLink

Responsive toggle for mobile navigation

Add dropdown with role-based submenus

Add My Bookings, Add Show, Manage Users, etc.


### Issues
## 🎟️ Movie Booking App – Homepage Show Logic

### 🐞 Issue Fixed:
"Book Now" button wasn't appearing on movies with valid shows.

### ✅ What was wrong:
Populated `show.movieId` is an **object** (due to Mongoose `.populate()`), not a plain string. 
So `show.movieId === movie._id` was always failing.

### 🔧 Fix Implemented:
In `HomePage.jsx`, while mapping allMovies:

```js
const hasUpcoming = allShows.some(
  (show) =>
    show.movieId?._id?.toString() === movie._id.toString() &&
    new Date(show.date) > now
);
