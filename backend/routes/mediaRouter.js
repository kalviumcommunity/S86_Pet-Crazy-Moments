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
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|webm|ogg|mov|avi|mkv/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed'));
    }
  }
});

// Upload file or URL
router.post("/upload", authenticateUser, upload.single("file"), async (req, res) => {
  try {
    const { title, url, type } = req.body;
    
    if (!title || title.trim() === '') {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!type || !['image', 'video'].includes(type)) {
      return res.status(400).json({ message: "Type must be 'image' or 'video'" });
    }

    let mediaUrl = url;
    
    // Handle file upload
    if (req.file) {
      mediaUrl = `/uploads/${req.file.filename}`;
    }

    // Validate that either file or URL is provided
    if (!mediaUrl || mediaUrl.trim() === '') {
      return res.status(400).json({ message: "Please upload a file or enter a URL" });
    }

    // Create new media document
    const newMedia = new Media({
      type,
      title: title.trim(),
      url: mediaUrl,
      user: req.userId,
    });

    const savedMedia = await newMedia.save();
    
    // Populate user data for response
    await savedMedia.populate('user', 'name email');
    
    res.status(201).json({ 
      message: "Upload successful", 
      media: savedMedia 
    });
  } catch (error) {
    console.error("Upload error:", error);
    
    // Clean up uploaded file if database save fails
    if (req.file) {
      const filePath = path.join(__dirname, "..", "uploads", req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    res.status(500).json({ 
      message: "Upload failed", 
      error: error.message 
    });
  }
});

// Get media by type with optional user filtering
router.get("/type/:type", async (req, res) => {
  try {
    const { type } = req.params;
    
    if (!['image', 'video'].includes(type)) {
      return res.status(400).json({ message: "Type must be 'image' or 'video'" });
    }

    const query = { type };
    
    // Add user filter if provided
    if (req.query.user) {
      query.user = req.query.user;
    }

    const media = await Media.find(query)
      .populate('user', 'name email')
      .sort({ uploadedAt: -1 });
    
    res.json(media);
  } catch (error) {
    console.error("Fetch media error:", error);
    res.status(500).json({ 
      message: "Failed to fetch media", 
      error: error.message 
    });
  }
});

// Get all images (kept for backward compatibility)
router.get("/image", async (req, res) => {
  try {
    const query = { type: "image" };
    
    if (req.query.user) {
      query.user = req.query.user;
    }
    
    const images = await Media.find(query)
      .populate('user', 'name email')
      .sort({ uploadedAt: -1 });
    
    res.json(images);
  } catch (error) {
    console.error("Fetch images error:", error);
    res.status(500).json({ 
      message: "Failed to fetch images", 
      error: error.message 
    });
  }
});

// Get all videos (kept for backward compatibility)
router.get("/video", async (req, res) => {
  try {
    const query = { type: "video" };
    
    if (req.query.user) {
      query.user = req.query.user;
    }
    
    const videos = await Media.find(query)
      .populate('user', 'name email')
      .sort({ uploadedAt: -1 });
    
    res.json(videos);
  } catch (error) {
    console.error("Fetch videos error:", error);
    res.status(500).json({ 
      message: "Failed to fetch videos", 
      error: error.message 
    });
  }
});

// Get media by user ID
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    const media = await Media.find({ user: userId })
      .populate('user', 'name email')
      .sort({ uploadedAt: -1 });
    
    res.json(media);
  } catch (error) {
    console.error("Fetch user media error:", error);
    res.status(500).json({ 
      message: "Failed to fetch user media", 
      error: error.message 
    });
  }
});

// Delete media by ID
router.delete("/:id", authenticateUser, async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    
    if (!media) {
      return res.status(404).json({ message: "Media not found" });
    }

    // Check if user owns this media
    if (media.user.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized to delete this media" });
    }

    // Delete file if it's an uploaded file
    if (media.url.startsWith("/uploads/")) {
      const filePath = path.join(__dirname, "..", media.url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Media.findByIdAndDelete(req.params.id);
    res.json({ message: "Media deleted successfully" });
  } catch (error) {
    console.error("Delete media error:", error);
    res.status(500).json({ 
      message: "Failed to delete media", 
      error: error.message 
    });
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
    
    if (!media) {
      return res.status(404).json({ message: "Media not found" });
    }

    // Check if user owns this media
    if (media.user.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized to update this media" });
    }

    media.title = title.trim();
    const updatedMedia = await media.save();
    
    // Populate user data for response
    await updatedMedia.populate('user', 'name email');

    res.json({ 
      message: "Media updated successfully", 
      media: updatedMedia 
    });
  } catch (error) {
    console.error("Update media error:", error);
    res.status(500).json({ 
      message: "Failed to update media", 
      error: error.message 
    });
  }
});

// Get media statistics (optional - for admin dashboard)
router.get("/stats", authenticateUser, async (req, res) => {
  try {
    const totalMedia = await Media.countDocuments();
    const totalImages = await Media.countDocuments({ type: "image" });
    const totalVideos = await Media.countDocuments({ type: "video" });
    
    res.json({
      total: totalMedia,
      images: totalImages,
      videos: totalVideos
    });
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({ 
      message: "Failed to fetch statistics", 
      error: error.message 
    });
  }
});

module.exports = router;