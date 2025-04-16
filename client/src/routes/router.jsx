import UserLayout from "../layout/UserLayout";
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";

import { createBrowserRouter } from "react-router-dom";
import Homepage from "../pages/Homepage";
import AboutPage from "../pages/AboutPage";
import ShowPage from "../pages/ShowsPage";
import AdminDashboard from "../pages/admin/AdminDashboard";
import UserDashboard from "../pages/Userdashboard";
import TheaterDashboard from "../pages/TheaterDashboard";
import HomePage from "../pages/Homepage";



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
        // ✅ Newly added dashboard/profile routes
        { path: "admin/dashboard", element: <AdminDashboard /> },
        { path: "user/dashboard", element: <UserDashboard/> },
        { path: "theater/dashboard", element: <TheaterDashboard /> },
        

      ],
    },
  ]);