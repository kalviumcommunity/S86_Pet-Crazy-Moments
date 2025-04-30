import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaUserTie, FaEdit } from 'react-icons/fa';
import { MdEmail, MdLocationOn, MdPerson, MdPhone } from 'react-icons/md';
import Navbar from '../../HomepageComponents.jsx/Navbar';
import ReactPlayer from 'react-player';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phonenumber: '',
    gender: '',
    address: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    setFormData({
      name: parsedUser.name || '',
      email: parsedUser.email || '',
      phonenumber: parsedUser.phonenumber || '',
      gender: parsedUser.gender || '',
      address: parsedUser.address || ''
    });

    fetchUserMedia(parsedUser.id);
  }, [navigate]);

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchUserMedia = async (userId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://s86-pet-crazy-moments.onrender.com/media/user/${userId}`,
        { headers: getAuthHeader() }
      );
      setMedia(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching user media:', err);
      setError('Failed to load your media');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(
        'https://s86-pet-crazy-moments.onrender.com/users/update-profile',
        {
          name: formData.name,
          phonenumber: formData.phonenumber,
          gender: formData.gender,
          address: formData.address
        },
        { headers: getAuthHeader() }
      );

      const updatedUser = { ...user, ...response.data.user };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.msg || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const getProfileIcon = () => {
    const size = 80;
    if (formData.gender === 'male') return <FaUserTie size={size} className="text-blue-500" />;
    if (formData.gender === 'female') return <MdPerson size={size} className="text-pink-500" />;
    return <FaUser size={size} className="text-yellow-500" />;
  };

  const isYouTube = (url) => url?.includes('youtube.com') || url?.includes('youtu.be');
  const isVimeo = (url) => url?.includes('vimeo.com');
  const isDirectVideo = (url) => /\.(mp4|webm|ogg)$/i.test(url || '');

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <div className="container mx-auto pt-20 px-4 flex justify-center items-center h-screen">
          <div className="text-2xl">Loading...</div>
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

        {error && (
          <div className="bg-red-600 text-white p-4 rounded-lg">
            {error}
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
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg flex items-center transition duration-200 ease-in-out"
              disabled={loading}
            >
              <FaEdit className="mr-2" /> {isEditing ? 'Cancel Editing' : 'Edit Profile'}
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {[{ label: 'Name', name: 'name', type: 'text' },
                { label: 'Email', name: 'email', type: 'email', disabled: true },
                { label: 'Phone Number', name: 'phonenumber', type: 'text' }].map(({ label, name, type, disabled }) => (
                  <div key={name}>
                    <label className="block text-gray-400 mb-2">{label}</label>
                    <input
                      type={type}
                      name={name}
                      value={formData[name]}
                      onChange={handleInputChange}
                      disabled={disabled}
                      className="w-full bg-gray-700 p-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}

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
                ></textarea>
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg transition duration-200"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {[{ icon: <FaUser className="mr-2" />, label: 'Name', value: user?.name },
                { icon: <MdEmail className="mr-2" />, label: 'Email', value: user?.email },
                { icon: <MdPhone className="mr-2" />, label: 'Phone', value: user?.phonenumber },
                { icon: <FaUser className="mr-2" />, label: 'Gender', value: user?.gender }].map(({ icon, label, value }) => (
                  <div className="bg-gray-700 p-4 rounded-lg" key={label}>
                    <div className="flex items-center mb-2 text-gray-400">{icon} {label}</div>
                    <p>{value || 'Not provided'}</p>
                  </div>
                ))}

              <div className="bg-gray-700 p-4 rounded-lg md:col-span-2">
                <div className="flex items-center mb-2 text-gray-400">
                  <MdLocationOn className="mr-2" /> Address
                </div>
                <p>{user?.address || 'Not provided'}</p>
              </div>
            </div>
          )}
        </div>

        {/* Media Section */}
        <div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <h2 className="font-semibold text-2xl">Your Media</h2>
            <button
              onClick={() => navigate("/admin")}
              className="bg-indigo-500 hover:bg-emerald-500 hover:text-black py-2 px-4 rounded-md transition font-mono"
            >
              Edit Media
            </button>
          </div>

          {media.length === 0 && !error ? (
            <div className="bg-gray-800 rounded-lg p-8 text-center text-gray-400">
              You haven't uploaded any media yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {media.map((item) => (
                <div key={item._id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                  <div className="h-52 bg-black flex items-center justify-center overflow-hidden">
                    {item.type === "image" ? (
                      <img
                        src={item.url.startsWith("http") ? item.url : `https://s86-pet-crazy-moments.onrender.com${item.url}`}
                        alt={item.title}
                        className="w-full h-full object-contain"
                      />
                    ) : isDirectVideo(item.url) || isYouTube(item.url) || isVimeo(item.url) ? (
                      <ReactPlayer
                        url={item.url.startsWith("http") ? item.url : `https://s86-pet-crazy-moments.onrender.com${item.url}`}
                        width="100%"
                        height="100%"
                        controls
                        config={{
                          youtube: { playerVars: { modestbranding: 1, rel: 0 } },
                          vimeo: { title: false, byline: false, portrait: false }
                        }}
                      />
                    ) : (
                      <div className="text-red-400 p-4 text-center">Unsupported media format</div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold truncate mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-400">{new Date(item.uploadedAt).toLocaleDateString()}</p>
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
