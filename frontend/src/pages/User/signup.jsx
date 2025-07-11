// Signup.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import gameImage from "../../assets/Good doggy-amico.svg";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    address: "",
    phonenumber: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenderChange = (e) => {
    setFormData(prev => ({
      ...prev,
      gender: e.target.value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (formData.phonenumber && !/^\d{10}$/.test(formData.phonenumber.replace(/\D/g, ''))) {
      setError("Phone number must be 10 digits");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/signup`, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        gender: formData.gender,
        address: formData.address.trim(),
        phonenumber: formData.phonenumber.trim()
      }, {
        headers: { "Content-Type": "application/json" }
      });

      alert("Account created successfully! Please login.");
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.response?.data?.msg || "Error signing up, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-700 py-10 px-5 flex items-center justify-center">
      <div className="flex bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl w-full">
        <div className="hidden md:block w-1/2 bg-blue-100">
          <img src={gameImage} alt="Game" className="w-full h-full object-center" />
        </div>

        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">Sign Up</h2>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
                Full Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:outline-blue-500"
                required
                disabled={loading}
              />
            </div>

            <div className="flex gap-4">
              <div className="w-1/2">
                <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
                  Email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-blue-500"
                  required
                  disabled={loading}
                />
              </div>

              <div className="w-1/2">
                <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
                  Password *
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password (min 6 chars)"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-blue-500"
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Gender</label>
              <div className="flex gap-4">
                {["male", "female", "other"].map((option) => (
                  <label key={option} className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value={option}
                      checked={formData.gender === option}
                      onChange={handleGenderChange}
                      className="mr-2"
                      disabled={loading}
                    />
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-gray-700 font-medium mb-1">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:outline-blue-500"
                rows="3"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="phonenumber" className="block text-gray-700 font-medium mb-1">
                Phone Number
              </label>
              <input
                id="phonenumber"
                name="phonenumber"
                type="tel"
                placeholder="Phone Number"
                value={formData.phonenumber}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:outline-blue-500"
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center mt-4 text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;