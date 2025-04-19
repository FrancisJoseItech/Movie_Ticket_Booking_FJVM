

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


## 📘 Full Stack Interaction Notes: AdminDashboard, AddMovieForm, adminServices
🔷 1. AdminDashboard.jsx – Parent Component
💡 Purpose:
Displays the admin panel UI, shows all movies, allows admin to:

View movie list

Add new movie (via modal form)

Edit existing movie

Delete a movie

🔗 Key State Variables:
Variable	Purpose
movies	Stores the list of movies from backend
showAddMovie	Boolean: show or hide the Add/Edit form
selectedMovie	Object: holds data of movie being edited (or null for Add)
⚙️ Key Functions:
✅ fetchMovies()

const data = await getAllMovies();  // Fetch from backend
setMovies(data);                    // Store in local state
Called on first render (useEffect) and after Add/Edit/Delete
Makes GET request via adminServices.js

🗑️ handleDelete(movieId)

await deleteMovie(movieId); // API call to delete
fetchMovies();              // Refresh list after deletion
🔐 handleFormClose()

setShowAddMovie(false);     // Hide the form
setSelectedMovie(null);     // Reset edit movie state
📦 Props Passed to AddMovieForm

<AddMovieForm
  onClose={handleFormClose}
  onMovieAdded={fetchMovies}
  selectedMovie={selectedMovie}
/>
Prop	Sent to AddMovieForm	Meaning
onClose	handleFormClose()	Used to hide the form
onMovieAdded	fetchMovies()	Refresh the movie list
selectedMovie	movie or null	Determines if Edit or Add mode

🔷 2. AddMovieForm.jsx – Reusable Form Component
💡 Purpose:
Used to Add or Edit a movie

Displays input fields + poster upload

On submit, sends data to backend and informs parent

🧠 Local State Variables:
Variable	Purpose
formData	Holds all text field values (title, genre, etc.)
poster	File object of uploaded image
isEditing	Boolean: derived from whether selectedMovie is present
🧩 Pre-filling form on Edit

useEffect(() => {
  if (selectedMovie) {
    setFormData({
      title: selectedMovie.title,
      ...
    });
  }
}, [selectedMovie]);
Runs once when editing is triggered — fills fields with movie details

🧾 handleSubmit()

if (isEditing) {
  await updateMovieWithPoster(...);   // PUT
} else {
  await addMovieWithPoster(...);      // POST
}
onMovieAdded(); // 🔁 Call parent to refresh list
onClose();      // ❌ Call parent to close form
📤 File Upload

const payload = new FormData();
Object.entries(formData).forEach(([k, v]) => payload.append(k, v));
payload.append("poster", posterFile);
FormData is used to combine text + image in one request

🔷 3. adminServices.js – API Calls
This file contains the actual axios requests sent to the backend.

📡 getAllMovies()

GET /movies/
→ Returns list of movies
→ Called by fetchMovies() in AdminDashboard
🆕 addMovieWithPoster()

POST /movies/addmovie
Content-Type: multipart/form-data
Body: formData + poster file

Called by: AddMovieForm → handleSubmit()
✏️ updateMovieWithPoster()

PUT /movies/:id
Content-Type: multipart/form-data
Body: formData + new poster (if provided)

Called by: AddMovieForm → handleSubmit()
🗑️ deleteMovie()

DELETE /movies/:id

Called by: AdminDashboard → handleDelete()
🔄 End-to-End Interaction Flow
➕ Add Movie Flow

User clicks ➕ Add New Movie
↓
setShowAddMovie(true)
↓
<AddMovieForm /> appears
↓
User fills form & clicks Submit
↓
handleSubmit() calls addMovieWithPoster()
↓
API request POST /movies/addmovie
↓
Backend adds movie & returns success
↓
onMovieAdded() → fetchMovies() → refresh list
↓
onClose() → closes form

✏️ Edit Movie Flow

User clicks ✏️ Edit on a movie
↓
selectedMovie set → passed to <AddMovieForm />
↓
Form auto-fills via useEffect()
↓
User updates fields & submits
↓
handleSubmit() calls updateMovieWithPoster()
↓
API PUT /movies/:id
↓
Movie updated
↓
onMovieAdded() → fetchMovies()
↓
onClose() → closes form

🗑️ Delete Movie Flow

User clicks 🗑️ Delete
↓
handleDelete() → calls deleteMovie(movieId)
↓
API DELETE /movies/:id
↓
fetchMovies() → updates state
↓
List refreshed


✅ Final Concepts Table
Concept	Description
Props	Data/functions passed from parent to child
useEffect	Lifecycle hook to run logic on load or when props change
useState	Creates and updates local state inside a component
FormData	JavaScript API to bundle text and file data
Content-Type: multipart/form-data	Header used when uploading files
axiosInstance	Preconfigured Axios client to call APIs
onMovieAdded()	Passed from AdminDashboard to refresh list after form submit
onClose()	Passed to AddMovieForm to close itself after success
selectedMovie	Null (add) or movie object (edit)
fetchMovies()	Main refresh function used throughout
handleSubmit()	Handles both Add and Edit logic
handleChange()	Updates input fields dynamically