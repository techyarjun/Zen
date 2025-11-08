import express from "express";
import Portfolio from "../models/Portfolio.js";

const router = express.Router();

// ---------------------------
// Create a portfolio for a user
// ---------------------------
router.post("/create/:userId", async (req, res) => {
  const { userId } = req.params;
  const { skills, achievements, projects } = req.body;

  try {
    // Check if portfolio already exists
    const existing = await Portfolio.findOne({ userId });
    if (existing) return res.status(400).json({ message: "Portfolio already exists" });

    // Create new portfolio
    const portfolio = new Portfolio({
      userId,
      skills: skills || [],
      achievements: achievements || [],
      projects: projects || [],
    });

    await portfolio.save();
    res.status(201).json({ message: "Portfolio created successfully", portfolio });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
