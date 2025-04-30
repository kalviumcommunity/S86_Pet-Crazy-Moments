// userRouter.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/userSchema");
const auth = require("../middleware/auth.js"); // Import the auth middleware

const router = express.Router();

// User Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ msg: "Email and password are required." });
        }

        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ msg: "Invalid email or password." });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({ 
            token, 
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email,
                phonenumber: user.phonenumber,
                gender: user.gender,
                address: user.address,
                role: user.role 
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

// User Signup
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password, phonenumber, gender, address } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ msg: "Name, email, and password are required." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "Email already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ 
            name, 
            email, 
            password: hashedPassword, 
            phonenumber,
            gender,
            address,
            role: "user" 
        });

        await newUser.save();
        res.status(201).json({ msg: "User registered successfully" });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

// Update user profile
router.put("/update-profile", auth, async (req, res) => {
    try {
        const { name, phonenumber, gender, address } = req.body;
        const userId = req.user.id;

        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Update the user fields
        if (name) user.name = name;
        if (phonenumber) user.phonenumber = phonenumber;
        if (gender) user.gender = gender;
        if (address) user.address = address;

        // Save the updated user
        await user.save();

        // Return the updated user data
        res.json({
            msg: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phonenumber: user.phonenumber,
                gender: user.gender,
                address: user.address,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

// Get user profile
router.get("/profile", auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        
        res.json(user);
    } catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

// Get all users (basic info only)
router.get("/", async (req, res) => {
    try {
      const users = await User.find({}, "_id name email"); 
      res.json(users);
    } catch (err) {
      console.error("Fetch users error:", err);
      res.status(500).json({ msg: "Internal Server Error" });
    }
});

module.exports = router;