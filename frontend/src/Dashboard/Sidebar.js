import React from "react";
import "./Style_dash/sidebar.css";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-section">
        <h3>Dashboard</h3>
        <ul>
          <li>Home</li>
          <li>Profile</li>
          <li>Messages</li>
          <li>Portfolio</li>
          <li>Settings</li>
        </ul>
      </div>

      <div className="sidebar-section">
        <h3>Shortcuts</h3>
        <ul>
          <li>Skills</li>
          <li>Achievements</li>
          <li>Friends</li>
        </ul>
      </div>
    </div>
  );
}
