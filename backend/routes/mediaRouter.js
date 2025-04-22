// mediaRouter.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const Media = require("../Models/mediaSchema");

const router = express.Router();

// Auth middleware
const authenticateUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Multer setup for uploads
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Upload file or URL
router.post("/upload", authenticateUser, upload.single("file"), async (req, res) => {
  try {
    const { title, url, type } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    let mediaUrl = url;
    if (req.file) {
      mediaUrl = `/uploads/${req.file.filename}`;
    }

    if (!mediaUrl) {
      return res.status(400).json({ message: "Please upload a file or enter a URL" });
    }

    const newMedia = new Media({
      type,
      title,
      url: mediaUrl,
      user: req.userId,
    });

    await newMedia.save();
    res.json({ message: "Upload successful", media: newMedia });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
});

// Get media by type
router.get("/type/:type", async (req, res) => {
  try {
    const query = { type: req.params.type };
    if (req.query.user) {
      query.user = req.query.user;
    }

    const media = await Media.find(query).sort({ uploadedAt: -1 });
    res.json(media);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch media", error: error.message });
  }
});

// Get all images
router.get("/image", async (req, res) => {
  try {
    const images = await Media.find({ type: "image" });
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all videos
router.get("/video", async (req, res) => {
  try {
    const videos = await Media.find({ type: "video" });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get media by user ID
router.get("/user/:userId", async (req, res) => {
  try {
    const media = await Media.find({ user: req.params.userId }).sort({ uploadedAt: -1 });
    res.json(media);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user media", error: error.message });
  }
});

// Delete media by ID
router.delete("/:id", authenticateUser, async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ message: "Media not found" });

    if (media.user.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized to delete this media" });
    }

    if (media.url.startsWith("/uploads/")) {
      const filePath = path.join(__dirname, "..", media.url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Media.findByIdAndDelete(req.params.id);
    res.json({ message: "Media deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete media", error: error.message });
  }
});

// Update media title by ID
router.put("/:id", authenticateUser, async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Title is required" });
    }

    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ message: "Media not found" });

    if (media.user.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized to update this media" });
    }

    media.title = title;
    await media.save();

    res.json({ message: "Media updated successfully", media });
  } catch (err) {
    res.status(500).json({ message: "Failed to update media", error: err.message });
  }
});

module.exports = router;
