const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/userSchema");
const auth = require("../middleware/auth.js");

const router = express.Router();

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
            { expiresIn: "24h" } // Added expiration for security
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
                profilePic: user.profilePic,
                role: user.role 
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

router.post("/signup", async (req, res) => {
    try {
        const { name, email, password, phonenumber, gender, address, profilePic } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ msg: "Name, email, and password are required." });
        }

        // Validate email format
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ msg: "Please enter a valid email address." });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ msg: "Password must be at least 6 characters long." });
        }

        // Validate phone number if provided
        if (phonenumber && !/^\d{10}$/.test(phonenumber.replace(/\D/g, ''))) {
            return res.status(400).json({ msg: "Phone number must be 10 digits." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "Email already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ 
            name: name.trim(), 
            email: email.trim().toLowerCase(), 
            password: hashedPassword, 
            phonenumber: phonenumber ? phonenumber.trim() : undefined,
            gender,
            address: address ? address.trim() : undefined,
            profilePic: profilePic || undefined,
            role: "user" 
        });

        await newUser.save();
        res.status(201).json({ msg: "User registered successfully" });
    } catch (error) {
        console.error("Signup error:", error);
        if (error.code === 11000) {
            return res.status(400).json({ msg: "Email already exists." });
        }
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

router.put("/update-profile", auth, async (req, res) => {
    try {
        const { name, phonenumber, gender, address, profilePic } = req.body;
        const userId = req.user.id;

        // Validate required fields
        if (!name || !name.trim()) {
            return res.status(400).json({ msg: "Name is required." });
        }

        // Validate phone number if provided
        if (phonenumber && !/^\d{10}$/.test(phonenumber.replace(/\D/g, ''))) {
            return res.status(400).json({ msg: "Phone number must be 10 digits." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Prevent role modification
        if (req.body.role) {
            return res.status(400).json({ msg: "You cannot modify the role" });
        }

        // Prevent email modification
        if (req.body.email) {
            return res.status(400).json({ msg: "Email cannot be changed" });
        }

        // Update fields
        user.name = name.trim();
        user.phonenumber = phonenumber ? phonenumber.trim() : user.phonenumber;
        user.gender = gender || user.gender;
        user.address = address ? address.trim() : user.address;
        user.profilePic = profilePic !== undefined ? profilePic : user.profilePic;

        await user.save();

        res.json({
            msg: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phonenumber: user.phonenumber,
                gender: user.gender,
                address: user.address,
                profilePic: user.profilePic,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

// NEW: Change password endpoint
router.put("/change-password", auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        // Validate required fields
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ msg: "Current password and new password are required." });
        }

        // Validate new password length
        if (newPassword.length < 6) {
            return res.status(400).json({ msg: "New password must be at least 6 characters long." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            return res.status(400).json({ msg: "Current password is incorrect." });
        }

        // Check if new password is different from current password
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return res.status(400).json({ msg: "New password must be different from current password." });
        }

        // Hash new password and update
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();

        res.json({ msg: "Password changed successfully" });
    } catch (error) {
        console.error("Change password error:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

router.get("/profile", auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            phonenumber: user.phonenumber,
            gender: user.gender,
            address: user.address,
            profilePic: user.profilePic,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        });
    } catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

// Get all users (for admin)
router.get("/", auth, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== "admin") {
            return res.status(403).json({ msg: "Access denied. Admin only." });
        }

        const users = await User.find({}, "_id name email phonenumber gender address profilePic role createdAt")
            .sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        console.error("Fetch users error:", err);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

// Delete user (admin only)
router.delete("/:userId", auth, async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Check if user is admin
        if (req.user.role !== "admin") {
            return res.status(403).json({ msg: "Access denied. Admin only." });
        }

        // Validate userId format
        if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ msg: "Invalid user ID format." });
        }

        // Prevent admin from deleting themselves
        if (req.user.id === userId) {
            return res.status(400).json({ msg: "You cannot delete your own account." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: "User not found." });
        }

        await User.findByIdAndDelete(userId);
        res.json({ msg: "User deleted successfully." });
    } catch (error) {
        console.error("Delete user error:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

// Update user role (admin only)
router.put("/:userId/role", auth, async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;
        
        // Check if user is admin
        if (req.user.role !== "admin") {
            return res.status(403).json({ msg: "Access denied. Admin only." });
        }

        // Validate userId format
        if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ msg: "Invalid user ID format." });
        }

        // Validate role
        if (!["user", "admin"].includes(role)) {
            return res.status(400).json({ msg: "Invalid role. Must be 'user' or 'admin'." });
        }

        // Prevent admin from changing their own role
        if (req.user.id === userId) {
            return res.status(400).json({ msg: "You cannot change your own role." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: "User not found." });
        }

        user.role = role;
        await user.save();

        res.json({ 
            msg: "User role updated successfully.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Update user role error:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

module.exports = router;