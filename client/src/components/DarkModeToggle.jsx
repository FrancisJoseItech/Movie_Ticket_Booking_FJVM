import React, { useEffect, useState } from "react";

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const theme = darkMode ? "dark" : "light";
    document.querySelector("html").setAttribute("data-theme", theme);
    console.log("🎨 Theme set to:", theme);
  }, [darkMode]);

  const handleToggle = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <label className="swap swap-rotate">
      {/* Hidden checkbox to toggle */}
      <input
        type="checkbox"
        onChange={handleToggle}
        checked={darkMode}
        aria-label="Toggle Dark Mode"
      />

      {/* 🌞 Sun icon */}
      <svg
        className="swap-off fill-current w-6 h-6"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path
          d="M5.64 17.66a9 9 0 1112.72-12.72 9 9 0 01-12.72 12.72z"
        />
      </svg>

      {/* 🌙 Moon icon */}
      <svg
        className="swap-on fill-current w-6 h-6"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path
          d="M21.64 13a1 1 0 00-1.05-.14 8.05 8.05 0 01-3.37.73 8.15 8.15 0 01-7.5-7.5 8.59 8.59 0 01.25-2A1 1 0 008 2.36 10.14 10.14 0 1022 14.05a1 1 0 00-.36-1.05z"
        />
      </svg>
    </label>
  );
};




export default DarkModeToggle;
