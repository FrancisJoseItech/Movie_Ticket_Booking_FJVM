🎬 Movie Ticket Booking App (MERN Stack)
Welcome to the Movie Ticket Booking App — a full-stack web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). This platform allows users to browse movies, view upcoming shows, book tickets with seat selection, and complete secure payments via Stripe.

🌐 Tech Stack
Layer	Technology
Frontend	React + Tailwind + DaisyUI
State Mgmt	Redux Toolkit
Routing	React Router DOM
Backend	Node.js + Express
Database	MongoDB + Mongoose
Auth	JWT (Bearer Tokens)
Payments	Stripe Checkout
Notifications	react-toastify / sonner
🧑‍💻 Roles Supported
Role	Features
User	Browse movies, view shows, book tickets, and make payments
Admin	Manage movies, theaters, shows; assign theater owners
Theater Owner	Manage their own theaters and shows
🎯 Key Features
🔐 Secure login/register (JWT-based)

🎞️ Display all movies on homepage

🔍 Search movies by title

🎟️ View all upcoming shows

🪑 Seat selection with dynamic layout

💳 Stripe-based secure payments

📋 Admin dashboard with full control

🎭 Theater owner dashboard with own theaters/shows

📦 Role-based access control with conditional rendering

📦 root
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/          # Home, Login, Register, Dashboard, BookShowPage, etc.
│   │   ├── components/     # Reusable UI: Navbar, MovieCard, SeatSelector
│   │   ├── services/       # API calls: movieServices, showServices, etc.
│   │   └── store/          # Redux store setup
├── server/                 # Node.js + Express backend
│   ├── controllers/        # All controller logic
│   ├── model/              # Mongoose schemas
│   ├── routes/             # Route definitions
│   ├── middlewares/        # Auth + error handling
│   └── utils/              # Stripe, Cloudinary, etc.

🚀 Setup & Installation
Prerequisites
Node.js

MongoDB

Stripe Account

Cloudinary (for movie posters)

# Backend

cd server
npm install
npm run dev

# Frontend

cd client
npm install
npm run dev

