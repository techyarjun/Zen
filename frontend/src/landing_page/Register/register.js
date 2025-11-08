// src/pages/Register/Register.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../Navbar/navbar";

const Register = () => {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  // Handle image selection and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username || !phone || !password) {
      alert("All fields are required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("phone", phone);
      formData.append("password", password);
      if (image) formData.append("image", image);

      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert(res.data.msg);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <>
      <Navbar />
      <div
        className="container-fluid min-vh-100 d-flex align-items-center justify-content-center"
        style={{ background: "linear-gradient(135deg, #e0f7fa, #f1f8e9)", marginTop:"4rem"}}
      >
        <div className="row justify-content-center w-100">
          <div className="col-md-5 col-lg-4">
            <div className="card shadow-lg border-0 rounded-4 p-4 bg-white">
              <h2 className="text-center mb-4 text-success fw-bold">
                Create Your Account 🚀
              </h2>

              {/* Image Preview with Upload */}
              <div className="text-center mb-4">
                <div className="position-relative d-inline-block">
                  <img
                    src={imagePreview || "https://via.placeholder.com/120"}
                    alt="Profile Preview"
                    className="rounded-circle shadow-sm"
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                      border: "3px solid #28a745",
                      transition: "transform 0.3s ease",
                    }}
                  />
                  <label
                    htmlFor="imageUpload"
                    className="position-absolute bottom-0 end-0 bg-success text-white rounded-circle p-2"
                    style={{ cursor: "pointer", border: "2px solid white" }}
                  >
                    ✎
                  </label>
                  <input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    className="d-none"
                    onChange={handleImageChange}
                  />
                </div>
                <p className="text-muted mt-2 small">Add profile photo</p>
              </div>

              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Username</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Phone Number</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Enter phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Password</label>
                  <input
                    type="password"
                    className="form-control form-control-lg"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="d-grid mb-3">
                  <button
                    type="submit"
                    className="btn btn-success btn-lg fw-semibold shadow-sm"
                  >
                    Register
                  </button>
                </div>

                <p className="text-center text-muted">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-decoration-none text-primary fw-semibold"
                  >
                    Login
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Custom hover style */}
      <style>{`
        img.rounded-circle:hover {
          transform: scale(1.05);
        }
        button.btn-success:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          transition: all 0.2s ease-in-out;
        }
      `}</style>
    </>
  );
};

export default Register;
