import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  goalTitle: String,
  goalDescription: String,
  startDate: Date,
  endDate: Date,
  status: { type: String, enum: ["completed", "deleted"] },
  completedOn: Date,
});

export default mongoose.model("History", historySchema);
