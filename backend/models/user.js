import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  image: { type: String }, // optional post image
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  image: { type: String },
  bio: { type: String, default: "" },
  skills: [
  {
    name: { type: String, trim: true },
    category: { type: String, default: "Other" },
  },
],

  achievements: { type: [String], default: [] },
  posts: { type: [postSchema], default: [] }, // array of post objects
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  registeredAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
