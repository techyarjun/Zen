// frontend/src/Portfolio/Portfolio.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../Navbar/header";
import "./portfolio.css";

const backendURL = "https://your-backend-service.onrender.com";

function Portfolio() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user details
        const userRes = await axios.get(`${backendURL}/api/users/${id}`);
        setUser(userRes.data);

        // Fetch portfolio
        const portfolioRes = await axios.get(`${backendURL}/api/portfolio/${id}`);
        setPortfolio(portfolioRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (!user) return <p className="text-center mt-5">User not found</p>;

  return (
    <>
      <Header />
      <div className="container mt-5 portfolio-page">

        {/* ===== User Details ===== */}
        <div className="user-details">
          <img
            src={user.image ? `${backendURL}${user.image}` : "https://via.placeholder.com/150"}
            alt="Profile"
          />
          <div className="user-info">
            <h2>{user.username}</h2>
            <p>{user.bio || "No bio available"}</p>

            <div className="stats mb-2">
              <strong>{user.posts?.length || 0}</strong> posts •{" "}
              <strong>{user.followers?.length || 0}</strong> followers •{" "}
              <strong>{user.following?.length || 0}</strong> following
            </div>

            {user.skills?.length > 0 && (
              <div className="skills mb-2">
                <strong>Skills:</strong>{" "}
                {user.skills.map((s, i) => (
                  <span key={i} className="badge bg-primary me-1">
                    {typeof s === "string" ? s : s.name || "Unnamed"}
                  </span>
                ))}
              </div>
            )}

            {user.achievements?.length > 0 && (
              <div className="achievements">
                <strong>Achievements:</strong>
                <ul>
                  {user.achievements.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <hr />

        {/* ===== Portfolio Projects ===== */}
        {portfolio?.projects?.length > 0 ? (
          <div>
            <h3>Projects</h3>
            <div className="projects-grid">
              {portfolio.projects.map((p, i) => (
                <div key={i} className="project-card card shadow-sm">
                  {p.image && <img src={`${backendURL}${p.image}`} alt={p.title} />}
                  <div className="project-overlay">
                    <h5>{p.title}</h5>
                    {p.link && (
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-primary btn-sm mt-1"
                      >
                        View Project
                      </a>
                    )}
                  </div>
                  {p.date && (
                    <p className="text-muted mt-2" style={{ fontSize: "0.8rem" }}>
                      {new Date(p.date).toLocaleDateString()}
                    </p>
                  )}
                  {p.description && <p className="mt-1">{p.description}</p>}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center mt-3">No projects added yet.</p>
        )}
      </div>
    </>
  );
}

export default Portfolio;
