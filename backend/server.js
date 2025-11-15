
// backend/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

// Routes
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import goalRoutes from "./routes/goalRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";
import portfolioRoutes from "./routes/portfolioRoutes.js";

dotenv.config();
const app = express();

// --------------------
// CORS Middleware
// --------------------
const allowedOrigins = [
  "http://localhost:3000",
  "https://zen-24wj.vercel.app",
  "https://zen-qgbb.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) callback(null, true);
      else callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// --------------------
// Middleware
// --------------------
app.use(express.json());

// --------------------
// File system & __dirname
// --------------------
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads folders exist
const uploadsDir = path.join(__dirname, "uploads");
const profileUploadDir = path.join(uploadsDir, "profile");
const postUploadDir = path.join(uploadsDir, "posts");

if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
if (!fs.existsSync(profileUploadDir)) fs.mkdirSync(profileUploadDir, { recursive: true });
if (!fs.existsSync(postUploadDir)) fs.mkdirSync(postUploadDir, { recursive: true });

// Serve static files
app.use("/uploads", express.static(uploadsDir));
app.use("/uploads/posts", express.static(postUploadDir));

// --------------------
// Routes
// --------------------
app.use("/api/goals", goalRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/portfolio", portfolioRoutes);

// --------------------
// Root & health check
// --------------------
app.get("/", (req, res) => res.send("🚀 Backend is running"));
app.get("/healthz", (req, res) => res.status(200).send("OK"));

// --------------------
// MongoDB Connection
// --------------------
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// --------------------
// Start Server
// --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
















// // server.js
// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// import multer from "multer";
// import path from "path";
// import fs from "fs";

// import profileroutes from "./routes/profileRoute.js";
// import authRoutes from "./routes/auth.js";
// import User from "./models/userModel.js";
// import goalRoutes from "./routes/goalRoutes.js";
// import historyRoutes from "./routes/historyRoutes.js";
// import postRoutes from "./routes/postRoutes.js";
// import uploadRoutes from "./routes/upload.js";
// import portfolioRoutes from "./routes/portfolioRoutes.js";
// import userRoutes from "./routes/users.js";

// dotenv.config();
// const app = express();

// // --------------------
// // CORS Middleware
// // --------------------
// const allowedOrigins = [
//   "http://localhost:3000",
//   "https://zen-24wj.vercel.app",
//   "https://zen-qgbb.vercel.app",
// ];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) callback(null, true);
//       else callback(new Error("Not allowed by CORS"));
//     },
//     credentials: true,
//   })
// );

// // --------------------
// // Middleware
// // --------------------
// app.use(express.json());

// // --------------------
// // Routes
// // --------------------
// app.use("/api/goals", goalRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/history", historyRoutes);
// app.use("/api/posts", postRoutes);
// app.use("/api/upload", uploadRoutes);
// app.use("/api/portfolio", portfolioRoutes);
// app.use("/api/profileroutes", profileRoutes);

// // --------------------
// // File system & __dirname
// // --------------------
// import { fileURLToPath } from "url";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Serve static uploads
// app.use("/uploads/profile", express.static(path.join(__dirname, "uploads/profile")));
// app.use("/uploads/posts", express.static(path.join(__dirname, "uploads/posts")));

// // Ensure upload folders exist
// const profileUploadDir = path.join(__dirname, "uploads/profile");
// if (!fs.existsSync(profileUploadDir)) fs.mkdirSync(profileUploadDir, { recursive: true });

// const postUploadDir = path.join(__dirname, "uploads/posts");
// if (!fs.existsSync(postUploadDir)) fs.mkdirSync(postUploadDir, { recursive: true });

// // --------------------
// // Multer storage config for profile
// // --------------------
// const profileStorage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, profileUploadDir),
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   },
// });
// const profileUpload = multer({ storage: profileStorage });

// // --------------------
// // Profile image upload route
// // --------------------
// app.post("/api/upload/profile/:userId", profileUpload.single("image"), async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ message: "No image uploaded" });

//     const updatedUser = await User.findByIdAndUpdate(
//       req.params.userId,
//       { profileImage: `uploads/profile/${req.file.filename}` },
//       { new: true }
//     );

//     if (!updatedUser) return res.status(404).json({ message: "User not found" });

//     res.json({ message: "Profile image uploaded successfully", user: updatedUser });
//   } catch (err) {
//     console.error("Profile image upload failed:", err);
//     res.status(500).json({ message: "Profile image upload failed", error: err.message });
//   }
// });

// // --------------------
// // Post image upload route
// // --------------------
// const postStorage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, postUploadDir),
//   filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
// });
// const postUpload = multer({ storage: postStorage });

// app.post("/api/upload/post/:userId/:postIndex", postUpload.single("image"), async (req, res) => {
//   try {
//     const { userId, postIndex } = req.params;
//     if (!req.file) return res.status(400).json({ message: "No image uploaded" });

//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     if (!user.posts[postIndex]) return res.status(400).json({ message: "Post not found" });

//     user.posts[postIndex].image = `uploads/posts/${req.file.filename}`;
//     await user.save();

//     res.json({ message: "Post image uploaded successfully", user });
//   } catch (err) {
//     console.error("Post image upload failed:", err);
//     res.status(500).json({ message: "Post image upload failed", error: err.message });
//   }
// });

// // --------------------
// // Root & health check
// // --------------------
// app.get("/", (req, res) => res.send("🚀 Backend is running"));
// app.get("/healthz", (req, res) => res.status(200).send("OK"));

// // --------------------
// // MongoDB Connection
// // --------------------
// mongoose
//   .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch((err) => console.error("❌ MongoDB connection error:", err));

// // --------------------
// // Start Server
// // --------------------
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// backend/server.js




