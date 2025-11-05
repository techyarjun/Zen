import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";

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
          `http://localhost:5000/api/users/search?username=${query}`
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
        <div className="list-group mt-3">
          {results.map((user) => (
            <div
              key={user._id}
              className="list-group-item d-flex align-items-center justify-content-between"
            >
              <div className="d-flex align-items-center">
                {/* 🖼️ User Image */}
                <img
                  src={
                    user.image
                      ? user.image.startsWith("http")
                        ? user.image
                        : `http://localhost:5000${user.image}`
                      : "https://via.placeholder.com/60" // default placeholder
                  }
                  alt="User"
                  className="rounded-circle me-3"
                  width="60"
                  height="60"
                  style={{ objectFit: "cover", border: "1px solid #ccc" }}
                />

                {/* 🧾 User Info */}
                <div>
                  <strong>{user.username}</strong>
                  <br />
                  <small>📞 {user.phone}</small>
                  <br />
                  <small className="text-muted">
                    🗓️ Registered:{" "}
                    {user?.registeredAt
                      ? new Date(user.registeredAt).toLocaleDateString()
                      : "N/A"}
                  </small>
                </div>
              </div>

              {/* 🔗 View Profile Button */}
              <Link
                to={`/user/${user._id}`}
                className="btn btn-outline-primary btn-sm"
              >
                View
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
