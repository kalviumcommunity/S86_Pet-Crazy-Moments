import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaUserTie, FaEdit, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { MdEmail, MdLocationOn, MdPerson, MdPhone } from 'react-icons/md';
import Navbar from '../../HomepageComponents.jsx/Navbar';
import ReactPlayer from 'react-player';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phonenumber: '',
    gender: '',
    address: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    initializeProfile();
  }, [navigate]);

  const initializeProfile = async () => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!storedUser || !token) {
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setFormData({
        name: parsedUser.name || '',
        email: parsedUser.email || '',
        phonenumber: parsedUser.phonenumber || '',
        gender: parsedUser.gender || '',
        address: parsedUser.address || ''
      });

      // Fetch fresh user data and media
      await Promise.all([
        fetchUpdatedUser(),
        fetchUserMedia(parsedUser.id)
      ]);
    } catch (err) {
      console.error('Error initializing profile:', err);
      setError('Failed to load profile');
      setLoading(false);
    }
  };

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchUserMedia = async (userId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/media/user/${userId}`,
        { headers: getAuthHeader() }
      );
      setMedia(response.data || []);
    } catch (err) {
      console.error('Error fetching user media:', err);
      setError('Failed to load your media');
    }
  };

  const fetchUpdatedUser = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/users/profile`,
        { headers: getAuthHeader() }
      );
      
      const updatedUser = response.data;
      setUser(updatedUser);
      
      // Update localStorage with fresh data
      const userToStore = {
        ...updatedUser,
        token: localStorage.getItem('token') // Preserve token
      };
      localStorage.setItem('user', JSON.stringify(userToStore));
      
      setFormData({
        name: updatedUser.name || '',
        email: updatedUser.email || '',
        phonenumber: updatedUser.phonenumber || '',
        gender: updatedUser.gender || '',
        address: updatedUser.address || ''
      });
    } catch (err) {
      console.error('Error fetching updated user:', err);
      if (err.response?.status === 401) {
        // Token expired, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        setError('Failed to fetch updated profile details');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (formData.phonenumber && !/^\d{10}$/.test(formData.phonenumber.replace(/\D/g, ''))) {
      setError('Phone number must be 10 digits');
      return false;
    }
    return true;
  };

  const validatePasswordForm = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      setError('Both current and new passwords are required');
      return false;
    }
    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return false;
    }
    if (passwordData.currentPassword === passwordData.newPassword) {
      setError('New password must be different from current password');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) {
      return;
    }

    setFormLoading(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/users/update-profile`,
        {
          name: formData.name.trim(),
          phonenumber: formData.phonenumber.trim(),
          gender: formData.gender,
          address: formData.address.trim()
        },
        { headers: getAuthHeader() }
      );

      // Update user state with response data
      const updatedUser = response.data.user;
      setUser(updatedUser);
      
      // Update localStorage
      const userToStore = {
        ...updatedUser,
        token: localStorage.getItem('token')
      };
      localStorage.setItem('user', JSON.stringify(userToStore));

      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        setError(err.response?.data?.msg || 'Failed to update profile');
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!validatePasswordForm()) {
      return;
    }

    setPasswordLoading(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/users/change-password`,
        passwordData,
        { headers: getAuthHeader() }
      );

      setPasswordSuccess(true);
      setTimeout(() => setPasswordSuccess(false), 3000);
      setIsChangingPassword(false);
      setPasswordData({ currentPassword: '', newPassword: '' });
    } catch (err) {
      console.error('Error changing password:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        setError(err.response?.data?.msg || 'Failed to change password');
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  const getProfileIcon = () => {
    const size = 80;
    const gender = formData.gender || user?.gender;
    if (gender === 'male') return <FaUserTie size={size} className="text-blue-500" />;
    if (gender === 'female') return <MdPerson size={size} className="text-pink-500" />;
    return <FaUser size={size} className="text-yellow-500" />;
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const isYouTube = (url) => url?.includes('youtube.com') || url?.includes('youtu.be');
  const isVimeo = (url) => url?.includes('vimeo.com');
  const isDirectVideo = (url) => /\.(mp4|webm|ogg)$/i.test(url || '');

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <div className="container mx-auto pt-20 px-4 flex justify-center items-center h-screen">
          <div className="text-2xl">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 bg-gray-900 text-white">
      <Navbar />
      <div className="container mx-auto px-4 pt-20 space-y-10">
        {updateSuccess && (
          <div className="bg-green-600 text-white p-4 rounded-lg animate-fade-in">
            Profile updated successfully!
          </div>
        )}

        {passwordSuccess && (
          <div className="bg-green-600 text-white p-4 rounded-lg animate-fade-in">
            Password changed successfully!
          </div>
        )}

        {error && (
          <div className="bg-red-600 text-white p-4 rounded-lg">
            {error}
            <button 
              onClick={() => setError(null)}
              className="ml-4 text-sm underline"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center">
              <div className="bg-gray-700 p-4 rounded-full mr-4">
                {getProfileIcon()}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{user?.name || 'User'}</h1>
                <p className="text-gray-400">{user?.role === 'admin' ? 'Administrator' : 'User'}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg flex items-center transition duration-200 ease-in-out"
                disabled={formLoading}
              >
                <FaEdit className="mr-2" /> {isEditing ? 'Cancel Editing' : 'Edit Profile'}
              </button>
              <button
                onClick={() => setIsChangingPassword(!isChangingPassword)}
                className="bg-orange-600 hover:bg-orange-700 px-5 py-2 rounded-lg flex items-center transition duration-200 ease-in-out"
                disabled={passwordLoading}
              >
                <FaLock className="mr-2" /> {isChangingPassword ? 'Cancel' : 'Change Password'}
              </button>
            </div>
          </div>

          {isChangingPassword && (
            <form onSubmit={handlePasswordSubmit} className="mt-8 bg-gray-700 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Change Password</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-400 mb-2">Current Password *</label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full bg-gray-600 p-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 mb-2">New Password *</label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full bg-gray-600 p-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 pr-10"
                      required
                      minLength="6"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Minimum 6 characters</p>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-700 px-6 py-3 rounded-lg transition duration-200 disabled:opacity-50"
                  disabled={passwordLoading}
                >
                  {passwordLoading ? 'Changing Password...' : 'Change Password'}
                </button>
              </div>
            </form>
          )}

          {isEditing ? (
            <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-400 mb-2">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 p-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Email (Read Only)</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  className="w-full bg-gray-600 p-3 rounded-lg text-gray-300 cursor-not-allowed"
                  disabled
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phonenumber"
                  value={formData.phonenumber}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 p-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="10 digit phone number"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 p-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-400 mb-2">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 p-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Your address"
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg transition duration-200 disabled:opacity-50"
                  disabled={formLoading}
                >
                  {formLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-2 text-gray-400">
                  <FaUser className="mr-2" /> Name
                </div>
                <p>{user?.name || 'Not provided'}</p>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-2 text-gray-400">
                  <MdEmail className="mr-2" /> Email
                </div>
                <p>{user?.email || 'Not provided'}</p>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-2 text-gray-400">
                  <MdPhone className="mr-2" /> Phone Number
                </div>
                <p>{user?.phonenumber || 'Not provided'}</p>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-2 text-gray-400">
                  <MdPerson className="mr-2" /> Gender
                </div>
                <p>{user?.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'Not specified'}</p>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg md:col-span-2">
                <div className="flex items-center mb-2 text-gray-400">
                  <MdLocationOn className="mr-2" /> Address
                </div>
                <p>{user?.address || 'Not provided'}</p>
              </div>
            </div>
          )}
        </div>

        {/* User Media Section */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Your Media</h2>
          
          {loading && media.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400">Loading your media...</div>
            </div>
          ) : media.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400">No media uploaded yet.</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {media.map((item, index) => (
                <div key={index} className="bg-gray-700 rounded-lg overflow-hidden">
                  <div className="aspect-video bg-gray-600 flex items-center justify-center">
                    {isYouTube(item.file_url) || isVimeo(item.file_url) || isDirectVideo(item.file_url) ? (
                      <ReactPlayer
                        url={item.file_url}
                        width="100%"
                        height="100%"
                        controls={true}
                        light={true}
                        playing={false}
                        config={{
                          youtube: {
                            playerVars: { showinfo: 1 }
                          }
                        }}
                      />
                    ) : (
                      <div className="text-gray-400 text-center p-4">
                        <div className="text-4xl mb-2">📁</div>
                        <div className="text-sm">Unsupported media type</div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-white mb-2 truncate">
                      {item.title || 'Untitled Media'}
                    </h3>
                    
                    {item.description && (
                      <p className="text-gray-400 text-sm mb-3 line-clamp-3">
                        {item.description}
                      </p>
                    )}
                    
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>
                        {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Unknown date'}
                      </span>
                      <span className="bg-gray-600 px-2 py-1 rounded">
                        {item.category || 'Uncategorized'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;