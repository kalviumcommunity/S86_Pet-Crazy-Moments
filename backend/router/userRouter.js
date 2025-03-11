const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const userSchema = require("../Models/userSchema");

// Add new user
router.post("/add", async (req, res) => {
    try {
        const { name, email, password, phonenumber } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ msg: "Fill all required fields to add a user" });
        }

        
        const existingUser = await userSchema.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "Email already in use" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new userSchema({ name, email, password: hashedPassword, phonenumber });
        await newUser.save();

        return res.status(201).json({ msg: "User created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal Server Error", error });
    }
});

// Get user list
router.get("/userlist", async (req, res) => {
    try {
        const userData = await userSchema.find();
        return res.status(200).json(userData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal Server Error", error });
    }
});

// Edit user Data
router.put('/update/:id', async(req,res)=>{
    try {
        const {name, email, password, phonenumber} = req.body;
        const userId = req.params.id;

        let dataUpdate = {name,phonenumber};
        if (password) {
            const salt = await bcrypt.genSalt(10);
            dataUpdate.password = await bcrypt.hash(password, salt);
        }

        const userUpdate = await userSchema.findByIdAndUpdate(userId, dataUpdate,{new:true});

        if(!userUpdate){
            return res.status(400).json({msg:"User not found"})
        }

        return res.status(200).json({msg:"User Updated successfully"})
    } catch (error) {
       console.error(error);
       res.status(500).json({msg:"Internal server error"});
    }
})

//Delete user data
router.delete("/delete/:id", async (req, res) => {
    try {
        const userId = req.params.id;

        const userDelete = await userSchema.findByIdAndDelete(userId);

        if (!userDelete) {
            return res.status(404).json({ msg: "User not found" });
        }

        return res.status(200).json({ msg: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal Server Error", error });
    }
});

module.exports = router;