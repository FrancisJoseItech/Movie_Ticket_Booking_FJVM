👤 User Guide – Movie Ticket Booking App
This document describes the user journey in the Movie Ticket Booking App. It walks through how a regular user interacts with the platform: from viewing movies to booking seats and making a payment.

🧭 Navigation Overview
Page	Path	Access
Home Page	/	Public
Shows Page	/shows	Public
Login Page	/login	Public
Register Page	/register	Public
Book Show Page	/book/:id	Authenticated
User Dashboard	/user/dashboard	Authenticated
👣 Step-by-Step User Flow
1️⃣ Visit the Home Page /
🎬 Displays all movies (even those without shows).

🔍 Search bar to filter movies by title.

📦 Each movie is rendered as a MovieCard with:

Poster

Genre, duration, language

📅 Message:

✅ Book Now if show exists

❌ No upcoming shows. Please check later. if no shows

📤 Props passed to MovieCard:

{
  movie: {
    _id, title, genre, duration, language,
    posterUrl, hasUpcomingShow
  }
}

📌 Clicking the poster image opens the movie details (future enhancement). 📌 Clicking Book Now redirects to /shows?movieId={movie._id}

2️⃣ View All Upcoming Shows /shows
Displays all future-dated shows

Each show includes:

🎬 Movie Poster

🏢 Theater Info

📅 Date, ⏰ Time, 💰 Price

🎟️ Book Now button

📌 Not Logged In → clicking Book Now redirects to /login

After login, user is redirected back to /book/:id

3️⃣ Login/Register Flow
Users must login before booking

Auth is stored in Redux (state.auth)

Tokens are stored via headers and used in protected routes

4️⃣ Book a Show /book/:showId
Displays:

🎬 Movie Info (title, poster, language)

🏢 Theater Info

📅 Show Time and Date

🪑 Dynamic Seat Grid (via SeatSelector)

🪑 SeatSelector Props:
{
  totalSeats,          // from theater
  bookedSeats,         // from show
  selectedSeats,       // managed locally
  onSeatClick(seat)    // toggles selection
}


💳 Click “Book Now”:

Creates a Stripe Checkout Session

Redirects user to Stripe for payment

5️⃣ Payment Flow
💳 Stripe payment is integrated

✅ After successful payment, user is redirected to /payment-success

Booking record is created in backend

6️⃣ User Dashboard /user/dashboard
Displays:

🎟️ List of booked shows

🪑 Booked seats

🏢 Theater and Movie info

📅 Booking time

✅ Payment status

📌 User data is fetched using GET /bookings with JWT token in headers

✅ Summary
🔐 Users can view movies and shows without login.

🎟️ Booking requires login + Stripe payment.

🧾 All bookings are stored and visible in dashboard.