// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  registeredAt: { type: Date, default: Date.now },
  image: { type: String }, // 👈 add this
   skills: [String]
});

export default mongoose.model("User", userSchema);
