const mongoose = require("mongoose");

const userModel = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 100
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email address']
    },
    password: { 
        type: String, 
        required: true,
        minlength: 6
    },
    phonenumber: { 
        type: String, 
        required: false,
        trim: true,
        validate: {
            validator: function(v) {
                return !v || /^\d{10}$/.test(v.replace(/\D/g, ''));
            },
            message: 'Phone number must be 10 digits'
        }
    }, 
    gender: { 
        type: String, 
        required: false,
        enum: ['male', 'female', 'other'],
        lowercase: true
    },
    address: { 
        type: String, 
        required: false,
        trim: true,
        maxlength: 500
    },
    profilePic: { 
        type: String, 
        required: false,
        trim: true
    },
    role: { 
        type: String, 
        enum: ["user", "admin"], 
        default: "user",
        lowercase: true
    }
}, {
    timestamps: true, // This adds createdAt and updatedAt fields automatically
    toJSON: {
        transform: function(doc, ret) {
            // Remove password from JSON output
            delete ret.password;
            return ret;
        }
    }
});

// Index for faster queries
userModel.index({ email: 1 });
userModel.index({ role: 1 });

// Pre-save middleware to ensure data consistency
userModel.pre('save', function(next) {
    // Ensure email is lowercase
    if (this.email) {
        this.email = this.email.toLowerCase();
    }
    
    // Ensure role is lowercase
    if (this.role) {
        this.role = this.role.toLowerCase();
    }
    
    // Ensure gender is lowercase if provided
    if (this.gender) {
        this.gender = this.gender.toLowerCase();
    }
    
    next();
});

const userSchema = mongoose.model("user", userModel);
module.exports = userSchema;