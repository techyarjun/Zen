import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../Navbar/navbar";

const Register = () => {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username || !phone || !password) {
      alert("All fields are required");
      return;
    }
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        username,
        phone,
        password,
      });
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
        style={{ background: "linear-gradient(135deg, #e0f7fa, #e8f5e9)" }}
      >
        <div className="row justify-content-center w-100">
          <div className="col-md-5 col-lg-4">
            <div className="card shadow-lg border-0 rounded-4 p-4" style={{ backgroundColor: "#ffffff" }}>
              <h2 className="text-center mb-4 text-success fw-bold">
                Create Your Account 🚀
              </h2>

              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Username</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
                  />
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-success btn-lg fw-semibold">
                    Register
                  </button>
                </div>
              </form>

              <p className="mt-4 text-center text-muted">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-decoration-none text-primary fw-semibold"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
