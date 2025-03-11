import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">PetCrazy</h1>
        <div className="space-x-6">
          <a href="#home" className="text-gray-600 hover:text-indigo-500">Home</a>
          <a href="#about" className="text-gray-600 hover:text-indigo-500">About</a>
          <a href="#contact" className="text-gray-600 hover:text-indigo-500">Contact</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
