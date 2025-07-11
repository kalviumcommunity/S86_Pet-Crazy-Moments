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

const VideoPage = () => {
  const [videos, setVideos] = useState([]);
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

  // Fetch users and videos on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        // Check if user is admin
        const adminStatus = checkUserRole();
        setIsAdmin(adminStatus);
        
        // Fetch videos for all users
        await fetchData(
          `${import.meta.env.VITE_BACKEND_URL}/media/video`,
          setVideos,
          "Error fetching videos:"
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

  // Fetch filtered videos when user selection changes (admin only)
  useEffect(() => {
    if (isAdmin && selectedUser) {
      const url = `${import.meta.env.VITE_BACKEND_URL}/media/video?user=${selectedUser}`;
      fetchData(url, setVideos, "Error fetching filtered videos:");
    } else if (isAdmin && !selectedUser) {
      // If no user selected, fetch all videos
      fetchData(
        `${import.meta.env.VITE_BACKEND_URL}/media/video`,
        setVideos,
        "Error fetching all videos:"
      );
    }
  }, [selectedUser, isAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-200 p-6">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-200 p-6">
      <Navbar />
      
      {/* Title and Dropdown (Admin Only) */}
      <div className="flex flex-col lg:flex-row gap-5 lg:gap-0 justify-between items-center mb-10 mt-20">
        <h1 className="text-4xl font-bold text-gray-800 tracking-wide">
          Video Gallery
        </h1>
        
        {/* Show filter dropdown only for admin */}
        {isAdmin && (
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 font-medium">Filter by User:</span>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 hover:shadow-lg transition-all duration-200"
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
          <span className="inline-block bg-purple-300/40 text-purple-800 px-3 py-1 rounded-lg text-sm font-medium">
            Admin View
          </span>
        </div>
      )}

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {videos.length > 0 ? (
          videos.map((video, index) => {
            const videoType = getVideoType(video.url);

            return (
              <div key={video._id || index} className="rounded-lg shadow-lg bg-white hover:shadow-2xl transform hover:scale-105 transition duration-300 overflow-hidden">
                <div className="aspect-video bg-black">
                  {videoType === "youtube" && (
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${extractVideoId(video.url)}?modestbranding=1&rel=0`}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )}

                  {videoType === "youtube-shorts" && (
                    <div className="w-full h-full flex items-center justify-center bg-black">
                      <div className="relative w-full max-w-xs h-full">
                        <iframe
                          className="w-full h-full"
                          src={`https://www.youtube.com/embed/${extractVideoId(video.url)}?modestbranding=1&rel=0`}
                          title={video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  )}

                  {videoType === "vimeo" && (
                    <iframe
                      className="w-full h-full"
                      src={`https://player.vimeo.com/video/${extractVideoId(video.url)}`}
                      title={video.title}
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                    />
                  )}

                  {videoType === "dailymotion" && (
                    <iframe
                      className="w-full h-full"
                      src={`https://www.dailymotion.com/embed/video/${extractVideoId(video.url)}`}
                      title={video.title}
                      allow="autoplay; fullscreen; encrypted-media"
                      allowFullScreen
                    />
                  )}

                  {videoType === "twitch" && (
                    <iframe
                      className="w-full h-full"
                      src={`https://player.twitch.tv/?video=${extractVideoId(video.url)}&parent=${window.location.hostname}`}
                      title={video.title}
                      allow="autoplay; fullscreen; encrypted-media"
                      allowFullScreen
                    />
                  )}

                  {videoType === "other" && (
                    <iframe
                      className="w-full h-full"
                      src={video.url}
                      title={video.title}
                      allow="autoplay; fullscreen; encrypted-media"
                      allowFullScreen
                      onError={(e) => {
                        console.error("Failed to load iframe:", video.url);
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  )}

                  {videoType === "file" && (
                    <video 
                      className="w-full h-full object-cover" 
                      controls 
                      preload="metadata"
                      onError={(e) => {
                        console.error("Failed to load video:", video.url);
                      }}
                    >
                      <source 
                        src={video.url.startsWith("http") ? video.url : `${import.meta.env.VITE_BACKEND_URL}/${video.url}`} 
                        type="video/mp4" 
                      />
                      <source 
                        src={video.url.startsWith("http") ? video.url : `${import.meta.env.VITE_BACKEND_URL}/${video.url}`} 
                        type="video/webm" 
                      />
                      <source 
                        src={video.url.startsWith("http") ? video.url : `${import.meta.env.VITE_BACKEND_URL}/${video.url}`} 
                        type="video/ogg" 
                      />
                      Your browser does not support the video tag.
                    </video>
                  )}

                  {/* Fallback for failed embeds */}
                  <div className="hidden w-full h-full flex-col items-center justify-center text-white bg-gray-800">
                    <p className="text-center mb-2">Unable to load video</p>
                    <a 
                      href={video.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline"
                    >
                      Open in new tab
                    </a>
                  </div>
                </div>
                
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800 truncate mb-2">
                    {video.title || "Untitled Video"}
                  </h2>
                  <p className="text-sm text-gray-600 mb-2">
                    {video.uploadedAt ? new Date(video.uploadedAt).toLocaleDateString() : "Unknown date"}
                  </p>
                  {/* Show user name only for admin */}
                  {isAdmin && (
                    <p className="text-sm text-gray-500">
                      By: {video.user?.name || "Unknown User"}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    Type: {videoType === "file" ? "Uploaded Video" : 
                           videoType === "youtube-shorts" ? "YouTube Shorts" :
                           videoType.charAt(0).toUpperCase() + videoType.slice(1)}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-xl text-gray-600">
              {isAdmin && selectedUser ? "No videos found for selected user" : "No videos found"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const getVideoType = (url) => {
  if (url.includes("youtube.com/shorts/") || url.includes("youtu.be/") && url.includes("?si=")) return "youtube-shorts";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("vimeo.com")) return "vimeo";
  if (url.includes("dailymotion.com")) return "dailymotion";
  if (url.includes("twitch.tv")) return "twitch";
  if (url.startsWith("http") && !url.includes(window.location.hostname)) return "other";
  return "file";
};

const extractVideoId = (url) => {
  // YouTube Shorts
  const youtubeShortsMatch = url.match(/(?:youtube\.com\/shorts\/)([^"&?\/ ]{11})/);
  if (youtubeShortsMatch) return youtubeShortsMatch[1];

  // YouTube regular videos
  const youtubeMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/[^\/]+|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/);
  if (youtubeMatch) return youtubeMatch[1];

  // Vimeo
  const vimeoMatch = url.match(/(?:vimeo\.com\/)([0-9]+)/);
  if (vimeoMatch) return vimeoMatch[1];

  // Dailymotion
  const dailymotionMatch = url.match(/(?:dailymotion\.com\/video\/)([^_]+)/);
  if (dailymotionMatch) return dailymotionMatch[1];

  // Twitch
  const twitchMatch = url.match(/(?:twitch\.tv\/videos\/)([0-9]+)/);
  if (twitchMatch) return twitchMatch[1];

  return url;
};

export default VideoPage;