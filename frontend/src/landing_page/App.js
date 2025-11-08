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
import { UserContext } from "./UserContext/usercontext";
import Activities from "./Activities/activities";
import ZenHome from "./Home/Zenhome";
import History from "./History/history";
import Portfolio from "../Portfolio/potfolio";
import PortfolioHome from "../Portfolio/Home";

function App() {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [goals, setGoals] = useState([]);

  return (
    <UserContext.Provider
      value={{ currentUser, setCurrentUser, goals, setGoals }}
    >
      <Router>
        <Routes>
          <Route path="/history" element={<History />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/" element={<ZenHome />} />
          <Route path="/goaltracer" element={<GoalTracer />} />
          <Route path="/search" element={<Search />} />
          <Route path="/home" element={<Home />} />
          <Route path="/navbar" element={<Navbar />} />
          <Route path="/header" element={<Header />} />
          <Route path="/user/:id" element={<UserDetail />} />
          <Route path="/" element={<Navigate to="/Zenhome" />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/login"
            element={<Login setCurrentUser={setCurrentUser} />}
          />
          <Route
            path="/profile"
            element={currentUser ? <Profile /> : <Navigate to="/login" />}
          />
          {/* Portfolio Landing Page (Public view of a user’s portfolio) */}
          <Route path="/portfolio/:id" element={<Portfolio />} />
          <Route path="/portfolio/:id/details" element={<Portfolio />} />

          {/* Example: Add your home route or fallback */}
          <Route
            path="*"
            element={
              <div>
                <Header />
                <h2 className="text-center mt-5">Welcome to Zen Portfolio</h2>
              </div>
            }
          />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
