// Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import loginImage from "../../assets/Pets with halloween costumes-amico.svg";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuth();

// In Login.jsx, modify the handleSubmit function

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!email.trim() || !password) {
    setError("Please fill in all fields.");
    return;
  }

  try {
    const response = await axios.post("https://s86-pet-crazy-moments.onrender.com/users/login", {
      email: email.trim(),
      password
    }, {
      headers: { "Content-Type": "application/json" }
    });

    // Store token separately and in user object
    const token = response.data.token;
    const userData = {
      id: response.data.user.id,
      name: response.data.user.name,
      email: response.data.user.email,
      role: response.data.user.role,
      token: token // Important: include token in user object
    };

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    
    setUser(userData);
    navigate(userData.role === "admin" ? "/" : "/");
  } catch (err) {
    setError(err.response?.data?.msg || "Invalid login credentials.");
  }
};

  return (
    <div className="min-h-screen bg-gray-700 flex items-center py-10 px-5 justify-center">
      <div className="flex flex-col justify-center  items-center md:flex-row bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl w-full">
        <div className="shrink-0 hidden md:block w-1/2 bg-blue-100">
          <img src={loginImage} alt="Login" className="w-full h-full object-center" />
        </div>

        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">Login</h2>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium mb-1">Email</label>
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

            <div>
              <label htmlFor="password" className="block text-gray-700 font-medium mb-1">Password</label>
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

            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
              Login
            </button>
          </form>

          <p className="text-center mt-4 text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;