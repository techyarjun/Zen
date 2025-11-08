// frontend/src/Portfolio/Home.js
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Header from "../Navbar/header";

const backendURL = "https://your-backend-service.onrender.com";

function PortfolioHome() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchData = async () => {
    try {
      const userRes = await axios.get(`${backendURL}/api/users/${id}`);
      console.log("User data:", userRes.data); // check this
      setUser(userRes.data);

      const portfolioRes = await axios.get(`${backendURL}/api/portfolio/${id}`);
      console.log("Portfolio data:", portfolioRes.data); // check this
      setPortfolio(portfolioRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, [id]);


  if (loading) return <p className="text-center mt-5">Loading portfolio...</p>;
  if (!user || !portfolio) return <p className="text-center mt-5">Portfolio not found.</p>;

  return (
    <>
      <Header />
      <div className="container mt-5">
        {/* User Details */}
        <div className="d-flex align-items-center mb-4">
          <img
            src={user.image ? `${backendURL}${user.image}` : "https://via.placeholder.com/150"}
            alt="Profile"
            style={{ width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover", marginRight: "20px" }}
          />
          <div>
            <h2>{user.username}</h2>
            <p>{user.bio || "No bio available"}</p>
            <div className="mb-2">
              <strong>{user.posts?.length || 0}</strong> posts •{" "}
              <strong>{user.followers?.length || 0}</strong> followers •{" "}
              <strong>{user.following?.length || 0}</strong> following
            </div>
          </div>
        </div>

        <hr />

        {/* Skills */}
        {portfolio.skills?.length > 0 && (
          <section className="mb-4">
            <h3>Skills</h3>
            <ul className="list-inline">
              {portfolio.skills.map((skill, i) => (
                <li key={i} className="list-inline-item badge bg-primary me-2 p-2">
                  {skill}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Achievements */}
        {portfolio.achievements?.length > 0 && (
          <section className="mb-4">
            <h3>Achievements</h3>
            <ul>
              {portfolio.achievements.map((achieve, i) => (
                <li key={i}>{achieve}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Projects */}
        {portfolio.projects?.length > 0 && (
          <section className="mb-4">
            <h3>Projects</h3>
            <div className="d-flex flex-wrap">
              {portfolio.projects.map((project, i) => (
                <div
                  key={i}
                  className="card m-2"
                  style={{ width: "18rem", boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }}
                >
                  {project.image && (
                    <img
                      src={`${backendURL}${project.image}`}
                      className="card-img-top"
                      alt={project.title}
                    />
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{project.title}</h5>
                    <p className="card-text">{project.description}</p>
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noreferrer" className="btn btn-primary">
                        View Project
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="text-center mt-4">
          <Link to={`/portfolio/${id}/details`} className="btn btn-success">
            View Full Portfolio
          </Link>
        </div>
      </div>
    </>
  );
}

export default PortfolioHome;
