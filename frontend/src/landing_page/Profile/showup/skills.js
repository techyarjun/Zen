// src/components/Skill.js
import React from "react";

const Skill = ({ skills, setSkills }) => {
  return (
    <div className="profile-section">
      <h5>💡 Skills</h5>
      <div className="skills-container" style={{ marginBottom: "10px" }}>
        {skills.map((skill, idx) => (
          <span key={idx} className="skill-badge">
            {typeof skill === "string" ? skill : skill.name}
            <button
              onClick={() => setSkills(skills.filter((_, i) => i !== idx))}
              style={{
                background: "none",
                border: "none",
                color: "red",
                marginLeft: "5px",
                cursor: "pointer",
              }}
            >
              ✖
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default Skill;
