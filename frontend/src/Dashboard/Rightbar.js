import React from "react";
import "./Style_dash/rightbar.css";

export default function Rightbar() {
  return (
    <div className="rightbar">
      <div className="right-section">
        <h3>Suggestions</h3>
        <ul>
          <li>User A</li>
          <li>User B</li>
          <li>User C</li>
        </ul>
      </div>

      <div className="right-section">
        <h3>Trending Skills</h3>
        <p>React • Node • SQL • Cloud</p>
      </div>
    </div>
  );
}
