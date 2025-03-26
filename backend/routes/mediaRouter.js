const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Media = require("../models/mediaSchema");

const router = express.Router();

// Multer storage for file uploads
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// Upload file or link
router.post("/upload", upload.single("file"), async (req, res) => {
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

        const newMedia = new Media({ type, title, url: mediaUrl });
        await newMedia.save();

        res.json({ message: "Upload successful", media: newMedia });
    } catch (error) {
        res.status(500).json({ message: "Upload failed", error });
    }
});

// Fetch media (Images/Videos)
router.get("/:type", async (req, res) => {
    try {
        const media = await Media.find({ type: req.params.type });
        res.json(media);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch media", error });
    }
});

router.get("/media/video", async (req, res) => {
    try {
        const videos = await Media.find({ type: "video" }); // Fetch only videos
        res.json(videos);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch videos", error });
    }
});

// Delete media by ID
router.delete("/:id", async (req, res) => {
    try {
        const media = await Media.findById(req.params.id);
        if (!media) return res.status(404).json({ message: "Media not found" });

        // Delete file from server if stored locally
        if (media.url.startsWith("/uploads/")) {
            const filePath = path.join(__dirname, "..", media.url);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await Media.findByIdAndDelete(req.params.id);
        res.json({ message: "Media deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete media", error });
    }
});

// Update media title
router.put("/:id", async (req, res) => {
    try {
        const { title } = req.body;
        if (!title) return res.status(400).json({ message: "Title is required" });

        const media = await Media.findByIdAndUpdate(req.params.id, { title }, { new: true });
        if (!media) return res.status(404).json({ message: "Media not found" });

        res.json({ message: "Media updated successfully", media });
    } catch (error) {
        res.status(500).json({ message: "Failed to update media", error });
    }
});

module.exports = router;
