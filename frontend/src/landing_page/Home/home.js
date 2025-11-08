// src/pages/Home.js
import React, { useEffect, useState, useContext, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaTasks, FaUserCircle, FaChartLine } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Header from "../../Navbar/header";
import axios from "axios";
import { UserContext } from "../UserContext/usercontext";
import AutoMessageAI from "../Automsg/AutoMessageAI"; // Auto-message component

const backendURL = "https://zen-app-5b3s.onrender.com";

const Home = () => {
  const navigate = useNavigate();
  const { goals, setGoals } = useContext(UserContext);
  const [user, setUser] = useState(null);

  // Fetch goals function wrapped in useCallback
  const fetchGoals = useCallback(async (userId) => {
    try {
      const res = await axios.get(`${backendURL}/api/goals/${userId}`);
      setGoals(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load goals");
    }
  }, [setGoals]);

  // Fetch user & goals on load
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (loggedInUser) {
      setUser(loggedInUser);
      fetchGoals(loggedInUser._id);
    }
  }, [fetchGoals]);

  if (!user) return null;

  return (
    <>
      <Header />
      <div
        className="vh-100 w-100 d-flex flex-column"
        style={{ overflowY: "auto", background: "#f0f2f5" }}
      >
        {/* Dashboard Cards */}
        <section className="d-flex flex-column justify-content-center align-items-center text-center text-dark flex-grow-1 px-3">
          <h1 className="display-4 fw-bold mb-3 text-primary">
            Welcome, {user.username}!
          </h1>
          <p className="lead mb-3">
            ZenLog helps you manage your daily activities and track progress.
          </p>

          {/* Auto-generated motivational message */}
          <AutoMessageAI user={user} goals={goals} />

          <div className="row w-100 justify-content-center g-4">
            {/* Profile Card */}
            <div className="col-lg-3 col-md-5 col-sm-8">
              <div
                className="card shadow-sm rounded-4 py-4 hover-effect h-100 d-flex flex-column align-items-center justify-content-center text-center"
                onClick={() => navigate("/profile")}
                style={{ cursor: "pointer" }}
              >
                <FaUserCircle size={50} className="text-primary mb-3" />
                <h5 className="fw-bold">My Profile</h5>
                <p className="text-muted small">Update your info & settings</p>
              </div>
            </div>

            {/* Activities Card */}
            <div className="col-lg-3 col-md-5 col-sm-8">
              <div
                className="card shadow-sm rounded-4 py-4 hover-effect h-100 d-flex flex-column align-items-center justify-content-center text-center"
                onClick={() => navigate("/activities")}
                style={{ cursor: "pointer" }}
              >
                <FaTasks size={50} className="text-success mb-3" />
                <h5 className="fw-bold">My Activities</h5>
                <p className="text-muted small">Log & track daily tasks</p>
              </div>
            </div>

            {/* Progress Card */}
            <div className="col-lg-3 col-md-5 col-sm-8">
              <div
                className="card shadow-sm rounded-4 py-4 hover-effect h-100 d-flex flex-column align-items-center justify-content-center text-center"
                onClick={() => navigate("/goaltracer")}
                style={{ cursor: "pointer" }}
              >
                <FaChartLine size={50} className="text-warning mb-3" />
                <h5 className="fw-bold">My Progress</h5>
                <p className="text-muted small">View your growth & stats</p>
              </div>
            </div>
          </div>
        </section>

        <footer className="text-center text-muted py-3 mt-auto">
          <p className="fst-italic mb-0">
            "Consistency is the key to success. Track, improve, repeat."
          </p>
        </footer>
      </div>

      <style>{`
        .hover-effect:hover {
          transform: translateY(-7px);
          transition: all 0.3s ease-in-out;
          box-shadow: 0 12px 25px rgba(0,0,0,0.15);
        }
      `}</style>
    </>
  );
};

export default Home;
