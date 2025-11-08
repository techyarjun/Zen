// backend/routes/upload.js (or wherever your upload routes are)
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import User from "../models/user.js";

const router = express.Router();

// Configure storage for post images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "./uploads/posts";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Upload post image
// Example URL: POST /api/upload/post/:userId?postIndex=0
router.post("/post/:userId", upload.single("image"), async (req, res) => {
  try {
    const { userId } = req.params;
    const { postIndex } = req.query;

    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Ensure postIndex is valid
    const index = parseInt(postIndex);
    if (isNaN(index) || index < 0 || index >= user.posts.length)
      return res.status(400).json({ message: "Invalid post index" });

    // Update the specific post's image
    user.posts[index].image = `/uploads/posts/${req.file.filename}`;
    await user.save();

    res.json({ post: user.posts[index] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to upload post image" });
  }
});

export default router;
