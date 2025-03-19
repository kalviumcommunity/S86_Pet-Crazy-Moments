import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import gameImage from '../../assets/Good doggy-amico.svg';

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState([]);
  const [address, setAddress] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCheckboxChange = (e) => {
    const value = e.target.value;
    setGender([value]); // Allow only one selection
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("gender", gender[0] || "");
    formData.append("address", address);
    if (profilePic) formData.append("profilePic", profilePic);

    navigate('/login')
  };

  return (
    <div className="min-h-screen bg-gray-700 flex items-center justify-center">
      <div className="flex bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl w-full">
        {/* Image Section */}
        <div className="hidden md:block w-1/2 bg-blue-100">
          <img src={gameImage} alt="Game" className="w-full h-full object-center" />
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">Sign Up</h2>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded focus:outline-blue-500"
                required
              />
            </div>

            <div className="flex gap-4">
              <div className="w-1/2">
                <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-blue-500"
                  required
                />
              </div>

              <div className="w-1/2">
                <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Gender
              </label>
              <div className="flex gap-4">
                {["Male", "Female", "Other"].map((option) => (
                  <label key={option} className="flex items-center">
                    <input
                      type="checkbox"
                      value={option}
                      checked={gender.includes(option)}
                      onChange={handleCheckboxChange}
                      className="mr-2"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-gray-700 font-medium mb-1">
                Address
              </label>
              <input
                id="address"
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2 border rounded focus:outline-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="profilePic" className="block text-gray-700 font-medium mb-1">
                Profile Picture
              </label>
              <input
                id="profilePic"
                type="file"
                onChange={(e) => setProfilePic(e.target.files[0])}
                className="w-full p-2 border rounded focus:outline-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              Sign Up
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
