// src/pages/ZenHome/ZenHome.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaTasks, FaUserCircle, FaChartLine, FaLock } from "react-icons/fa";

const ZenHome = () => {
  const navigate = useNavigate();

  return (
    <div style={{ background: "#f5f6fa", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif" }}>
      
      {/* Hero/Header Section */}
      <header
        className="text-center text-white d-flex flex-column justify-content-center align-items-center"
        style={{
          height: "70vh",
          background: "linear-gradient(135deg, #4e54c8, #8f94fb)",
          padding: "2rem",
        }}
      >
        <h1 className="display-3 fw-bold mb-3">ZenLog</h1>
        <p className="lead mb-4 text-light">
          Track your daily activities, monitor progress, and improve productivity.
        </p>
        <div>
          <button
            className="btn btn-light btn-lg me-3 shadow"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <button
            className="btn btn-outline-light btn-lg shadow"
            onClick={() => navigate("/register")}
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Features Section */}
      <section className="container py-5">
        <h2 className="text-center mb-5 fw-bold text-primary">
          Why ZenLog?
        </h2>
        <div className="row g-4 justify-content-center">
          {/* Feature Card */}
          <div className="col-lg-3 col-md-5 col-sm-8">
            <div className="card text-center shadow-lg rounded-4 p-4 h-100 feature-card">
              <FaTasks size={50} className="text-success mb-3" />
              <h5 className="fw-bold">Track Activities</h5>
              <p className="text-muted">
                Log daily tasks and monitor your progress effortlessly.
              </p>
            </div>
          </div>

          <div className="col-lg-3 col-md-5 col-sm-8">
            <div className="card text-center shadow-lg rounded-4 p-4 h-100 feature-card">
              <FaChartLine size={50} className="text-warning mb-3" />
              <h5 className="fw-bold">Monitor Growth</h5>
              <p className="text-muted">
                Visualize your productivity and achieve your goals faster.
              </p>
            </div>
          </div>

          <div className="col-lg-3 col-md-5 col-sm-8">
            <div className="card text-center shadow-lg rounded-4 p-4 h-100 feature-card">
              <FaUserCircle size={50} className="text-primary mb-3" />
              <h5 className="fw-bold">Personal Profile</h5>
              <p className="text-muted">
                Manage your info and customize your ZenLog experience.
              </p>
            </div>
          </div>

          <div className="col-lg-3 col-md-5 col-sm-8">
            <div className="card text-center shadow-lg rounded-4 p-4 h-100 feature-card">
              <FaLock size={50} className="text-danger mb-3" />
              <h5 className="fw-bold">Secure & Private</h5>
              <p className="text-muted">
                Your data is safe with ZenLog. Privacy guaranteed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section
        className="text-center py-5"
        style={{ background: "#4e54c8", color: "#fff" }}
      >
        <h2 className="fw-bold mb-3">Start Your Productivity Journey</h2>
        <p className="mb-4 lead">
          Sign up or login to begin tracking your goals and improving productivity today!
        </p>
        <button
          className="btn btn-light btn-lg me-3 shadow"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
        <button
          className="btn btn-outline-light btn-lg shadow"
          onClick={() => navigate("/register")}
        >
          Sign Up
        </button>
      </section>

      {/* Footer */}
      <footer className="text-center py-4 text-muted">
        <p className="mb-0 fst-italic">
          "Consistency is the key to success. Track, improve, repeat."
        </p>
      </footer>

      {/* Custom Styles */}
      <style>{`
        .feature-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .feature-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 25px rgba(0,0,0,0.15);
        }
        button:hover {
          transform: translateY(-2px);
          transition: all 0.2s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default ZenHome;
