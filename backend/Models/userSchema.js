const mongoose = require("mongoose");

const userModel = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phonenumber: { type: String, required: false }, 
    gender: { type: String, required: false },
    address: { type: String, required: false },
    profilePic: { type: String, required: false },
    role: { type: String, enum: ["user", "admin"], default: "user" } // Default role is 'user'
});

const userSchema = mongoose.model("user", userModel);
module.exports = userSchema;
