// src/pages/Userdetail/Userdetail.js
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../Navbar/header";
import { UserContext } from "../UserContext/usercontext";
import "./userdetail.css"; // create similar Instagram-like CSS

const backendURL = "https://zen-app-5b3s.onrender.com"; // ✅ live backend

const Userdetail = () => {
  const { id } = useParams();
  const { currentUser } = useContext(UserContext);

  const [user, setUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalUsers, setModalUsers] = useState([]);

  // -----------------------------
  // Fetch user by ID
  // -----------------------------
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${backendURL}/api/users/${id}`);
        const fetchedUser = res.data;
        setUser(fetchedUser);

        // check if current user is following this user
        if (currentUser) {
          const following = fetchedUser.followers?.some(
            (f) => f === currentUser._id || f._id === currentUser._id
          );
          setIsFollowing(following);
        }
      } catch (err) {
        console.error("Fetch user error:", err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, currentUser]);

  // -----------------------------
  // Follow / unfollow
  // -----------------------------
  const handleFollow = async () => {
    if (!currentUser) return alert("Login to follow users");
    try {
      const res = await axios.post(`${backendURL}/api/users/follow/${id}`, {
        userId: currentUser._id,
      });

      setUser(res.data.targetUser);
      setIsFollowing(res.data.following); // true if now following
    } catch (err) {
      console.error("Follow/unfollow error:", err.response?.data || err);
      alert("Failed to follow/unfollow user");
    }
  };

  // -----------------------------
  // Followers / Following Modal
  // -----------------------------
  const handleOpenModal = async (type) => {
    if (!user) return;

    try {
      const userIds = type === "followers" ? user.followers : user.following;

      if (!userIds?.length) {
        setModalUsers([]);
        setModalTitle(type === "followers" ? "Followers" : "Following");
        setShowModal(true);
        return;
      }

      const usersRes = await Promise.all(
        userIds.map((uid) => axios.get(`${backendURL}/api/users/${uid}`))
      );
      setModalUsers(usersRes.map((res) => res.data));
      setModalTitle(type === "followers" ? "Followers" : "Following");
      setShowModal(true);
    } catch (err) {
      console.error("Error loading modal users:", err);
      alert("Failed to load users");
    }
  };

  if (loading) return <div className="container mt-5">Loading...</div>;
  if (!user) return <div className="container mt-5">User not found</div>;

  return (
    <>
      <Header />

      <div className="insta-profile" style={{ marginTop: "5rem" }}>
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-pic-wrapper">
            <img
              src={user.image ? `${backendURL}${user.image}` : "https://via.placeholder.com/150"}
              alt="Profile"
              className="profile-pic"
            />
          </div>

          <div className="profile-info">
            <h2>{user.username}</h2>
            <div className="profile-stats">
              <span>{user.posts?.length || 0} posts</span>
              <span onClick={() => handleOpenModal("followers")} style={{ cursor: "pointer" }}>
                {user.followers?.length || 0} followers
              </span>
              <span onClick={() => handleOpenModal("following")} style={{ cursor: "pointer" }}>
                {user.following?.length || 0} following
              </span>
            </div>
            <p>{user.bio || "No bio"}</p>

            {currentUser?._id !== user._id && (
              <button
                className={`btn ${isFollowing ? "btn-outline-danger" : "btn-outline-primary"}`}
                onClick={handleFollow}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
            )}
          </div>
        </div>

        <hr />

        {/* Skills */}
        {user.skills?.length > 0 && (
          <div className="profile-section">
            <h5>💡 Skills</h5>
            <div className="skills-list">
              {user.skills.map((s, i) => (
                <span key={i} className="badge bg-primary text-white me-1 mb-1">
                  {typeof s === "string" ? s : s.name || "Unnamed"}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {user.achievements?.length > 0 && (
          <div className="profile-section">
            <h5>🏆 Achievements</h5>
            <ul>
              {user.achievements.map((ach, idx) => (
                <li key={idx}>{ach}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Posts Grid */}
        {user.posts?.length > 0 && (
          <div className="profile-section">
            <h5>📸 Posts</h5>
            <div className="posts-grid">
              {user.posts.map((post, idx) => (
                <div key={idx} className="post-card">
                  {post.image && (
                    <img
                      src={`${backendURL}${post.image}`}
                      alt={post.title || "Post"}
                      className="post-image"
                    />
                  )}
                  <div className="post-overlay">
                    <span>{post.title}</span>
                  </div>
                  {post.date && <small>{new Date(post.date).toLocaleDateString()}</small>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Followers / Following Modal */}
        {showModal && (
          <div className="modal-backdrop" onClick={() => setShowModal(false)}>
            <div className="modal-content scrollable" onClick={(e) => e.stopPropagation()}>
              <h4>{modalTitle}</h4>
              <ul>
                {modalUsers.map((u) => (
                  <li key={u._id}>
                    <img
                      src={u.image ? `${backendURL}${u.image}` : "https://via.placeholder.com/40"}
                      alt={u.username}
                      className="rounded-circle me-2"
                      style={{ width: "30px" }}
                    />
                    {u.username}
                  </li>
                ))}
              </ul>
              <button onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Userdetail;
