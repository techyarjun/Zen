// src/Navbar/Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg shadow-sm fixed-top">
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand fw-bold fs-3 text-white" to="/">
          Zen
        </Link>

        {/* Hamburger toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <FontAwesomeIcon icon={faBars} className="text-white" />
        </button>

        {/* Navbar menu */}
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav align-items-center">
            <li className="nav-item mx-2">
              <Link className="nav-link text-white fw-semibold" to="/home">
                Home
              </Link>
            </li>

            {/* Dropdown menu using hamburger */}
            <li className="nav-item dropdown mx-2">
              <span
                className="nav-link  text-white fw-semibold"
                role="button"
                id="menuDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ cursor: "pointer" }}
              >
                <FontAwesomeIcon icon={faBars} />
              </span>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="menuDropdown"
              >
                <li>
                  <Link className="dropdown-item" to="/login">
                    Login
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/register">
                    Register
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/profile">
                    Profile
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>

      {/* Gradient & hover CSS */}
      <style>{`
        .navbar {
          background: linear-gradient(90deg, #1e3a8a, #9333ea, #ec4899);
          background-size: 200% 200%;
          animation: gradientFlow 10s ease infinite;
        }
        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .nav-link {
          transition: color 0.3s ease, transform 0.2s ease;
        }
        .nav-link:hover {
          color: #fff !important;
          transform: translateY(-2px);
          text-shadow: 0 0 10px rgba(255,255,255,0.7);
        }
        .navbar-brand {
          text-shadow: 0 0 10px rgba(255,255,255,0.8);
          transition: transform 0.3s ease;
        }
        .navbar-brand:hover {
          transform: scale(1.05);
        }
      `}</style>
    </nav>
  );
}

export default Navbar;
