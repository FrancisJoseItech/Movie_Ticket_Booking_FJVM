import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-8 py-4 text-center bg-base-200 text-sm text-gray-500">
      <p>© {currentYear} FJVM • All rights reserved.</p>
    </footer>
  );
};

export default Footer;
