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

      await axios.post("https://s86-pet-crazy-moments.onrender.com/media/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

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

      <div className="max-w-2xl pt-20 mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
          Upload & View Media
        </h1>

        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Upload Media</h2>

          <div className="flex gap-10">
            <input
              ref={titleRef}
              type="text"
              placeholder="Enter Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-md mb-4"
            />

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-md mb-4"
            >
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </div>

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            accept={type === "image" ? "image/*" : "video/*"}
            className="w-full border border-gray-300 p-3 rounded-md mb-4"
          />

          <div className="text-center text-gray-500 mb-4">OR</div>

          <input
            type="text"
            placeholder="Enter URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-md mb-4"
          />

          {/* Live Preview */}
          {(file || url) && previewSource && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">Preview</h2>
              {type === 'image' ? (
                <img
                  src={previewSource}
                  alt="Preview"
                  className="w-full max-h-[500px] object-contain rounded-md"
                />
              ) : (
                <>
                  {/\.(mp4|webm|ogg)$/i.test(previewSource) ? (
                    <video controls className="w-full max-h-[500px] rounded-md">
                      <source src={previewSource} />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <iframe
                      src={previewSource}
                      title="Video Preview"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-[500px] rounded-md"
                    />
                  )}
                </>
              )}
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={isUploading}
            className={`w-full px-6 py-3 text-white font-semibold rounded-md transition ${isUploading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
              }`}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
