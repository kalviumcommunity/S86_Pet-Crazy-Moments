import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Scroll to section if navigated with scrollTo state
    if (location.state?.scrollTo) {
      const section = document.getElementById(location.state.scrollTo);
      if (section) {
        setTimeout(() => {
          section.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

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
      setMenuOpen(false);
    }
  };

  const handleNavClick = (id) => {
    if (location.pathname === "/") {
      scrollToSection(id);
    } else {
      navigate("/", { state: { scrollTo: id } });
    }
  };

  const navLinks = [
    { label: "Home", id: "Showcase" },
    { label: "About", id: "about" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <nav className="bg-gray-700 shadow-lg fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
          Pet<span className="text-green-300">Crazy</span>
        </h1>

        {/* Toggle button for mobile */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        <div className="hidden md:flex space-x-6 items-center">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className="text-gray-200 text-lg font-medium hover:text-green-300 transition-all duration-300"
            >
              {link.label}
            </button>
          ))}
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-white font-medium">Welcome, {user.name}</span>
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="bg-lime-500 text-white px-4 py-2 rounded hover:bg-lime-600 hover:text-black transition"
                >
                  Admin Panel
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-500 cursor-pointer text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="space-x-4">
              <Link to="/login" className="bg-green-400 text-black px-4 py-2 rounded hover:bg-green-500 transition">
                Login
              </Link>
              <Link to="/signup" className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-800 px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className="block w-full text-center text-gray-200 hover:text-green-300 text-lg"
            >
              {link.label}
            </button>
          ))}
          {user ? (
            <div className="space-y-2 text-center">
              <p className="text-white text-xl font-semibold">
                Welcome, <span className="text-orange-500">{user.name}</span>
              </p>
              <div className="flex justify-center gap-4 mt-2">
                {user.role === "admin" && (
                  <Link to="/admin" className="bg-lime-500 text-white px-4 py-2 rounded hover:bg-lime-600 transition">
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-center gap-2">
              <Link to="/login" className="bg-green-400 text-black px-4 py-2 rounded hover:bg-yellow-500 transition">
                Login
              </Link>
              <Link to="/signup" className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
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
