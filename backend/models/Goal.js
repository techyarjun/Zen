// models/goal.js
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  day: Number,
  description: String,
  targetProgress: Number,
  done: { type: Boolean, default: false },
});

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: String,
  deadline: Date,
  progress: { type: Number, default: 0 },
  tasks: [taskSchema],
}, { timestamps: true });

export default mongoose.model("Goal", goalSchema);
