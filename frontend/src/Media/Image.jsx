import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

// Utility function for fetching data with authentication
const fetchData = async (url, setState, errorMessage, requiresAuth = false) => {
  try {
    const headers = {};
    if (requiresAuth) {
      const token = localStorage.getItem('token');
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }
    
    const response = await axios.get(url, { headers });
    setState(response.data);
    return true;
  } catch (error) {
    console.error(`${errorMessage} ${error?.response?.data?.message || error.message}`);
    return false;
  }
};

const ImagePage = () => {
  const [images, setImages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if current user is admin
  const checkUserRole = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Decode JWT token to get user role
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.role === 'admin';
      } catch (error) {
        console.error('Error decoding token:', error);
        return false;
      }
    }
    return false;
  };

  // Fetch users and images on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        // Check if user is admin
        const adminStatus = checkUserRole();
        setIsAdmin(adminStatus);
        
        // Fetch images for all users
        await fetchData(
          `${import.meta.env.VITE_BACKEND_URL}media/type/image`,
          setImages,
          "Error fetching images:"
        );
        
        // Only fetch users list if user is admin
        if (adminStatus) {
          await fetchData(
            `${import.meta.env.VITE_BACKEND_URL}/users`,
            setUsers,
            "Error fetching users:",
            true // requires authentication
          );
        }
        
      } catch (error) {
        console.error("Error fetching initial data:", error?.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch filtered images when user selection changes (admin only)
  useEffect(() => {
    if (isAdmin && selectedUser) {
      const url = `${import.meta.env.VITE_BACKEND_URL}/media/type/image?user=${selectedUser}`;
      fetchData(url, setImages, "Error fetching filtered images:");
    } else if (isAdmin && !selectedUser) {
      // If no user selected, fetch all images
      fetchData(
        `${import.meta.env.VITE_BACKEND_URL}/media/type/image`,
        setImages,
        "Error fetching all images:"
      );
    }
  }, [selectedUser, isAdmin]);

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

      {/* Title and Dropdown (Admin Only) */}
      <div className="flex flex-col lg:flex-row gap-5 lg:gap-0 justify-between items-center mb-10 mt-20">
        <h1 className="text-4xl font-bold text-gray-800 tracking-wide">
          Image Gallery
        </h1>
        
        {/* Show filter dropdown only for admin */}
        {isAdmin && (
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 font-medium">Filter by User:</span>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 hover:shadow-lg transition-all duration-200"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="">All Users</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name || "Unnamed User"}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Admin Badge */}
      {isAdmin && (
        <div className="mb-4">
          <span className="inline-block bg-green-300/40 text-green-800 px-3 py-1 rounded-lg text-sm font-medium">
            Admin View
          </span>
        </div>
      )}

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.length > 0 ? (
          images.map(({ _id, url, title, uploadedAt, user }) => (
            <div
              key={_id}
              className="rounded-lg shadow-lg bg-white hover:shadow-2xl transform hover:scale-105 transition duration-300"
            >
              <img
                src={url.startsWith("http") ? url : `${import.meta.env.VITE_BACKEND_URL}${url}`}
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
                {/* Show user name only for admin */}
                {isAdmin && (
                  <p className="text-sm text-gray-500">
                    By: {user?.name || "Unknown User"}
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-xl text-gray-600">
              {isAdmin && selectedUser ? "No images found for selected user" : "No images found"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagePage;