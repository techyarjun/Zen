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

dotenv.config();
const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use("/api/goals", goalRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Root route
app.get("/", (req, res) => res.send("🚀 Server is running"));

// Image Upload Config
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Upload user profile image
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
    res.status(500).json({ message: "Image upload failed" });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
