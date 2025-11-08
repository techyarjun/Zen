// src/components/GoalForm.js
import React, { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../UserContext/usercontext";

const backendURL = "http://localhost:5000";

const GoalForm = ({ goals, setGoals }) => {
  const { currentUser } = useContext(UserContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("Please enter a goal title");
    setLoading(true);

    try {
      const res = await axios.post(`${backendURL}/api/goals/${currentUser._id}`, {
        title,
        description,
        deadline,
        progress,
      });

      setGoals([res.data, ...goals]);
      setTitle("");
      setDescription("");
      setDeadline("");
      setProgress(0);
      alert("✅ Goal added successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add goal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 shadow-lg rounded-3 bg-white mb-4">
      <h2 className="text-center mb-4 fw-bold text-primary">🎯 Add a Goal</h2>
      <form onSubmit={handleAddGoal} className="d-flex flex-column gap-3">
        <input
          type="text"
          placeholder="Goal Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="form-control rounded-pill px-3 py-2"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="form-control rounded-3 px-3 py-2"
          rows="3"
        />
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="form-control rounded-pill px-3 py-2"
        />
        <div>
          <label className="form-label">Progress: {progress}%</label>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => setProgress(e.target.value)}
            className="form-range"
          />
        </div>
        <button
          type="submit"
          className="btn btn-gradient w-50 mx-auto"
          style={{
            background: "linear-gradient(to right, #0d6efd, #6610f2)",
            color: "#fff",
            fontWeight: "600",
            borderRadius: "50px",
            padding: "10px 0",
          }}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Goal"}
        </button>
      </form>

      <style>{`
        .btn-gradient:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};

export default GoalForm;


//Goal tracer backup
//
//

// // src/pages/GoalTracer.js
// import React, { useContext, useEffect, useState } from "react";
// import axios from "axios";
// import Header from "../../Navbar/header";
// import { UserContext } from "../UserContext/usercontext";

// const backendURL = "http://localhost:5000";

// const GoalTracer = () => {
//   const { currentUser } = useContext(UserContext); // get logged-in user
//   const [goals, setGoals] = useState([]);
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [deadline, setDeadline] = useState("");
//   const [progress, setProgress] = useState(0);
//   const [loading, setLoading] = useState(false);

//   // Fetch goals when user loads
//   useEffect(() => {
//     if (!currentUser?._id) return;
//     fetchGoals();
//   }, [currentUser]);

//   const fetchGoals = async () => {
//     try {
//       const res = await axios.get(`${backendURL}/api/goals/${currentUser._id}`);
//       setGoals(res.data);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to load goals");
//     }
//   };

//   // Add a new goal
//   const handleAddGoal = async (e) => {
//     e.preventDefault();
//     if (!title.trim()) return alert("Goal title is required!");
//     setLoading(true);

//     try {
//       const res = await axios.post(`${backendURL}/api/goals/${currentUser._id}`, {
//         title,
//         description,
//         deadline,
//         progress,
//       });
//       setGoals([res.data, ...goals]); // prepend new goal
//       setTitle("");
//       setDescription("");
//       setDeadline("");
//       setProgress(0);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to add goal");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleProgressChange = (id, newProgress) => {
//     const updatedGoals = goals.map((g) =>
//       g._id === id ? { ...g, progress: newProgress } : g
//     );
//     setGoals(updatedGoals);

//     // Update backend
//     axios.patch(`${backendURL}/api/goals/${id}`, { progress: newProgress }).catch(console.error);
//   };

//   const handleDeleteGoal = (id) => {
//     setGoals(goals.filter((g) => g._id !== id));

//     // Delete from backend
//     axios.delete(`${backendURL}/api/goals/${id}`).catch(console.error);
//   };

//   if (!currentUser) return <p>Loading user...</p>;

//   return (
//     <>
//       <Header />

//       <div className="container py-5" style={{marginTop:"6rem"}}>
//         {/* <h1 className="text-center mb-4 text-primary">📋 Goal Tracker</h1> */}

//         {/* Goal Form */}
//         {/* <div className="p-4 shadow-lg rounded-3 bg-white mb-4">
//           <h2 className="text-center mb-4 fw-bold text-primary">🎯 Add a Goal</h2>
//           <form onSubmit={handleAddGoal} className="d-flex flex-column gap-3">
//             <input
//               type="text"
//               placeholder="Goal Title"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               className="form-control rounded-pill px-3 py-2"
//               required
//             />
//             <textarea
//               placeholder="Description"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               className="form-control rounded-3 px-3 py-2"
//               rows="3"
//             />
//             <input
//               type="date"
//               value={deadline}
//               onChange={(e) => setDeadline(e.target.value)}
//               className="form-control rounded-pill px-3 py-2"
//             />
//             <div>
//               <label className="form-label">Progress: {progress}%</label>
//               <input
//                 type="range"
//                 min="0"
//                 max="100"
//                 value={progress}
//                 onChange={(e) => setProgress(e.target.value)}
//                 className="form-range"
//               />
//             </div>
//             <button
//               type="submit"
//               className="btn btn-gradient w-50 mx-auto"
//               style={{
//                 background: "linear-gradient(to right, #0d6efd, #6610f2)",
//                 color: "#fff",
//                 fontWeight: "600",
//                 borderRadius: "50px",
//                 padding: "10px 0",
//               }}
//               disabled={loading}
//             >
//               {loading ? "Adding..." : "Add Goal"}
//             </button>
//           </form>
//         </div> */}

//         {/* Goals List */}
//         <h3 className="text-center mb-4">📋 Your Goals</h3>
//         {goals.length === 0 && (
//           <p className="text-center text-muted">No goals yet. Add your first goal!</p>
//         )}

//         {goals.map((goal, index) => (
//           <div key={goal._id} className="p-3 mb-3 shadow-sm rounded-3 bg-white border">
//             <h5>{index + 1}. {goal.title}</h5>
//             <p>{goal.description}</p>
//             <p>Deadline: {goal.deadline ? new Date(goal.deadline).toLocaleDateString() : "No deadline"}</p>
//             <p>Progress: {goal.progress}%</p>
//             <input
//               type="range"
//               min="0"
//               max="100"
//               value={goal.progress}
//               onChange={(e) => handleProgressChange(goal._id, e.target.value)}
//               className="form-range"
//             />
//             <button
//               className="btn btn-sm mt-2"
//               onClick={() => handleDeleteGoal(goal._id)}
//             >
//               Done
//             </button>
//           </div>
//         ))}
//       </div>

//       <style>{`
//         .btn-gradient:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 4px 12px rgba(0,0,0,0.2);
//         }
//       `}</style>
//     </>
//   );
// };

// export default GoalTracer;
