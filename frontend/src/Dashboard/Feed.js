import React from "react";
import "./Style_dash/feed.css";

export default function Feed() {
  return (
    <div className="feed">
      <div className="post-card">
        <h3>Welcome to Zen Feed</h3>
        <p>This is where your posts will appear.</p>
      </div>

      <div className="post-card">
        <p>User posted something here...</p>
      </div>
    </div>
  );
}
