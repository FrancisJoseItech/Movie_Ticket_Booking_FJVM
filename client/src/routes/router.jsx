import UserLayout from "../layout/UserLayout";
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";

import { createBrowserRouter } from "react-router-dom";
import Homepage from "../pages/Homepage";
import AboutPage from "../pages/AboutPage";
import ShowPage from "../pages/ShowsPage";



export const router = createBrowserRouter([
    {
      path: "/",
      element: <UserLayout/>,
      errorElement: <h1>Error page</h1>,
      children: [
        { path: "", element: <Homepage/>},
        { path: "about", element: <AboutPage /> },
        { path: "shows", element: <ShowPage/> },
        { path: "login", element: <Login/> },
        { path: "register", element: < Signup/> },
      ],
    },
  ]);