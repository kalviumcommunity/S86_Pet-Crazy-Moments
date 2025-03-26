const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema({
    type: { type: String, required: true }, // "image" or "video"
    title: { type: String, required: true }, // Added title field
    url: { type: String, required: true }, // File path or external link
    uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Media", mediaSchema);
