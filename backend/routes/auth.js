import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import User from "../models/user.js";

const router = express.Router();

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // folder to save images
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  },
});
const upload = multer({ storage });

// REGISTER with image
router.post("/register", upload.single("image"), async (req, res) => {
  try {
    const { username, phone, password } = req.body;
    if (!username || !phone || !password) {
      return res.status(400).json({ msg: "All fields required" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ msg: "Username taken" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Save image path if provided
    const imagePath = req.file ? `/${req.file.path}` : null;

    const newUser = new User({
      username,
      phone,
      password: hashedPassword,
      image: imagePath,
    });

    const savedUser = await newUser.save();
    res.status(201).json({ msg: "User registered", user: savedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ msg: "All fields required" });

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      msg: "Login successful",
      user: { _id: user._id, username: user.username, phone: user.phone, image: user.image },
      token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
