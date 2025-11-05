import mongoose from "mongoose";

const goalSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  deadline: { type: Date },
  progress: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("Goal", goalSchema);
