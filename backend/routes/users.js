import express from "express";
import User from "../models/user.js";

const router = express.Router();

// Search users by username
router.get("/search", async (req, res) => {
  const { username } = req.query;
  try {
    const users = await User.find({
      username: { $regex: username, $options: "i" },
    }).select("username phone image skills registeredAt"); // include skills
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// 👤 Get user by ID (UserDetail)
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "username phone image skills bio posts achievements registeredAt"
    ); // include all profile fields

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
