import React from "react";
import "./Style_dash/dashboard.css";

import Sidebar from "./Sidebar";
import Rightbar from "./Rightbar";
import Feed from "./Feed";

export default function Dashboard() {
  return (
    <div className="app-container">
      <Sidebar />

      <div className="main-content">
        <Feed />
      </div>

      <Rightbar />
    </div>
  );
}
