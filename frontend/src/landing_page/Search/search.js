// src/pages/Search/Search.js
import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import "./search.css"; // new CSS for Instagram-like cards

const backendURL = "https://zen-app-5b3s.onrender.com";

const Search = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      try {
        const res = await axios.get(
          `${backendURL}/api/users/search?username=${query}`
        );
        setResults(res.data);
      } catch (err) {
        console.error(err);
        setError("Something went wrong while fetching users.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (loading) return <div className="container mt-4">Loading...</div>;
  if (error) return <div className="container mt-4 text-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <h3>
        Search Results for: <span className="text-primary">{query}</span>
      </h3>

      {results.length === 0 ? (
        <p className="mt-3">No users found.</p>
      ) : (
        <div className="search-results-grid mt-3">
          {results.map((user) => (
            <Link
              to={`/user/${user._id}`}
              key={user._id}
              className="search-card"
            >
              <img
                src={
                  user.image
                    ? user.image.startsWith("http")
                      ? user.image
                      : `${backendURL}${user.image}`
                    : "https://via.placeholder.com/100"
                }
                alt={user.username}
                className="search-card-img"
              />
              <div className="search-card-info">
                <strong>{user.username}</strong>
                <p>{user.bio || "No bio"}</p>
                <div className="search-card-skills">
                  {user.skills &&
                    Array.isArray(user.skills) &&
                    user.skills.map((skill, idx) => (
                      <span key={idx} className="badge bg-primary me-1 mb-1">
                        {typeof skill === "string" ? skill : skill.name || skill}
                      </span>
                    ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
