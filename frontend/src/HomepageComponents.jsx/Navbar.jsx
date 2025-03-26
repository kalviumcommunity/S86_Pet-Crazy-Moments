import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  // Function to scroll to a section smoothly
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="bg-gray-700 shadow-lg fixed top-0 left-0 w-full z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-white tracking-wide">
          Pet<span className="text-green-300">Crazy</span>
        </h1>
        <div className="space-x-6 flex items-center">
          <button onClick={() => scrollToSection("Showcase")} className="text-gray-200 text-lg font-medium hover:text-green-300 transition-all duration-300">
            Home
          </button>
          <button
            onClick={() => scrollToSection("about")}
            className="text-gray-200 text-lg font-medium hover:text-green-300 transition-all duration-300"
          >
            About
          </button>
          <button
            onClick={() => scrollToSection("contact")}
            className="text-gray-200 text-lg font-medium hover:text-green-300 transition-all duration-300"
          >
            Contact
          </button>
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-white font-medium">Welcome, {user.name}</span>
              {user.role === "admin" && (
                <Link to="/admin" className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
                  Admin Panel
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="space-x-4">
              <Link to="/login" className="bg-green-400 text-black px-4 py-2 rounded hover:bg-yellow-500 transition">
                Login
              </Link>
              <Link to="/signup" className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
