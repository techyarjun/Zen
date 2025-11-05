import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../Navbar/navbar";
import "bootstrap/dist/css/bootstrap.min.css";

const Home = () => {
  return (
    <>
      <Navbar />

      <div className="container-fluid bg-light d-flex align-items-center justify-content-center vh-100">
        <div
          className="card text-center shadow-lg p-5"
          style={{
            maxWidth: "700px",
            borderRadius: "1rem",
            background: "linear-gradient(135deg, #e0f7fa, #ffffff)",
          }}
        >
          <h1 className="fw-bold mb-3 text-primary">Welcome to ZenLog</h1>
          <p className="text-secondary mb-4 fs-5">
            ZenLog helps you manage your daily activities, track progress, and
            stay motivated. Build your profile, log your activities, and explore
            motivational features to keep growing every day.
          </p>

          <div className="d-flex justify-content-center gap-3 mt-4">
            <Link to="/register" className="btn btn-primary px-4 py-2 rounded-pill">
              Register
            </Link>
            <Link to="/login" className="btn btn-success px-4 py-2 rounded-pill">
              Login
            </Link>
          </div>

          <p className="text-muted mt-4">
            Stay organized and track your journey all in one place.
          </p>
        </div>
      </div>
    </>
  );
};

export default Home;
