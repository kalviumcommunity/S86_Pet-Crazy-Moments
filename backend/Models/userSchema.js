const mongoose = require('mongoose');

const userModel = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required: true,
        unique: true 
    },
    password:{
        type:String,
        required:true
    },
    phonenumber:{
        type:Number
    }
})

const userSchema = new mongoose.model('user',userModel);
module.exports = userSchema;