const mongoose = require('mongoose');

const userModel = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phonenumber: { type: String, required: false }, // Change type to String
    gender: { type: String, required: false },
    address: { type: String, required: false },
    profilePic: { type: String, required: false }
});

const userSchema = mongoose.model('user', userModel);
module.exports = userSchema;
