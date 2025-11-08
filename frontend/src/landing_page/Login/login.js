import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../Navbar/navbar";

const Login = ({ setCurrentUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("All fields are required");
      return;
    }

    try {
  const res = await axios.post(
    "https://zen-app-5b3s.onrender.com/api/auth/login",
    {
      username,
      password,
    }
  );


      // ✅ Save token and user details for authentication & future requests
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // ✅ Pass user up to parent component (for global state if used)
      if (setCurrentUser) {
        setCurrentUser(res.data.user);
      }

      // ✅ Redirect after successful login
      navigate("/home");
    } catch (err) {
      console.error("Login error:", err);
      alert(err.response?.data?.msg || "Login failed. Please try again.");
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
            <div
              className="card shadow-lg border-0 rounded-4 p-4"
              style={{ backgroundColor: "#ffffff" }}
            >
              <h2 className="text-center mb-4 text-success fw-bold">
                Welcome Back 👋
              </h2>

              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Username</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Password</label>
                  <input
                    type="password"
                    className="form-control form-control-lg"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-success btn-lg fw-semibold"
                  >
                    Login
                  </button>
                </div>
              </form>

              <p className="mt-4 text-center text-muted">
                Don’t have an account?{" "}
                <Link
                  to="/register"
                  className="text-decoration-none text-primary fw-semibold"
                >
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
