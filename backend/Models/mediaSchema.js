// mediaSchema.js
const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema({
    type: { type: String, required: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }
});

module.exports = mongoose.model("Media", mediaSchema);