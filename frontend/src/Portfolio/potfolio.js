import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../Navbar/header";
import "./portfolio.css";

const BACKEND_URL = "https://zen-app-5b3s.onrender.com"; // ✅ live backend

function Portfolio() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch user details
        const userRes = await axios.get(`${BACKEND_URL}/api/users/${id}`);
        setUser(userRes.data);

        // Fetch portfolio
        try {
          const portfolioRes = await axios.get(`${BACKEND_URL}/api/portfolio/${id}`);
          setPortfolio(portfolioRes.data);
        } catch {
          setPortfolio(null);
        }
      } catch (err) {
        console.error("User fetch error:", err);
        setError("User not found");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (error) return <p className="text-center mt-5">{error}</p>;

  return (
    <>
      <Header />
      <div className="portfolio-page">
        {/* ===== User Header ===== */}
        <div className="portfolio-header">
          <img
            src={user.image ? `${BACKEND_URL}${user.image}` : "https://via.placeholder.com/150"}
            alt="Profile"
            className="profile-img"
          />
          <div className="profile-info">
            <h2>{user.username}</h2>
            <p className="bio">{user.bio || "No bio available"}</p>
            <div className="stats">
              <span><strong>{user.posts?.length || 0}</strong> posts</span>
              <span><strong>{user.followers?.length || 0}</strong> followers</span>
              <span><strong>{user.following?.length || 0}</strong> following</span>
            </div>

            {user.skills?.length > 0 && (
              <div className="skills">
                {user.skills.map((s, i) => (
                  <span key={i} className="badge bg-primary me-1">
                    {typeof s === "string" ? s : s.name || "Unnamed"}
                  </span>
                ))}
              </div>
            )}

            {user.achievements?.length > 0 && (
              <ul className="achievements">
                {user.achievements.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <hr />

        {/* ===== Portfolio Projects ===== */}
        {portfolio?.projects?.length > 0 ? (
          <div className="projects-section">
            <h3>Projects</h3>
            <div className="projects-grid">
              {portfolio.projects.map((p, i) => (
                <div key={i} className="project-card">
                  {p.image && <img src={`${BACKEND_URL}${p.image}`} alt={p.title} />}
                  <div className="project-info">
                    <h5>{p.title}</h5>
                    {p.description && <p>{p.description}</p>}
                    {p.link && (
                      <a href={p.link} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">
                        View Project
                      </a>
                    )}
                    {p.date && (
                      <small className="text-muted">
                        {new Date(p.date).toLocaleDateString()}
                      </small>
                    )}
                  </div>
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
