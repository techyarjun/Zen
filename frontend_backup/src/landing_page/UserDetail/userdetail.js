import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${id}`);
        setUser(res.data);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError("User is not present");
        } else {
          setError("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) return <div className="container mt-4">Loading...</div>;
  if (error) return <div className="container mt-4 text-danger">{error}</div>;

  // Dynamically compute image URL
  const imageUrl = user.image
    ? user.image.startsWith("http")
      ? user.image
      : `http://localhost:5000${user.image}`
    : "https://via.placeholder.com/150";

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4 rounded-4 mx-auto" style={{ maxWidth: "500px" }}>
        {/* Profile Image */}
        <div className="text-center mb-3">
          <div
            className="rounded-circle border border-primary overflow-hidden"
            style={{ width: "150px", height: "150px" }}
          >
            <img
              src={imageUrl}
              alt={user.username}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>

        {/* User Info */}
        <h3 className="text-center mb-2">{user.username}</h3>
        <p><strong>Phone:</strong> {user.phone || "N/A"}</p>
        <p><strong>Registered:</strong> {user.registeredAt ? new Date(user.registeredAt).toLocaleDateString() : "N/A"}</p>

        {/* Optional Stats (like Profile page) */}
        <div className="d-flex justify-content-around mt-3 border-top pt-3">
          <div>
            <strong>12</strong>
            <p className="mb-0 text-muted">Posts</p>
          </div>
          <div>
            <strong>340</strong>
            <p className="mb-0 text-muted">Followers</p>
          </div>
          <div>
            <strong>180</strong>
            <p className="mb-0 text-muted">Following</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
