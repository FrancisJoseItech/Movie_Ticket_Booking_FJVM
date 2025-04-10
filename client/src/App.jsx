import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

// App.jsx
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router"; 

function App() {
  return (
    <>
      {/* ✅ We are using RouterProvider now to inject our router config */}
      <RouterProvider router={router} />
    </>
  );
}

export default App;
