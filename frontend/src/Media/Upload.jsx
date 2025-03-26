import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const UploadPage = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [url, setUrl] = useState('');
    const [title, setTitle] = useState('');
    const [type, setType] = useState('image');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setUrl(''); // Clear URL if file is selected
    };

    const handleUrlChange = (event) => {
        setUrl(event.target.value);
        setFile(null); // Clear file if URL is entered
    };

    const handleTitleChange = (event) => setTitle(event.target.value);
    const handleTypeChange = (event) => setType(event.target.value);

    const handleUpload = async () => {
        if (!title) {
            alert("Please enter a title.");
            return;
        }
        if (!file && !url) {
            alert("Please select a file or enter a URL.");
            return;
        }

        const formData = new FormData();
        formData.append("type", type);
        formData.append("title", title);
        if (file) {
            formData.append("file", file);
        } else if (url) {
            formData.append("url", url);
        }

        try {
            await axios.post("http://localhost:3000/media/upload", formData);
            alert("Upload successful!");
            navigate(type === "image" ? "/image" : "/video");
        } catch (error) {
            console.error(error);
            alert("Upload failed.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
          <Navbar />
            <h1 className="text-3xl font-bold text-gray-700 mb-4 mt-10">Upload Media</h1>
            <div className="w-full max-w-md bg-white p-6 shadow-lg rounded-lg">
                <input 
                    type="text" 
                    placeholder="Enter Title" 
                    value={title} 
                    onChange={handleTitleChange} 
                    className="w-full border p-2 rounded-lg mb-4" 
                />

                <select 
                    value={type} 
                    onChange={handleTypeChange} 
                    className="w-full border p-2 rounded-lg mb-4"
                >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                </select>

                <input 
                    type="file" 
                    className="w-full border p-2 rounded-lg mb-4" 
                    onChange={handleFileChange} 
                    accept={type === "image" ? "image/*" : "video/*"}
                />

                <p className="text-center text-gray-500">OR</p>

                <input 
                    type="text" 
                    placeholder="Enter URL" 
                    value={url} 
                    onChange={handleUrlChange} 
                    className="w-full border p-2 rounded-lg mb-4" 
                />

                <button 
                    onClick={handleUpload} 
                    className="w-full px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                    Upload
                </button>
            </div>
        </div>
    );
};

export default UploadPage;
