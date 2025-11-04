//This file is added to search user function

// routes/users.js
import express from "express";
import User from "../models/user.js";

const router = express.Router();

// 🔍 Search users by username
router.get("/search", async (req, res) => {
  try {
    const { username } = req.query;
    if (!username) {
      return res.status(400).json({ error: "Username query is required" });
    }

    const users = await User.find({
      username: { $regex: username, $options: "i" },
    }).select("_id username phone");

    res.json(users);
  } catch (err) {
    console.error("Error searching users:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// 👤 Get user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("username phone");
    if (!user) {
      return res.status(404).json({ msg: "User is not present" });
    }
    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err.message);
    if (err.name === "CastError") {
      return res.status(400).json({ error: "Invalid user ID format" });
    }
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
