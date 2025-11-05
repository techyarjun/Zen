import express from "express";
import Goal from "../models/goal.js";
import History from "../models/history.js";

const router = express.Router();

// --- Get all goals for a user ---
router.get("/:userId", async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.params.userId });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- Create a new goal ---
router.post("/:userId", async (req, res) => {
  try {
    const { title, description, deadline, progress } = req.body;
    const newGoal = new Goal({
      userId: req.params.userId,
      title,
      description,
      deadline,
      progress: progress || 0,
      tasks: [],
    });
    const savedGoal = await newGoal.save();
    res.status(201).json(savedGoal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- Update goal progress ---
router.patch("/:goalId", async (req, res) => {
  try {
    const { progress } = req.body;
    const updatedGoal = await Goal.findByIdAndUpdate(
      req.params.goalId,
      { progress },
      { new: true }
    );
    res.json(updatedGoal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- Update tasks ---
router.patch("/:goalId/tasks", async (req, res) => {
  try {
    const { tasks } = req.body;
    const updatedGoal = await Goal.findByIdAndUpdate(
      req.params.goalId,
      { tasks },
      { new: true }
    );
    res.json(updatedGoal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- Complete goal ---
router.patch("/:goalId/complete", async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.goalId);
    if (!goal) return res.status(404).json({ message: "Goal not found" });

    // Save to history
    await History.create({
      userId: goal.userId,
      goalTitle: goal.title,
      goalDescription: goal.description,
      startDate: goal.createdAt,
      endDate: goal.deadline,
      status: "completed",
      completedOn: new Date(),
    });

    // Remove from active goals
    await Goal.findByIdAndDelete(req.params.goalId);

    res.json({ message: "Goal marked as completed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to complete goal" });
  }
});

// --- Delete goal ---
router.delete("/:goalId", async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.goalId);
    if (!goal) return res.status(404).json({ message: "Goal not found" });

    // Save to history as deleted
    await History.create({
      userId: goal.userId,
      goalTitle: goal.title,
      goalDescription: goal.description,
      startDate: goal.createdAt,
      endDate: goal.deadline,
      status: "deleted",
      completedOn: new Date(),
    });

    // Remove goal
    await Goal.findByIdAndDelete(req.params.goalId);

    res.json({ message: "Goal deleted and saved to history" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete goal" });
  }
});

export default router;
