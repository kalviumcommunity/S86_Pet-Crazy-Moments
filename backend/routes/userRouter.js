const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSchema = require("../Models/userSchema");

// User Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ msg: "Please provide both email and password." });
        }

        const user = await userSchema.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "Invalid email or password." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid email or password." });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.json({ 
            token, 
            user: { id: user._id, name: user.name, email: user.email, phonenumber: user.phonenumber }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

// User Signup Route
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password, phonenumber } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ msg: "All fields are required" });
        }

        // Check if email already exists
        const existingUser = await userSchema.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "Email already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new userSchema({ 
            name, 
            email, 
            password: hashedPassword, 
            phonenumber 
        });

        await newUser.save();

        return res.status(201).json({ msg: "User registered successfully" });
    } catch (error) {
        console.error("Signup error:", error); // Log the error for debugging
        res.status(500).json({ msg: "Internal Server Error", error: error.message });
    }
});
module.exports = router;
