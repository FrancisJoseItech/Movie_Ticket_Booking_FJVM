

🎬 Movie Ticket Booking App - Backend (MERN Stack)
This is the backend API for a full-featured Movie Ticket Booking application built using Node.js, Express, MongoDB, and JWT-based authentication. It supports Users, Admins, and Theater Owners with distinct permissions.

🔧 Tech Stack
Node.js + Express.js – RESTful API

MongoDB + Mongoose – Database

JWT (Bearer Token) – Authentication

Role-Based Access – User, Admin, Theater Owner

Postman – API Testing

✅ Completed Features
👥 User Module
Endpoint	Access	Description
POST /api/user/register	Public	Register a new user
POST /api/user/login	Public	Login and get token
GET /api/user/profile	Protected	View logged-in user's profile
POST /api/user/logout	Public	Logout user
GET /api/user/allusers	Admin Only	View all users


🎬 Movie Module (Admin)
Endpoint	Access	Description
POST /api/movies/addmovie	Admin	Add a new movie
GET /api/movies	Public	View all movies
PUT /api/movies/:id	Admin	Update a movie
DELETE /api/movies/:id	Admin	Delete a movie


🏢 Theater Module (Admin + Theater Owner)
Endpoint	Access	Description
POST /api/theaters/addtheater	Admin / Theater Owner	Add a new theater
GET /api/theaters	Public	Get all theaters
PUT /api/theaters/update/:id	Admin	Update a theater
DELETE /api/theaters/delete/:id	Admin	Delete a theater
GET /api/theaters/my-theaters	Theater Owner	View own theaters
GET /api/theaters/owner/:ownerId	Admin	View theaters by owner


🎟️ Show Module (Admin + Theater Owner)
Endpoint	Access	Description
POST /api/shows/addshow	Admin / Theater Owner	Add a new show
GET /api/shows	Admin	View all shows
GET /api/shows/public	Public	Public shows with movie & theater info


🧾 Booking Module (User)
Endpoint	Access	Description
POST /api/bookings/book	User	Book seats for a show


🔐 Authentication
We use Bearer Token Auth (JWT) for all protected routes:

Login Response:
json
Copy
Edit
{
  "message": "Login successful",
  "token": "<JWT-TOKEN>",
  "expiresAt": "2025-04-05T14:00:00.000Z",
  "user": {
    "id": "...",
    "name": "...",
    "role": "admin"
  }
}

Send the token with each request:

makefile


Authorization: Bearer <token>


📦 MongoDB Collections Overview

Users

name, email, password, role, theatersOwned[]

Movies

title, genre, duration, posterUrl, description

Theaters

name, location, totalSeats, owner

Shows

movieId, theaterId, date, time, price, bookedSeats[]

Bookings

userId, showId, seats[], totalAmount, bookingDate

🚀 How to Run
npm install
npm start

Ensure .env file has:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret
PORT=9000

🧪 API Testing with Postman
Login → copy token

Set token in headers:

Authorization: Bearer <token>

Access protected routes (movies, theaters, bookings, etc.)

📝 Planned Enhancements (Optional)
Feature	Description
🕘 GET /api/bookings/my-bookings	View booking history for logged-in user
📋 GET /api/bookings	Admin-only: View all bookings
❌ DELETE /api/bookings/:id	Cancel a booking (optional)
🪑 GET /api/shows/:id/seats	Seat map endpoint for frontend (optional)

👤 Roles
User – Book shows, view profile

Theater Owner – Add theaters, shows, view own theaters

Admin – Full control (users, movies, theaters, shows)

🧠 Learning Goal
This project was built as a hands-on learning experience in:

REST API design

Role-based access control

Clean modular structure

Real-world backend flow



## 🔐 Setting Cookie After Login- Alternate method

res.cookie('token', token, {
  httpOnly: true,
  secure: false,
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

httpOnly: Prevents client-side access to token (security)

secure: Only over HTTPS (set true in production)

sameSite: Prevents cross-site requests (CSRF)

maxAge: Expiration time of 7 days