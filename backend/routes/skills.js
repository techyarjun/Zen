// routes/skills.js
import express from "express";
import User from "../models/user.js";

const router = express.Router();

// --------------------
// Get all skills of a user
// GET /api/skills/:userId
// --------------------
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.skills || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// --------------------
// Add a skill
// POST /api/skills/add
// --------------------
router.post("/add", async (req, res) => {
  const { userId, skill, category } = req.body;
  if (!userId || !skill || !category)
    return res.status(400).json({ message: "Missing required fields" });

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Avoid duplicate skills
    const exists = user.skills.find((s) => s.name.toLowerCase() === skill.toLowerCase());
    if (exists) return res.status(400).json({ message: "Skill already exists" });

    user.skills.push({ name: skill, category });
    await user.save();

    res.json(user.skills);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// --------------------
// Remove a skill
// POST /api/skills/remove
// --------------------
router.post("/remove", async (req, res) => {
  const { userId, skill } = req.body;
  if (!userId || !skill) return res.status(400).json({ message: "Missing required fields" });

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.skills = user.skills.filter((s) => s.name !== skill);
    await user.save();

    res.json(user.skills);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
