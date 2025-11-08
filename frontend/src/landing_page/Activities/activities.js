// src/pages/Activities.js
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Header from "../../Navbar/header";
import { UserContext } from "../UserContext/usercontext";
import GoalForm from "../Goaltracer/GoalForm"; // Import the reusable GoalForm

const backendURL = "https://your-backend-service.onrender.com";

const Activities = () => {
  const { currentUser } = useContext(UserContext);
  const [goals, setGoals] = useState([]);

  // Fetch goals when user loads
  useEffect(() => {
    if (!currentUser?._id) return;
    fetchGoals();
  }, [currentUser]);

  const fetchGoals = async () => {
    try {
      const res = await axios.get(`${backendURL}/api/goals/${currentUser._id}`);
      setGoals(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load goals");
    }
  };

  return (
    <>
      <Header />
      <div className="container py-5 mt-5">
        {/* <h1 className="text-center mb-4 text-primary">📋 My Activities</h1> */}

        {/* Use the reusable GoalForm */}
        <GoalForm goals={goals} setGoals={setGoals} />

        {/* List of Goals */}
        {/* {goals.length === 0 && (
          <p className="text-center text-muted">No goals yet. Add your first goal!</p>
        )}
        {goals.map((goal, index) => (
          <div key={goal._id} className="p-3 mb-3 shadow-sm rounded-3 bg-white border">
            <h5>{index + 1}. {goal.title}</h5>
            <p>{goal.description}</p>
            <p>Deadline: {goal.deadline ? new Date(goal.deadline).toLocaleDateString() : "No deadline"}</p>
            <p>Progress: {goal.progress}%</p>
            <input
              type="range"
              min="0"
              max="100"
              value={goal.progress}
              onChange={(e) => {
                const newProgress = parseInt(e.target.value);
                const updatedGoals = goals.map((g) =>
                  g._id === goal._id ? { ...g, progress: newProgress } : g
                );
                setGoals(updatedGoals);
                axios.patch(`${backendURL}/api/goals/${goal._id}`, { progress: newProgress }).catch(console.error);
              }}
              className="form-range"
            />
            <button
              className="btn btn-danger btn-sm mt-2"
              onClick={() => {
                setGoals(goals.filter((g) => g._id !== goal._id));
                axios.delete(`${backendURL}/api/goals/${goal._id}`).catch(console.error);
              }}
            >
              Done
            </button> */}
          {/* </div>
        ))} */}
      </div>
    </>
  );
};

export default Activities;
