// src/landing_page/UserContext/usercontext.js
import React, { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [goals, setGoals] = useState([]); // ✅ shared globally

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, goals, setGoals }}>
      {children}
    </UserContext.Provider>
  );
};
