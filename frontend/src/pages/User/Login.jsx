import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import loginImage from "../../assets/Pets with halloween costumes-amico.svg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Mock error handling
  const navigate = useNavigate();

  // Mock form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Example of simple form validation (without backend)
    if (!email || !password) {
      setError("Please fill in all fields.");
    } else {
      setError("");
      console.log(`Logged in with Email: ${email}`);
    }
    navigate('/')
  };

  return (
    <div className="min-h-screen bg-gray-700 flex items-center justify-center">
      <div className="flex  bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl w-full">
        {/* Image Section */}
        <div className=" shrink-0 md:block w-1/2 bg-blue-100">
          <img
            src={loginImage}
            alt="Login"
            className="w-full h-full object-center"
          />
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
            Login
          </h2>

          {error && (
            <p className="text-red-500 text-center mb-4">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-1"
              >
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

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-1"
              >
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

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              Login
            </button>
          </form>

          {/* Signup Link */}
          <p className="text-center mt-4 text-gray-600">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
