// src/pages/GoalTracer.js
import React, { useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import Header from "../../Navbar/header";
import { UserContext } from "../UserContext/usercontext";

const backendURL = "https://zen-app-5b3s.onrender.com";

const GoalTracer = () => {
  const { currentUser } = useContext(UserContext);
  const [goals, setGoals] = useState([]);
  const [expandedGoal, setExpandedGoal] = useState(null);
  const [dailyTasks, setDailyTasks] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchGoals = useCallback(async () => {
    if (!currentUser?._id) return;
    try {
      const res = await axios.get(`${backendURL}/api/goals/${currentUser._id}`);
      setGoals(res.data);

      const tasksObj = {};
      res.data.forEach((goal) => {
        tasksObj[goal._id] = goal.tasks?.length ? goal.tasks : generateDailyTasks(goal);
      });
      setDailyTasks(tasksObj);
    } catch (err) {
      console.error(err);
      alert("Failed to load goals");
    }
  }, [currentUser]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const generateDailyTasks = (goal) => {
    if (!goal.deadline) return [];
    const today = new Date();
    const end = new Date(goal.deadline);
    const daysLeft = Math.max(1, Math.ceil((end - today) / (1000 * 60 * 60 * 24)));
    const remainingProgress = 100 - goal.progress;
    const dailyProgress = Math.ceil(remainingProgress / daysLeft);

    return Array.from({ length: daysLeft }, (_, i) => ({
      day: i + 1,
      description: `Task ${i + 1} description`,
      targetProgress: Math.min(goal.progress + dailyProgress * (i + 1), 100),
      done: false,
    }));
  };

  const toggleExpand = (goalId) => setExpandedGoal(expandedGoal === goalId ? null : goalId);

  const handleTaskChange = (goalId, idx, field, value) => {
    setDailyTasks((prev) => ({
      ...prev,
      [goalId]: prev[goalId].map((t, i) =>
        i === idx ? { ...t, [field]: field === "targetProgress" ? Number(value) : value } : t
      ),
    }));
  };

  const handleSaveTasks = async (goalId) => {
    if (!dailyTasks[goalId]) return;
    setSaving(true);
    try {
      await axios.patch(`${backendURL}/api/goals/${goalId}/tasks`, { tasks: dailyTasks[goalId] });
      alert("Tasks saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save tasks");
    } finally {
      setSaving(false);
    }
  };

  const handleCompleteGoal = async (goalId) => {
    try {
      await axios.patch(`${backendURL}/api/goals/${goalId}/complete`);
      alert("Goal marked as completed!");
      fetchGoals();
    } catch (err) {
      console.error(err);
      alert("Failed to complete goal");
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (!window.confirm("Are you sure you want to delete this goal?")) return;
    try {
      await axios.delete(`${backendURL}/api/goals/${goalId}`);
      setGoals((prev) => prev.filter((g) => g._id !== goalId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete goal");
    }
  };

  const calculateProgress = (goalId) => {
    const tasks = dailyTasks[goalId] || [];
    if (!tasks.length) return 0;
    const doneCount = tasks.filter((t) => t.done).length;
    return Math.round((doneCount / tasks.length) * 100);
  };

  const formatDate = (date) => date ? new Date(date).toLocaleDateString("en-GB") : "";

  if (!currentUser) return <p>Loading user...</p>;

  return (
    <>
      <Header />
      <div className="container py-5" style={{ marginTop: "6rem", maxWidth: "900px" }}>
        <h3 className="text-center mb-4 fw-bold text-dark">🎯 Your Active Goals</h3>

        {goals.length === 0 && <p className="text-center text-muted">No active goals!</p>}

        {goals.map((goal, idx) => {
          const progress = calculateProgress(goal._id);
          const start = formatDate(goal.createdAt);
          const end = formatDate(goal.deadline);
          const days = Math.max(1, Math.ceil((new Date(goal.deadline) - new Date(goal.createdAt)) / (1000 * 60 * 60 * 24)));

          return (
            <div key={goal._id} className="p-3 mb-4 shadow-sm rounded-4 bg-white border position-relative goal-card">
              <div
                className="position-absolute top-0 start-0 rounded-start"
                style={{
                  width: "6px",
                  height: "100%",
                  background: `linear-gradient(180deg, #4facfe ${progress}%, #e0e0e0 ${progress}%)`,
                }}
              />

              <div className="d-flex justify-content-between align-items-center" style={{ cursor: "pointer" }} onClick={() => toggleExpand(goal._id)}>
                <div style={{ paddingLeft: "15px" }}>
                  <h5 className="mb-0 fw-semibold text-dark">{idx + 1}. {goal.title} <span className="text-muted small">({days} days)</span></h5>
                  <p className="text-muted mb-1 small">{start} → {end}</p>
                  <p className="text-muted mb-0">{goal.description}</p>
                </div>
                <span className="text-secondary">{expandedGoal === goal._id ? "▲" : "▼"}</span>
              </div>

              {expandedGoal === goal._id && (
                <div className="mt-3 px-2">
                  <h6 className="text-primary mb-2">🗓 Daily Tasks</h6>
                  <ul className="list-group mb-3">
                    {dailyTasks[goal._id]?.map((task, i) => (
                      <li key={i} className="list-group-item d-flex align-items-center justify-content-between gap-2 border-0 border-bottom">
                        <input
                          type="text"
                          value={task.description || ""}
                          onChange={(e) => handleTaskChange(goal._id, i, "description", e.target.value)}
                          className="form-control form-control-sm"
                          placeholder="Enter task description"
                          style={{ flex: 1 }}
                        />
                        <input
                          type="text"
                          value={`Day ${task.day}`}
                          readOnly
                          className="form-control form-control-sm text-center"
                          style={{ width: "80px" }}
                        />
                        <button
                          className={`btn btn-sm ${task.done ? "btn-outline-secondary" : "btn-success"}`}
                          onClick={() => handleTaskChange(goal._id, i, "done", !task.done)}
                        >
                          {task.done ? "Undone" : "Done"}
                        </button>
                      </li>
                    ))}
                  </ul>

                  <div className="d-flex gap-2 justify-content-end">
                    <button className="btn btn-outline-danger btn-sm px-3" onClick={() => handleDeleteGoal(goal._id)}>Delete</button>
                    <button className="btn btn-outline-success btn-sm px-3" onClick={() => handleCompleteGoal(goal._id)}>Complete</button>
                    <button className="btn btn-primary btn-sm px-3" onClick={() => handleSaveTasks(goal._id)} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        .goal-card:hover {
          transform: translateY(-3px);
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        .goal-card input:focus {
          box-shadow: 0 0 3px rgba(79, 172, 254, 0.5);
        }
        .btn-sm {
          border-radius: 6px;
        }
      `}</style>
    </>
  );
};

export default GoalTracer;
