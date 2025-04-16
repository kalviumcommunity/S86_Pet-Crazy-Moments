// routes/entities.js
const express = require("express");
const router = express.Router();
const Entity = require("../Models/Entity");
const User = require("../Models/User");

// Debug endpoint to check what's happening
router.get("/debug", (req, res) => {
  res.json({ message: "API is working" });
});

// Route to get entities created by a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(`Looking for entities for user ID: ${userId}`);
    
    // Validate userId is a number
    if (isNaN(Number(userId))) {
      return res.status(400).json({ message: "User ID must be a number" });
    }
    
    const user = await User.findByPk(userId);

    if (user) {
      const entities = await Entity.findAll({
        where: { created_by: userId },
        include: [{ model: User }],
      });
      console.log(`Found ${entities.length} entities for user ${user.name}`);
      res.json(entities);
    } else {
      res.status(404).json({ message: "User not found." });
    }
  } catch (error) {
    console.error("Error fetching entities:", error);
    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
});

// Route to fetch all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.findAll();
    console.log(`Found ${users.length} users`);
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;