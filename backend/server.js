import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import fs from "fs";

import User from "./models/user.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import goalRoutes from "./routes/goalRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";
import postsRoutes from "./routes/postRoutes.js";
import uploadRoutes from "./routes/upload.js";
import portfolioRoutes from "./routes/portfolioRoutes.js";

dotenv.config();
const app = express();

// --------------------
// Middleware
// --------------------
// app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// --------------------
// Routes
// --------------------
app.use("/api/goals", goalRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use(cors({
  origin: [
    "http://localhost:3000", 
    "https://zen-24wj.vercel.app",
    "https://zen-qgbb.vercel.app"   // ✅ add your new frontend URL
  ],
  credentials: true, // required if using cookies or JWT
}));

// --------------------
// File system & __dirname
// --------------------
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve uploaded files
app.use("/uploads/posts", express.static(path.join(__dirname, "uploads/posts")));
app.use("/uploads/profile", express.static(path.join(__dirname, "uploads/profile")));
app.use("/uploads", express.static("uploads"));

// --------------------
// Upload setup
// --------------------
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });


// --------------------
// Upload profile image
// --------------------
app.post("/api/upload/:userId", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No image uploaded" });

    const imagePath = `/uploads/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { image: imagePath },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Image uploaded successfully", user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Image upload failed" });
  }
});

// --------------------
// Upload post image
// --------------------
app.post("/api/upload/post/:userId/:postIndex", upload.single("image"), async (req, res) => {
  try {
    const { userId, postIndex } = req.params;
    if (!req.file) return res.status(400).json({ message: "No image uploaded" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.posts[postIndex]) return res.status(400).json({ message: "Post not found" });

    user.posts[postIndex].image = `/uploads/${req.file.filename}`;
    await user.save();

    res.json({ message: "Post image uploaded successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Post image upload failed" });
  }
});

// --------------------
// Root route
// --------------------
app.get("/", (req, res) => res.send("🚀 Backend is running"));

app.get("/healthz", (req, res) => {
  res.status(200).send("OK");
});

// --------------------
// MongoDB Connection
// --------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// --------------------
// Start Server
// --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
