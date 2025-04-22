import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

// Utility function for fetching data
const fetchData = async (url, setState, errorMessage) => {
  try {
    const response = await axios.get(url);
    setState(response.data);
  } catch (error) {
    console.error(`${errorMessage} ${error?.response?.data?.message || error.message}`);
  }
};

const ImagePage = () => {
  const [images, setImages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');

  // Fetch all users on component mount
  useEffect(() => {
    fetchData(
      "https://s86-pet-crazy-moments.onrender.com/users",
      setUsers,
      "Error fetching users:"
    );
  }, []);

  // Fetch images (all or filtered by user) on user selection change
  useEffect(() => {
    const url = selectedUser
      ? `https://s86-pet-crazy-moments.onrender.com/media/type/image?user=${selectedUser}`
      : "https://s86-pet-crazy-moments.onrender.com/media/type/image";

    fetchData(url, setImages, "Error fetching images:");
  }, [selectedUser]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-200 p-6">
      {/* Navbar */}
      <Navbar />

      {/* Title and Dropdown */}
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
              {user?.name || "Unnamed User"}
            </option>
          ))}
        </select>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.length > 0 ? (
          images.map(({ _id, url, title, uploadedAt }) => (
            <div
              key={_id}
              className="rounded-lg shadow-lg bg-white hover:shadow-2xl transform hover:scale-105 transition duration-300"
            >
              <img
                src={url.startsWith("http") ? url : `https://s86-pet-crazy-moments.onrender.com${url}`}
                className="rounded-t-lg w-full h-48 object-cover"
                alt={title || "Uploaded image"}
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 truncate">
                  {title || "Untitled"}
                </h2>
                <p className="text-sm text-gray-600">
                  {uploadedAt ? new Date(uploadedAt).toLocaleDateString() : "Unknown date"}
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
