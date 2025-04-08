import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import gameImage from "../../assets/Good doggy-amico.svg";
import {
  validateName,
  validateEmail,
  validatePassword,
  validatePhoneNumber,
  validateAddress,
  validateGender
} from "../../utils/validation";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState([]);
  const [address, setAddress] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [phonenumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCheckboxChange = (e) => {
    setGender([e.target.value]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    const validations = [
      validateName(name),
      validateEmail(email),
      validatePassword(password),
      validatePhoneNumber(phonenumber),
      validateAddress(address),
      validateGender(gender)
    ];

    const firstError = validations.find((v) => v !== null);
    if (firstError) {
      setError(firstError);
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/users/signup", {
        name,
        email,
        password,
        phonenumber,
        gender: gender[0],
        address,
      });

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.msg || "Error signing up, please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-700 flex items-center justify-center">
      <div className="flex bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl w-full">
        <div className="hidden md:block w-1/2 bg-blue-100">
          <img src={gameImage} alt="Game" className="w-full h-full object-center" />
        </div>

        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">Sign Up</h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded focus:outline-blue-500" />
            
            <div className="flex gap-4">
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-1/2 p-2 border rounded focus:outline-blue-500" />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-1/2 p-2 border rounded focus:outline-blue-500" />
            </div>

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

            <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full p-2 border rounded focus:outline-blue-500" />

            <input type="text" placeholder="Phone Number" value={phonenumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full p-2 border rounded focus:outline-blue-500" />

            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
              Sign Up
            </button>
          </form>

          <p className="text-center mt-4 text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
