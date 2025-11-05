import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../Navbar/header";
import "bootstrap/dist/css/bootstrap.min.css";

const Profile = ({ user, setCurrentUser }) => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    user?.image ? `http://localhost:5000${user.image}` : null
  );

  const handleLogout = () => {
    setCurrentUser(null);
    navigate("/login");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!image || !user?._id) {
      alert("Select an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      const res = await axios.post(
        `http://localhost:5000/api/upload/${user._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setCurrentUser(res.data.user);
      alert("✅ Profile image uploaded successfully!");
    } catch (err) {
      console.error("❌ Upload failed:", err);
      alert("Upload failed. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <div className="container mt-5 pt-5">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">
            <div className="card shadow-lg p-4 rounded-4">
              {/* Profile Header */}
              <div className="d-flex flex-column flex-md-row align-items-center mb-4">
                {/* Profile Image */}
                <div
                  className="rounded-circle border border-primary overflow-hidden me-md-4 mb-3 mb-md-0"
                  style={{ width: "150px", height: "150px" }}
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <p className="text-muted mt-5 text-center">No Image</p>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-grow-1 text-center text-md-start">
                  <h3 className="fw-bold">{user?.username}</h3>
                  <p className="mb-1">
                    <strong>Phone:</strong> {user?.phone || "N/A"}
                  </p>
                  <p className="text-muted mb-0">
                    <strong>Registered:</strong>{" "}
                    {user?.registeredAt
                      ? new Date(user.registeredAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>

              {/* Upload Section */}
              <div className="mb-4 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="form-control mb-2"
                />
                <button className="btn btn-primary me-2" onClick={handleUpload}>
                  Upload Image
                </button>
                <button className="btn btn-outline-danger" onClick={handleLogout}>
                  Logout
                </button>
              </div>

              {/* Posts / Stats (optional, can be added later) */}
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
        </div>
      </div>

      {/* Optional custom CSS */}
      <style>{`
        .card {
          background: linear-gradient(135deg, #ffffff, #f0f8ff);
        }
        .btn-primary {
          background: linear-gradient(45deg, #4f46e5, #9333ea);
          border: none;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        .btn-outline-danger {
          border-color: #ec4899;
          color: #ec4899;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn-outline-danger:hover {
          background-color: #ec4899;
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
      `}</style>
    </>
  );
};

export default Profile;
