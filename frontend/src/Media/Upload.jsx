import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import { useAuth } from "../context/AuthContext";

const UploadPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const titleRef = useRef(null);

  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState('image');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!user) {
      alert('Please login to upload.');
      navigate('/login');
    } else {
      titleRef.current?.focus();
    }
  }, [user, navigate]);

  const handleUpload = async () => {
    if (!title) return alert("Please enter a title.");
    if (!file && !url) return alert("Please select a file or enter a URL.");

    const formData = new FormData();
    formData.append("type", type);
    formData.append("title", title);
    if (file) formData.append("file", file);
    if (url) formData.append("url", url);

    setIsUploading(true);
    try {
      const token = user?.token || localStorage.getItem("token");
      if (!token) {
        alert("You need to be logged in to upload media.");
        navigate("/login");
        return;
      }

      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/media/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      console.log("Upload successful:", response.data);

      // Clear form after successful upload
      setFile(null);
      setUrl('');
      setTitle('');

      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';

      alert("Upload successful!");

      // Redirect to appropriate page
      navigate(`/${type}`);
    } catch (error) {
      console.error("Upload error:", error);
      alert(`Upload failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const previewSource = file ? URL.createObjectURL(file) : url;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-8">
      <Navbar />

      <div className="max-w-xl pt-20 mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-5 lg:mb-12">
          Upload & View Media
        </h1>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Upload Media</h2>

          <div className="flex flex-col lg:gap-4">
            <input
              ref={titleRef}
              type="text"
              placeholder="Enter Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 border border-gray-300 p-3 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="w-full lg:flex gap-5 items-center mb-6">
              <div>
                <p className="text-center text-lg font-semibold text-black mb-4 lg:mb-0">
                  Select the Media Type:
                </p>
              </div>
              <div className="flex justify-center items-center space-x-8">
                <label className="flex items-center cursor-pointer group">
                  <div className="relative">
                    <input
                      type="radio"
                      name="type"
                      value="image"
                      checked={type === 'image'}
                      onChange={(e) => setType(e.target.value)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${type === 'image'
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-400 group-hover:border-blue-300'
                      }`}>
                      {type === 'image' && (
                        <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                      )}
                    </div>
                  </div>
                  <span className={`ml-3 text-lg font-medium transition-colors duration-200 ${type === 'image'
                    ? 'text-blue-400'
                    : 'text-gray-300 group-hover:text-blue-300'
                    }`}>
                    Image
                  </span>
                </label>

                <label className="flex items-center cursor-pointer group">
                  <div className="relative">
                    <input
                      type="radio"
                      name="type"
                      value="video"
                      checked={type === 'video'}
                      onChange={(e) => setType(e.target.value)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${type === 'video'
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-gray-400 group-hover:border-purple-300'
                      }`}>
                      {type === 'video' && (
                        <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                      )}
                    </div>
                  </div>
                  <span className={`ml-3 text-lg font-medium transition-colors duration-200 ${type === 'video'
                    ? 'text-purple-400'
                    : 'text-gray-300 group-hover:text-purple-300'
                    }`}>
                    Video
                  </span>
                </label>
              </div>
            </div>
          </div>

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            accept={type === "image" ? "image/*" : "video/*"}
            className="w-full border border-gray-300 p-3 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="text-center text-gray-500 mb-4 font-medium">OR</div>

          <input
            type="text"
            placeholder="Enter URL (for external links)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Live Preview */}
          {(file || url) && previewSource && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">Preview</h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {type === 'image' ? (
                  <img
                    src={previewSource}
                    alt="Preview"
                    className="w-full max-h-[400px] object-contain"
                    onError={(e) => {
                      console.error("Failed to load image preview");
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="aspect-video bg-black">
                    {file ? (
                      // For uploaded files, show video element
                      <video controls className="w-full h-full">
                        <source src={previewSource} />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      // For URLs, try to embed if it's a known video platform
                      <>
                        {url.includes('youtube.com') || url.includes('youtu.be') ? (
                          <iframe
                            src={`https://www.youtube.com/embed/${extractVideoId(url)}`}
                            title="Video Preview"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                          />
                        ) : url.includes('vimeo.com') ? (
                          <iframe
                            src={`https://player.vimeo.com/video/${extractVideoId(url)}`}
                            title="Video Preview"
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white bg-gray-800">
                            <div className="text-center">
                              <p className="mb-2">Video URL Preview</p>
                              <p className="text-sm text-gray-300">Preview will be available after upload</p>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={isUploading}
            className={`w-full px-6 py-3 text-white font-semibold rounded-md transition-all duration-200 ${isUploading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
              }`}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper function to extract video ID from URLs
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

export default UploadPage;