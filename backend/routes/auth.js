import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.js";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, phone, password } = req.body;
    if (!username || !phone || !password)
      return res.status(400).json({ msg: "All fields required" });

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ msg: "Username taken" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, phone, password: hashedPassword });
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

    res.status(200).json({ msg: "Login successful", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
