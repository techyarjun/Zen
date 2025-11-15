import express from "express";
import multer from "multer";
import path from "path";
import User from "../models/userModel.js";


// Storage location for uploads
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// File filter (optional)
const fileFilter = (req, file, cb) => {
  cb(null, true);
};

// Initialize upload
const upload = multer({ storage, fileFilter });

const router = express.Router();

// -------------------- GET USER BY ID --------------------
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -------------------- UPDATE PROFILE --------------------
router.put("/:id", async (req, res) => {
  try {
    const { username, bio, phone } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { username, bio, phone },
      { new: true }
    );

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -------------------- ADD SKILL --------------------
router.put("/:id/skills", async (req, res) => {
  try {
    const { name, category } = req.body;

    const user = await User.findById(req.params.id);
    user.skills.push({ name, category });

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -------------------- DELETE SKILL --------------------
router.delete("/:id/skills/:skillId", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    user.skills = user.skills.filter((s) => s._id.toString() !== req.params.skillId);

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -------------------- ADD ACHIEVEMENT --------------------
router.put("/:id/achievements", async (req, res) => {
  try {
    const { text } = req.body;

    const user = await User.findById(req.params.id);
    user.achievements.push(text);

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -------------------- DELETE ACHIEVEMENT --------------------
router.delete("/:id/achievements/:index", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    user.achievements.splice(req.params.index, 1);

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
