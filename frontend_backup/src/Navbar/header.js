// src/navbar/header.js after login
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

function Header() {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const searchRef = useRef();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  // Live search with debounce
  useEffect(() => {
    const fetchResults = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }
      try {
        const res = await axios.get(
          `http://localhost:5000/api/users/search?username=${searchQuery}`
        );
        setSearchResults(res.data);
      } catch (err) {
        console.error(err);
        setSearchResults([]);
      }
    };
    const timeoutId = setTimeout(fetchResults, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchButton = () => {
    // Optional: navigate to a search results page
    // Or treat the button click same as typing
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <nav className="navbar navbar-expand-lg shadow-sm fixed-top">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-3 text-white" to="/">
          Zen
        </Link>

        <button
          className="navbar-toggler bg-light"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNav"
        >
          <ul className="navbar-nav align-items-center">
            <li className="nav-item mx-2">
             {/* Home */}
            </li>

            <li
              className="nav-item mx-2 position-relative"
              ref={searchRef}
              style={{ minWidth: "240px" }}
            >
              <div className="input-group input-group-sm">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  className="btn btn-outline-light"
                  type="button"
                  onClick={handleSearchButton}
                >
                  🔍
                </button>
              </div>
              {searchResults.length > 0 && (
                <ul
                  className="list-group position-absolute mt-1"
                  style={{
                    zIndex: 1000,
                    maxHeight: "250px",
                    overflowY: "auto",
                    width: "100%",
                  }}
                >
                  {searchResults.map((u) => (
                    <li
                      key={u._id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        navigate(`/user/${u._id}`);
                        setSearchQuery("");
                        setSearchResults([]);
                      }}
                    >
                      <span>{u.username}</span>
                      <span className="text-muted">{u.phone}</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            <li className="nav-item dropdown mx-2">
              <span
                className="  text-white fw-semibold"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ cursor: "pointer" }}
              >
                <FontAwesomeIcon icon={faBars} />{" "}
              </span>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="navbarDropdown"
              >
                {user ? (
                  <>
                    <li>
                      <span className="dropdown-item">
                        Hello {user.username}
                      </span>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        className="dropdown-item btn p-0"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <li>
                    <span className="dropdown-item">Welcome</span>
                  </li>
                )}
                <li>
                  <Link className="dropdown-item" to="/todo">
                    Todo
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/project">
                    Project
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/activities">
                    Activity
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>

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
          position: relative;
          transition: color 0.3s ease, transform 0.2s ease;
        }
        .nav-link::after {
          content: "";
          position: absolute;
          width: 0%;
          height: 2px;
          bottom: 0;
          left: 0;
          background-color: #fff;
          transition: width 0.3s ease;
        }
        .nav-link:hover::after {
          width:100%;
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
        .dropdown-menu {
          background-color: #1e3a8a;
        }
        .dropdown-item {
          color: #fff;
        }
        .dropdown-item:hover {
          background-color: #9333ea;
        }
        input.form-control {
          border-radius: 0.25rem;
        }
      `}</style>
    </nav>
  );
}

export default Header;
