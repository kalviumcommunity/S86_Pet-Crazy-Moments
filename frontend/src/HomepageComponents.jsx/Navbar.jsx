import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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

  const handleNavClick = (id) => {
    if (location.pathname === "/") {
      scrollToSection(id);
    } else {
      navigate("/", { state: { scrollTo: id } });
    }
  };

  return (
    <nav className="bg-gray-700 shadow-lg fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
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
