import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { 
    LayoutGrid, 
    List, 
    Edit, 
    Trash2, 
    Check, 
    X, 
    Upload, 
    AlertCircle, 
    Users,
    Shield,
    UserCheck,
    UserX 
} from "lucide-react";
import ReactPlayer from 'react-player';

const Admin = () => {
    const [user, setUser] = useState(null);
    const [media, setMedia] = useState([]);
    const [users, setUsers] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [newTitle, setNewTitle] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState("grid");
    const [activeTab, setActiveTab] = useState("media");
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            
            if (parsedUser.role === "admin") {
                fetchUserMedia(parsedUser.id);
                fetchAllUsers();
            } else {
                fetchUserMedia(parsedUser.id);
            }
        } else {
            navigate("/login");
        }
    }, [navigate]);

    const fetchUserMedia = async (userId) => {
        setLoading(true);
        try {
            const response = await axios.get(`https://s86-pet-crazy-moments.onrender.com/media/user/${userId}`, {
                headers: getAuthHeader(),
            });
            setMedia(response.data);
            setError(null);
        } catch (error) {
            console.error("Error fetching media:", error);
            setError("Failed to load your media.");
        } finally {
            setLoading(false);
        }
    };

    const fetchAllUsers = async () => {
        try {
            const response = await axios.get("https://s86-pet-crazy-moments.onrender.com/users", {
                headers: getAuthHeader(),
            });
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
            setError("Failed to load users.");
        }
    };

    const getAuthHeader = () => {
        const token = localStorage.getItem("token");
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const deleteMedia = async (id) => {
        if (!window.confirm("Are you sure you want to delete this media?")) return;
        try {
            await axios.delete(`https://s86-pet-crazy-moments.onrender.com/media/${id}`, {
                headers: getAuthHeader(),
            });
            setMedia(media.filter((item) => item._id !== id));
        } catch (error) {
            console.error("Error deleting media:", error);
            setError("Failed to delete media.");
        }
    };

    const deleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
        try {
            await axios.delete(`https://s86-pet-crazy-moments.onrender.com/users/${userId}`, {
                headers: getAuthHeader(),
            });
            setUsers(users.filter((u) => u._id !== userId));
        } catch (error) {
            console.error("Error deleting user:", error);
            setError("Failed to delete user.");
        }
    };

    const toggleUserRole = async (userId, currentRole) => {
        const newRole = currentRole === "admin" ? "user" : "admin";
        const action = newRole === "admin" ? "promote to admin" : "demote to user";
        
        if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;
        
        try {
            await axios.put(`https://s86-pet-crazy-moments.onrender.com/users/${userId}/role`, 
                { role: newRole }, 
                { headers: getAuthHeader() }
            );
            setUsers(users.map((u) => u._id === userId ? { ...u, role: newRole } : u));
        } catch (error) {
            console.error("Error updating user role:", error);
            setError("Failed to update user role.");
        }
    };

    const updateMediaTitle = async (id) => {
        if (!newTitle.trim()) return alert("Title cannot be empty!");
        try {
            await axios.put(
                `https://s86-pet-crazy-moments.onrender.com/media/${id}`,
                { title: newTitle },
                { headers: getAuthHeader() }
            );
            setMedia(media.map((item) => (item._id === id ? { ...item, title: newTitle } : item)));
            setEditingId(null);
            setNewTitle("");
        } catch (error) {
            console.error("Error updating title:", error);
            setError("Failed to update title.");
        }
    };

    const isYouTube = (url) => url.includes("youtube.com") || url.includes("youtu.be");
    const isVimeo = (url) => url.includes("vimeo.com");
    const isDirectVideo = (url) => /\.(mp4|webm|ogg)$/i.test(url);
    const getYouTubeEmbedUrl = (url) => url.replace("watch?v=", "embed/");
    const getVimeoEmbedUrl = (url) => `https://player.vimeo.com/video/${url.split("/").pop()}`;

    const renderMediaPreview = (item) => {
        const src = item.url.startsWith("http") ? item.url : `https://s86-pet-crazy-moments.onrender.com${item.url}`;
        
        if (item.type === "image") {
            return (
                <div className="relative group overflow-hidden rounded-lg h-48">
                    <img src={src} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
            );
        } else if (isYouTube(item.url)) {
            return (
                <ReactPlayer 
                    url={getYouTubeEmbedUrl(item.url)} 
                    className="w-full h-60 rounded-lg" 
                    controls
                    width="100%" 
                    height="100%" 
                />
            );
        } else if (isVimeo(item.url)) {
            return (
                <ReactPlayer 
                    url={getVimeoEmbedUrl(item.url)} 
                    className="w-full h-60 rounded-lg" 
                    controls
                    width="100%" 
                    height="100%" 
                />
            );
        } else if (isDirectVideo(item.url)) {
            return (
                <video 
                    src={src} 
                    controls 
                    className="rounded-lg object-cover" 
                    width="100%" 
                    height="100%"
                />
            );
        } else {
            return (
                <div className="flex items-center justify-center h-48 bg-gray-700 rounded-lg">
                    <AlertCircle size={32} className="text-red-400 mr-2" />
                    <p className="text-red-400">Unsupported Media</p>
                </div>
            );
        }
    };

    const renderUserManagement = () => (
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
            <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                    <Users className="mr-2" size={24} />
                    User Management
                </h2>
                
                {users.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No users found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-700">
                                <tr>
                                    <th className="px-4 py-3 text-gray-200">Name</th>
                                    <th className="px-4 py-3 text-gray-200">Email</th>
                                    <th className="px-4 py-3 text-gray-200">Phone</th>
                                    <th className="px-4 py-3 text-gray-200">Gender</th>
                                    <th className="px-4 py-3 text-gray-200">Role</th>
                                    <th className="px-4 py-3 text-gray-200">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr key={u._id} className="border-b border-gray-600 hover:bg-gray-700 transition-colors">
                                        <td className="px-4 py-3 text-white font-medium">{u.name}</td>
                                        <td className="px-4 py-3 text-gray-300">{u.email}</td>
                                        <td className="px-4 py-3 text-gray-300">{u.phonenumber || "N/A"}</td>
                                        <td className="px-4 py-3 text-gray-300">{u.gender || "N/A"}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                u.role === "admin" 
                                                    ? "bg-purple-600 text-white" 
                                                    : "bg-blue-600 text-white"
                                            }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                {u._id !== user?.id && (
                                                    <>
                                                        <button
                                                            onClick={() => toggleUserRole(u._id, u.role)}
                                                            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                                                u.role === "admin"
                                                                    ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                                                                    : "bg-green-600 hover:bg-green-700 text-white"
                                                            }`}
                                                            title={u.role === "admin" ? "Demote to User" : "Promote to Admin"}
                                                        >
                                                            {u.role === "admin" ? <UserX size={16} /> : <UserCheck size={16} />}
                                                        </button>
                                                        <button
                                                            onClick={() => deleteUser(u._id)}
                                                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
                                                            title="Delete User"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </>
                                                )}
                                                {u._id === user?.id && (
                                                    <span className="text-gray-400 text-sm italic">Current User</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
            {/* Navigation Bar */}
            <nav className="bg-gray-800 shadow-lg fixed top-0 left-0 w-full z-10 border-b border-gray-700">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <Link to="/" className="flex items-center">
                        <h1 className="text-3xl font-extrabold text-white tracking-wide">
                            Pet<span className="text-green-400">Crazy</span>
                        </h1>
                    </Link>
                    <div className="space-x-6 flex items-center">
                        <Link to="/" className="text-gray-200 text-lg font-medium hover:text-green-400 transition duration-200">Home</Link>
                        <Link to="/upload" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center transition duration-200">
                            <Upload size={18} className="mr-2" />
                            Upload
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-4 pt-24 pb-12">
                {/* Tabs Navigation */}
                <div className="mb-8 flex justify-center">
                    <div className="flex bg-gray-700 rounded-lg p-1">
                        <button
                            onClick={() => setActiveTab("media")}
                            className={`px-6 py-2 rounded-md font-medium transition-colors ${
                                activeTab === "media"
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-300 hover:text-white"
                            }`}
                        >
                            My Media
                        </button>
                        {user?.role === "admin" && (
                            <button
                                onClick={() => setActiveTab("users")}
                                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                                    activeTab === "users"
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-300 hover:text-white"
                                }`}
                            >
                                <Shield size={16} className="inline mr-2" />
                                User Management
                            </button>
                        )}
                    </div>
                </div>

                {/* Title & Toggle */}
                <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                            {activeTab === "media" ? "Your Media Collection" : "User Management"}
                        </h1>
                        <p className="text-gray-400 mt-1">
                            {activeTab === "media" 
                                ? "Manage and organize your uploaded content" 
                                : "Manage all users and their permissions"
                            }
                        </p>
                    </div>
                    {activeTab === "media" && (
                        <div className="flex gap-2 items-center p-1 bg-gray-700 rounded-lg">
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-2 rounded-md flex items-center transition-colors duration-200 ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-transparent text-gray-300 hover:bg-gray-600"}`}
                                title="List View"
                            >
                                <List size={20} />
                                <span className="ml-2 hidden sm:inline">List</span>
                            </button>
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2 rounded-md flex items-center transition-colors duration-200 ${viewMode === "grid" ? "bg-blue-600 text-white" : "bg-transparent text-gray-300 hover:bg-gray-600"}`}
                                title="Grid View"
                            >
                                <LayoutGrid size={20} />
                                <span className="ml-2 hidden sm:inline">Grid</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg flex items-center">
                        <AlertCircle size={20} className="mr-2" />
                        <p>{error}</p>
                    </div>
                )}

                {/* Content */}
                {activeTab === "users" ? (
                    renderUserManagement()
                ) : (
                    <>
                        {/* Loading State */}
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                            </div>
                        ) : (
                            <>
                                {/* Empty State */}
                                {media.length === 0 && !error && (
                                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
                                        <Upload size={48} className="mx-auto mb-4 text-gray-500" />
                                        <h2 className="text-xl font-semibold text-gray-200 mb-2">No Media Found</h2>
                                        <p className="text-gray-400 mb-6">You haven't uploaded any media yet. Start sharing your pet's crazy moments!</p>
                                        <Link to="/upload" className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg inline-flex items-center transition duration-200">
                                            <Upload size={18} className="mr-2" />
                                            Upload New Media
                                        </Link>
                                    </div>
                                )}

                                {/* Media Container */}
                                {media.length > 0 && (
                                    <div className={viewMode === "grid"
                                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                                        : "space-y-4"
                                    }>
                                        {media.map((item) => (
                                            <div key={item._id} className={`bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700 transition-all duration-300 hover:shadow-xl ${viewMode === "list" ? "flex flex-col md:flex-row" : ""}`}>
                                                <div className={viewMode === "list" ? "md:w-1/3" : ""}>
                                                    {renderMediaPreview(item)}
                                                </div>
                                                <div className={`p-4 ${viewMode === "list" ? "md:w-2/3" : ""}`}>
                                                    {editingId === item._id ? (
                                                        <div>
                                                            <input
                                                                type="text"
                                                                value={newTitle}
                                                                onChange={(e) => setNewTitle(e.target.value)}
                                                                className="w-full p-3 text-gray-900 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                                placeholder="Enter a title..."
                                                            />
                                                            <div className="flex justify-end gap-2 mt-3">
                                                                <button
                                                                    onClick={() => { setEditingId(null); setNewTitle(""); }}
                                                                    className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg flex items-center transition duration-200"
                                                                >
                                                                    <X size={16} className="mr-1" />
                                                                    Cancel
                                                                </button>
                                                                <button
                                                                    onClick={() => updateMediaTitle(item._id)}
                                                                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center transition duration-200"
                                                                >
                                                                    <Check size={16} className="mr-1" />
                                                                    Save
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                                                            <div className="flex items-center text-sm text-gray-400 mb-4">
                                                                <span>{new Date(item.uploadedAt).toLocaleDateString()}</span>
                                                                <span className="mx-2">•</span>
                                                                <span className="capitalize">{item.type}</span>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => { setEditingId(item._id); setNewTitle(item.title); }}
                                                                    className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center transition duration-200"
                                                                >
                                                                    <Edit size={16} className="mr-1" />
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => deleteMedia(item._id)}
                                                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center transition duration-200"
                                                                >
                                                                    <Trash2 size={16} className="mr-1" />
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>

            {/* Footer */}
            <footer className="bg-gray-800 border-t border-gray-700 py-6 mt-auto">
                <div className="container mx-auto px-4 text-center text-gray-400">
                    <p>© {new Date().getFullYear()} PetCrazy. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Admin;