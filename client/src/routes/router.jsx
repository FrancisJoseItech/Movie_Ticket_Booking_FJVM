import UserLayout from "../layout/UserLayout";
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";

import { createBrowserRouter } from "react-router-dom";

import AboutPage from "../pages/AboutPage";
import ShowPage from "../pages/ShowsPage";
import AdminDashboard from "../pages/admin/AdminDashboard";
import UserDashboard from "../pages/Userdashboard";
import HomePage from "../pages/HomePage";
import TheaterOwnerDashboard from "../pages/theater/TheaterOwnerDashboard";
import { theaterOwnerLoader } from "../loaders/theaterOwnerLoader"; // 👈 Import loader

import BookShowPage from "../pages/BookShowPage";

import PaymentSuccess from "../pages/PaymentSuccess";
import MovieDetailsPage from "../pages/MovieDetailsPage";



export const router = createBrowserRouter([
    {
      path: "/",
      element: <UserLayout/>,
      errorElement: <h1>Error page</h1>,
      children: [
        { path: "", element: <HomePage/>},
        { path: "about", element: <AboutPage /> },
        { path: "shows", element: <ShowPage/> },
        { path: "login", element: <Login/> },
        { path: "register", element: < Signup/> },

        // 🧭 Movie details route (💡 show full movie info and its upcoming shows)
      { path: "movies/:movieId", element: <MovieDetailsPage /> },

        // ✅ Dashboard/profile pages
        { path: "admin/dashboard", element: <AdminDashboard /> },
        { path: "user/dashboard", element: <UserDashboard/> },
        { path: "theater/dashboard", element: <TheaterOwnerDashboard/>,
           loader: theaterOwnerLoader,}, // 🚀 Load data before render 
        
         // ✅ Booking and Payment
        {
          path: "/book/:showId",
          element: <BookShowPage/>,
        },
        {
          path: "payment-success",
          element: <PaymentSuccess/>,
        },
      ],
    },
  ]);