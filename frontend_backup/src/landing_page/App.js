import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Register from "./Register/register";
import Login from "./Login/login";
import Profile from "./Profile/profile";
import Home from "./Home/home";
import Navbar from "../Navbar/navbar";
import Header from "../Navbar/header";
import UserDetail from "./UserDetail/userdetail";
import Search from "./Search/search";
import GoalTracer from "./Goaltracer/goaltracer";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/goaltracer" element={<GoalTracer />} />
        <Route path="/search" element={<Search />} />
        <Route path="/home" element={<Home />} />
        <Route path="/navbar" element={<Navbar />} />
        <Route path="/header" element={<Header />} />
        <Route path="/user/:id" element={<UserDetail />} />
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/login"
          element={<Login setCurrentUser={setCurrentUser} />}
        />
        <Route
          path="/profile"
          element={
            currentUser ? (
              <Profile user={currentUser} setCurrentUser={setCurrentUser} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
