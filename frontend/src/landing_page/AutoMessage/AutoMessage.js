import React, { useEffect, useState } from "react";
import { getAIMotivation } from "./generateMessage";
import "./AutoMessage.css";

const AutoMessage = ({ user }) => {
  const [message, setMessage] = useState("Generating motivational message...");

  useEffect(() => {
    if (user) {
      async function fetchMessage() {
        const msg = await getAIMotivation(user);
        setMessage(msg);
      }
      fetchMessage();
    }
  }, [user]);

  return (
    <div className="auto-message-ai-container">
      <p>💡 {message}</p>
    </div>
  );
};

export default AutoMessage;
