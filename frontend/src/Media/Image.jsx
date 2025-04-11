import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

// Utility function for fetching data
const fetchData = async (url, setState, errorMessage) => {
  try {
    const response = await axios.get(url);
    setState(response.data);
  } catch (error) {
    console.error(errorMessage, error);
  }
};

const ImagePage = () => {
  const [images, setImages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');

  // Fetch all users on component mount
  useEffect(() => {
    fetchData(
      "http://localhost:3000/users",
      setUsers,
      "Error fetching users:"
    );
  }, []);

  // Fetch images (all or filtered by user) on user selection change
  useEffect(() => {
    const url = selectedUser
      ? `http://localhost:3000/media/type/image?user=${selectedUser}`
      : "http://localhost:3000/media/type/image";

    fetchData(url, setImages, "Error fetching images:");
  }, [selectedUser]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-200 p-6">
      {/* Navbar */}
      <Navbar />

      {/* Flex Container for Title and Dropdown */}
      <div className="flex justify-between items-center mb-10 mt-20">
        <h1 className="text-4xl font-bold text-gray-800 tracking-wide">
          Image Gallery
        </h1>
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 hover:shadow-lg transition-all duration-200"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="">All Users</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.length > 0 ? (
          images.map((image, index) => (
            <div
              key={index}
              className="rounded-lg shadow-lg bg-white hover:shadow-2xl transform hover:scale-105 transition duration-300"
            >
              <img
                src={image.url.startsWith("http") ? image.url : `http://localhost:3000${image.url}`}
                className="rounded-t-lg w-full h-48 object-contain"
                alt={image.title}
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 truncate">
                  {image.title}
                </h2>
                <p className="text-sm text-gray-600">
                  {new Date(image.uploadedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-xl text-gray-600">No images found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagePage;
