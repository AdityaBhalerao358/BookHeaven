const router = require("express").Router();
const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const {authenticateToken} = require("./user.Auth");


//sign up
router.post("/sign-up", async (req, res) => {
  try {
    const { username, email, password, address } = req.body;

    // Validations
    if (username.length < 4) {
      return res.status(400).json({
        message: "Username length should be greater than 3",
      });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    if (password.length <= 5) {
      return res.status(400).json({
        message: "Password length should be greater than 5",
      });
    }

    // ✅ Hash password using bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      username,
      email,
      password: hashedPassword, // ✅ Store hashed password
      address,
    });

    await newUser.save();

    return res.status(201).json({ message: "Signup Successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// sign in
router.post("/sign-in", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUsername = await User.findOne({ username });
    if (!existingUsername) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUsername.password);

    if (isPasswordCorrect) {
     const authClaims = {
      id: existingUsername.id,
      name: existingUsername.username,
      role: existingUsername.role,
     };

      const token = jwt.sign(authClaims, "bookStore123", {
        expiresIn: "3000d",
      });

      return res.status(200).json({
        id: existingUsername._id,
        role: existingUsername.role,
        token: token,
      });
    } else {
      return res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Sign-in error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//get-user-in-infromatin
router.get("/get-user-information", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await User.findById(userId).select("-password"); // exclude password
    return res.status(200).json(data);
  } catch (error) {
    console.error("User info error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//update address
router.put("/update-address",authenticateToken,async (req,res)=>{
  try{
    const {id} = req.headers;
    const {address}= req.body;
    await User.findByIdAndUpdate(id,{address:address})
     return res.status(200).json({message:"Address updated successfully"});

  }catch(error){
     res.status(500).json({ message: "Internal server error" });
  }
})
module.exports = router;
 