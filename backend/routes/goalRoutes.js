import express from "express";
import Goal from "../models/goal.js";

const router = express.Router();

// GET all goals for a user
router.get("/:userId", async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.params.userId });
    res.json(goals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch goals" });
  }
});

// POST new goal for user
router.post("/:userId", async (req, res) => {
  try {
    const { title, description, deadline, progress } = req.body;
    const goal = new Goal({
      userId: req.params.userId,
      title,
      description,
      deadline,
      progress,
    });
    await goal.save();
    res.json(goal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create goal" });
  }
});

// PATCH progress
router.patch("/:goalId", async (req, res) => {
  try {
    const updated = await Goal.findByIdAndUpdate(req.params.goalId, { progress: req.body.progress }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update goal" });
  }
});

// DELETE goal
router.delete("/:goalId", async (req, res) => {
  try {
    await Goal.findByIdAndDelete(req.params.goalId);
    res.json({ message: "Goal deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete goal" });
  }
});

export default router;
