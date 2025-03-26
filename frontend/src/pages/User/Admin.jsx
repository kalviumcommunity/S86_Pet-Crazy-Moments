import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Admin = () => {
    const [user, setUser] = useState(null);
    const [media, setMedia] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [newTitle, setNewTitle] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser.role !== "admin") {
                navigate("/");
            }
            setUser(parsedUser);
            fetchMedia();
        } else {
            navigate("/login");
        }
    }, [navigate]);

    const fetchMedia = async () => {
        try {
            const [imagesResponse, videosResponse] = await Promise.all([
                axios.get("http://localhost:3000/media/image"),
                axios.get("http://localhost:3000/media/video"),
            ]);

            setMedia([...imagesResponse.data, ...videosResponse.data]);
            setError(null);
        } catch (error) {
            console.error("Error fetching media:", error);
            setError("Failed to load media. Please try again later.");
        }
    };

    const deleteMedia = async (id) => {
        if (!window.confirm("Are you sure you want to delete this media?")) return;

        try {
            await axios.delete(`http://localhost:3000/media/${id}`);
            setMedia(media.filter((item) => item._id !== id));
        } catch (error) {
            console.error("Error deleting media:", error);
            setError("Failed to delete media.");
        }
    };

    const updateMediaTitle = async (id) => {
        if (!newTitle.trim()) {
            alert("Title cannot be empty!");
            return;
        }

        try {
            await axios.put(`http://localhost:3000/media/${id}`, { title: newTitle });
            setMedia(
                media.map((item) =>
                    item._id === id ? { ...item, title: newTitle } : item
                )
            );
            setEditingId(null);
            setNewTitle("");
        } catch (error) {
            console.error("Error updating media title:", error);
            setError("Failed to update media title.");
        }
    };

    const isYouTube = (url) => url.includes("youtube.com") || url.includes("youtu.be");
    const isVimeo = (url) => url.includes("vimeo.com");
    const isDirectVideo = (url) => /\.(mp4|webm|ogg)$/i.test(url);

    const getYouTubeEmbedUrl = (url) => url.replace("watch?v=", "embed/");
    const getVimeoEmbedUrl = (url) => `https://player.vimeo.com/video/${url.split("/").pop()}`;

    return (

        <div className="min-h-screen flex flex-col items-center bg-gray-900 text-white p-6">
            <nav className="bg-gray-700 shadow-lg fixed top-0 left-0 w-full z-10">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-3xl font-extrabold text-white tracking-wide">
                        Pet<span className="text-green-300">Crazy</span>
                    </h1>
                    <div className="space-x-6 flex items-center">
                        <Link to="/" className="text-gray-200 text-lg font-medium hover:text-green-300 transition-all duration-300">
                            Home
                        </Link>    
                    </div>
                </div>
            </nav>
            <h1 className="text-3xl font-bold mb-6 pt-20">Admin Panel</h1>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="w-full max-w-4xl">
                <div className="grid grid-cols-1 text-center md:grid-cols-3 gap-4 bg-gray-800 p-4 rounded-lg shadow-md">
                    <div className="font-bold">Preview</div>
                    <div className="font-bold">Title</div>
                    <div className="font-bold">Actions</div>
                </div>

                {media.map((item) => (
                    <div key={item._id} className="grid grid-cols-1 text-center md:grid-cols-3 gap-4 bg-gray-700 p-4 mt-2 rounded-lg items-center shadow-lg">
                        <div className="flex justify-center">
                            {item.type === "image" ? (
                                <img
                                    src={item.url.startsWith("http") ? item.url : `http://localhost:3000${item.url}`}
                                    alt={item.title}
                                    className="w-32 h-24 object-contain rounded-lg"
                                />
                            ) : isYouTube(item.url) ? (
                                <iframe
                                    width="120"
                                    height="80"
                                    src={getYouTubeEmbedUrl(item.url)}
                                    frameBorder="0"
                                    allowFullScreen
                                    className="rounded-lg"
                                ></iframe>
                            ) : isVimeo(item.url) ? (
                                <iframe
                                    width="120"
                                    height="80"
                                    src={getVimeoEmbedUrl(item.url)}
                                    frameBorder="0"
                                    allowFullScreen
                                    className="rounded-lg"
                                ></iframe>
                            ) : isDirectVideo(item.url) ? (
                                <video
                                    src={item.url.startsWith("http") ? item.url : `http://localhost:3000${item.url}`}
                                    controls
                                    className="w-32 h-24 rounded-lg"
                                />
                            ) : (
                                <p className="text-red-400">Unsupported</p>
                            )}
                        </div>

                        <div>
                            {editingId === item._id ? (
                                <div className="flex gap-2 flex-col">
                                    <input
                                        type="text"
                                        value={newTitle}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                        className="flex-1 p-2 border rounded text-black"
                                    />
                                    <div className="flex justify-center">
                                        <button
                                            onClick={() => updateMediaTitle(item._id)}
                                            className="ml-2 bg-blue-500 px-3 py-1 rounded"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setEditingId(null)}
                                            className="ml-2 bg-gray-500 px-3 py-1 rounded"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <h2 className="text-lg font-semibold">{item.title}</h2>
                            )}
                        </div>

                        <div className="flex gap-2 justify-center">
                            <button
                                onClick={() => setEditingId(item._id)}
                                className="bg-yellow-500 px-3 py-1 rounded"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => deleteMedia(item._id)}
                                className="bg-red-600 px-3 py-1 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Admin;
