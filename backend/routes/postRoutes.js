// backend/routes/postRoutes.js
import express from "express";
import multer from "multer";
import User from "../models/user.js";
import path from "path";

const router = express.Router();

// Set up multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/posts"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Upload post image
router.post("/upload/:userId", upload.single("image"), async (req, res) => {
  try {
    const { userId } = req.params;
    const { index } = req.query; // index of post
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.posts[index]) user.posts[index] = {}; // create post if doesn't exist
    user.posts[index].image = `/uploads/posts/${req.file.filename}`;
    await user.save();

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
});

export default router;
