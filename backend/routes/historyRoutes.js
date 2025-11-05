// backend/routes/historyRoutes.js
import express from "express";
import History from "../models/history.js";

const router = express.Router();

// ✅ Save a history record
router.post("/", async (req, res) => {
  try {
    const { userId, goalTitle, goalDescription, startDate, endDate, status } = req.body;

    const record = new History({
      userId,
      goalTitle,
      goalDescription,
      startDate,
      endDate,
      status,
    });

    await record.save();
    res.status(201).json({ message: "History added", record });
  } catch (err) {
    res.status(500).json({ message: "Failed to add history", error: err.message });
  }
});

// ✅ Get all history of a user
router.get("/:userId", async (req, res) => {
  try {
    const records = await History.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch history", error: err.message });
  }
});

export default router;
