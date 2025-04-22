import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
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

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false); // close menu after click
    }
  };

  return (
    <nav className="bg-gray-700 shadow-lg fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
          Pet<span className="text-green-300">Crazy</span>
        </h1>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-white text-2xl focus:outline-none">
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex space-x-6 items-center">
          <button onClick={() => scrollToSection("Showcase")} className="text-gray-200 hover:text-green-300 text-lg font-medium transition">
            Home
          </button>
          <button onClick={() => scrollToSection("about")} className="text-gray-200 hover:text-green-300 text-lg font-medium transition">
            About
          </button>
          <button onClick={() => scrollToSection("contact")} className="text-gray-200 hover:text-green-300 text-lg font-medium transition">
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

      {/* Mobile menu content */}
      {menuOpen && (
        <div className="md:hidden bg-gray-800 px-4 py-4 space-y-3">
          <button onClick={() => scrollToSection("Showcase")} className="block w-full text-center text-gray-200 hover:text-green-300 text-lg">
            Home
          </button>
          <button onClick={() => scrollToSection("about")} className="block w-full text-center text-gray-200 hover:text-green-300 text-lg">
            About
          </button>
          <button onClick={() => scrollToSection("contact")} className="block w-full text-center text-gray-200 hover:text-green-300 text-lg">
            Contact
          </button>
          {user ? (
            <div className="space-y-2">
              <p className="text-white text-center text-2xl font-semibold">Welcome, <span className='text-orange-500'>{user.name}</span></p>
              <div className=' mt-4 flex gap-4 justify-center items-center'>
              {user.role === "admin" && (
                <Link to="/admin" className="block bg-red-500  text-white px-4 py-2 rounded hover:bg-red-600 transition">
                  Admin Panel
                </Link>
              )}
              <button
                onClick={handleLogout}
                className=" bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Logout
              </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center gap-2">
              <Link to="/login" className="block bg-green-400 text-black px-4 py-2 rounded hover:bg-yellow-500 transition">
                Login
              </Link>
              <Link to="/signup" className="block bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
