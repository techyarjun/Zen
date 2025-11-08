import React, { useEffect, useState } from "react";

// Simple free auto-message generator based on goals or history
const AutoMessageAI = ({ user, goals }) => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) return;

    // Generate message based on goals
    if (goals?.length > 0) {
      const nextGoal = goals.find(g => !g.completed);
      if (nextGoal) {
        setMessage(`💡 Keep pushing! Your next goal is "${nextGoal.title}". You can do it!`);
      } else {
        setMessage("🎉 All goals completed! Take a break and celebrate your achievements!");
      }
    } else {
      setMessage("🌟 Set your first goal today and start your journey to success!");
    }
  }, [user, goals]);

  return (
    <div 
      className="auto-msg-container shadow-sm rounded-3 p-3 mb-4"
      style={{
        background: "#fff3cd",
        border: "1px solid #ffeeba",
        color: "#856404",
        fontWeight: "500",
        fontSize: "1rem",
        textAlign: "center"
      }}
    >
      {message}
    </div>
  );
};

export default AutoMessageAI;
