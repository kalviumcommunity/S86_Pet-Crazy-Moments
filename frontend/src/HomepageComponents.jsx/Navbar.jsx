import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-gray-700 shadow-lg fixed top-0 left-0 w-full z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-white tracking-wide">
          Pet<span className="text-green-300">Crazy</span>
        </h1>
        <div className="space-x-6">
          <a
            href="/"
            className="text-gray-200 text-lg font-medium hover:text-green-300 shadow-2xl shadow-green-600 transition-all duration-300 ease-in-out"
          >
            Home
          </a>
          <a
            href="/#about"
            className="text-gray-200 text-lg font-medium hover:text-green-300 transition-all duration-300 ease-in-out"
          >
            About
          </a>
          <a
            href="/#contact"
            className="text-gray-200 text-lg font-medium hover:text-green-300 transition-all duration-300 ease-in-out"
          >
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
