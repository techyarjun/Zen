// server.js
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

dotenv.config();
const app = express();

// ============================
// Middleware
// ============================
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// ============================
// MongoDB Connection
// ============================
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ============================
// Routes
// ============================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Root route (for testing)
app.get("/", (req, res) => {
  res.send("🚀 Server is running successfully");
});

// ============================
// 🖼 Image Upload Configuration
// ============================

// Create uploads folder automatically if missing
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("📁 'uploads' folder created automatically");
}

// Make uploads folder public
app.use("/uploads", express.static("uploads"));

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// ============================
// ✅ Route: Upload user profile image
// ============================
app.post("/api/upload/:userId", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const imagePath = `/uploads/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { image: imagePath },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log(`✅ Image uploaded for user: ${updatedUser.username || updatedUser.email}`);

    res.json({
      message: "Image uploaded successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("❌ Error uploading image:", err);
    res.status(500).json({ message: "Image upload failed" });
  }
});

// ============================
// Start Server
// ============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
