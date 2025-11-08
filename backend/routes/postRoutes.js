import express from "express";
import multer from "multer";
import Post from "../models/post.js";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const { userId, caption } = req.body;
    const imagePath = `/uploads/${req.file.filename}`;

    const newPost = new Post({ userId, caption, image: imagePath });
    await newPost.save();

    res.status(200).json(newPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.userId }).sort({
      createdAt: -1,
    });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching posts" });
  }
});

export default router;
