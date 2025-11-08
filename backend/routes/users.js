// backend/routes/users.js
import express from "express";
import User from "../models/user.js";

const router = express.Router();

// -----------------------------
// Search users by username
// -----------------------------
router.get("/search", async (req, res) => {
  const { username } = req.query;
  try {
    const users = await User.find({
      username: { $regex: username, $options: "i" },
    }).select("username phone image skills registeredAt");
    res.json(users);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -----------------------------
// Get user by ID (UserDetail)
// -----------------------------
// server/routes/users.js
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// -----------------------------
// Follow / Unfollow a user
// -----------------------------
router.post("/follow/:id", async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const { userId } = req.body;

    if (!targetUserId || !userId) return res.status(400).json({ msg: "Missing user IDs" });
    if (targetUserId === userId) return res.status(400).json({ msg: "You cannot follow yourself." });

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(userId);

    if (!targetUser || !currentUser) return res.status(404).json({ msg: "User not found." });

    const isFollowing = targetUser.followers.some(f => f.toString() === userId);

    if (isFollowing) {
      await Promise.all([
        User.findByIdAndUpdate(targetUserId, { $pull: { followers: userId } }),
        User.findByIdAndUpdate(userId, { $pull: { following: targetUserId } }),
      ]);
    } else {
      await Promise.all([
        User.findByIdAndUpdate(targetUserId, { $push: { followers: userId } }),
        User.findByIdAndUpdate(userId, { $push: { following: targetUserId } }),
      ]);
    }

    const updatedTargetUser = await User.findById(targetUserId).select(
      "username followers following image bio skills achievements posts"
    );
    const updatedCurrentUser = await User.findById(userId).select(
      "username followers following image bio skills achievements posts"
    );

    res.json({
      msg: isFollowing ? "Unfollowed successfully" : "Followed successfully",
      following: !isFollowing,
      targetUser: updatedTargetUser,
      currentUser: updatedCurrentUser,
    });
  } catch (err) {
    console.error("Follow/unfollow error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// -----------------------------
// Update user profile (bio, skills, achievements, posts)
// -----------------------------
router.put("/:id", async (req, res) => {
  try {
    const { bio, skills, achievements, posts } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        ...(bio && { bio }),
        ...(skills && { skills }),
        ...(achievements && { achievements }),
        ...(posts && { posts }), // now posts can be objects
      },
      { new: true, runValidators: true }
    );

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// -----------------------------
// Add achievement
// -----------------------------
router.post("/:id/achievements", async (req, res) => {
  try {
    const { title, year, description } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $push: { achievements: { title, year, description } } },
      { new: true }
    );
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add achievement" });
  }
});

// -----------------------------
// Add post
// -----------------------------
router.post("/:id/posts", async (req, res) => {
  try {
    const { title, date, description, image } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $push: { posts: { title, date, description, image } } },
      { new: true }
    );
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add post" });
  }
});

// -----------------------------
// Delete user account
// -----------------------------
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ msg: "User not found" });

    await User.updateMany({ followers: req.params.id }, { $pull: { followers: req.params.id } });
    await User.updateMany({ following: req.params.id }, { $pull: { following: req.params.id } });

    res.json({ msg: "User account deleted successfully" });
  } catch (err) {
    console.error("Delete account error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
