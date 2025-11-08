import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  link: String,
  image: String,
  date: { type: Date, default: Date.now }, // auto-filled if not provided
});

const portfolioSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  projects: [projectSchema],
  skills: [{ type: String }],
  achievements: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

const Portfolio = mongoose.model("Portfolio", portfolioSchema);
export default Portfolio;
