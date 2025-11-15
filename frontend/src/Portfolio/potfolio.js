import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../Navbar/header";
import "./portfolio.css";

const BACKEND_URL = "https://zen-app-5b3s.onrender.com";

function Portfolio() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${BACKEND_URL}/api/users/${id}`);
        setUser(res.data);
      } catch (err) {
        console.error(err);
        setError("User not found");
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
        <div className="profile-card">
          {/* ===== PROFILE TOP ===== */}
          <div className="profile-top">
            <div className="profile-img-wrapper">
              <img
                src={user.image ? `${BACKEND_URL}${user.image}` : "https://via.placeholder.com/200"}
                alt="Profile"
                className="profile-img"
              />
            </div>
            <div className="profile-info">
              <h2>{user.username}</h2>
              <p className="bio">{user.bio || "No bio available."}</p>

              <div className="stats">
                {/* <div>
                  <strong>{user.posts?.length || 0}</strong>
                  <span>Posts</span>
                </div> */}
                <div>
                  <strong>{user.followers?.length || 0}</strong>
                  <span>Followers</span>
                </div>
                <div>
                  <strong>{user.following?.length || 0}</strong>
                  <span>Following</span>
                </div>
              </div>
            </div>
          </div>

          {/* ===== SKILLS ===== */}
          {user.skills?.length > 0 && (
            <div className="profile-section">
              <h3>Skills</h3>
              <div className="skills-list">
                {user.skills.map((s, i) => (
                  <span key={i} className="skill-tag">
                    {typeof s === "string" ? s : s.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ===== ACHIEVEMENTS ===== */}
          {user.achievements?.length > 0 && (
            <div className="profile-section">
              <h3>Achievements</h3>
              <ul className="achievements-list">
                {user.achievements.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Portfolio;
