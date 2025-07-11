import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

// Utility function for fetching data
const fetchData = async (url, setState, errorMessage, headers = {}) => {
  try {
    const response = await axios.get(url, { headers });
    setState(response.data);
  } catch (error) {
    console.error(`${errorMessage} ${error?.response?.data?.message || error.message}`);
  }
};

const ImagePage = () => {
  const [images, setImages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [loading, setLoading] = useState(true);

  // Get authentication token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Extract unique users from images
  const extractUsersFromImages = (imageData) => {
    const uniqueUsers = [];
    const seenUserIds = new Set();
    
    imageData.forEach(image => {
      if (image.user && !seenUserIds.has(image.user._id)) {
        seenUserIds.add(image.user._id);
        uniqueUsers.push({
          _id: image.user._id,
          name: image.user.name || 'Unknown User'
        });
      }
    });
    
    return uniqueUsers;
  };

  // Fetch all images on component mount to get users
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        // Fetch all images first to extract users
        const response = await axios.get("https://s86-pet-crazy-moments.onrender.com/media/type/image");
        const imageData = response.data;
        
        setImages(imageData);
        
        // Extract unique users from images
        const uniqueUsers = extractUsersFromImages(imageData);
        setUsers(uniqueUsers);
        
      } catch (error) {
        console.error("Error fetching initial data:", error?.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch filtered images when user selection changes
  useEffect(() => {
    if (selectedUser) {
      const url = `https://s86-pet-crazy-moments.onrender.com/media/type/image?user=${selectedUser}`;
      fetchData(url, setImages, "Error fetching filtered images:");
    } else {
      // If no user selected, fetch all images
      fetchData(
        "https://s86-pet-crazy-moments.onrender.com/media/type/image",
        setImages,
        "Error fetching all images:"
      );
    }
  }, [selectedUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-200 p-6">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

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
              {user.name}
            </option>
          ))}
        </select>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.length > 0 ? (
          images.map(({ _id, url, title, uploadedAt, user }) => (
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
                <p className="text-sm text-gray-500">
                  By: {user?.name || "Unknown User"}
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