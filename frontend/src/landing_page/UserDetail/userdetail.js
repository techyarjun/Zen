// src/pages/Userdetail/Userdetail.js
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../Navbar/header";
import { UserContext } from "../UserContext/usercontext";

const backendURL = "http://localhost:5000";

const Userdetail = () => {
  const { id } = useParams();
  const { currentUser } = useContext(UserContext);

  const [user, setUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalUsers, setModalUsers] = useState([]);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${backendURL}/api/users/${id}`);
        setUser(res.data);

        if (currentUser && res.data.followers?.includes(currentUser._id)) {
          setIsFollowing(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, currentUser]);

  // Follow / unfollow
  // Follow / unfollow
const handleFollow = async () => {
  if (!currentUser) return alert("Login to follow users");
  try {
    const res = await axios.post(
      `${backendURL}/api/users/follow/${id}`, // note: /follow/:id
      { userId: currentUser._id }
    );

    // Update frontend state
    setUser(res.data.targetUser);
    setIsFollowing(res.data.following); // true if now following
  } catch (err) {
    console.error(err.response?.data || err);
    alert("Follow/unfollow failed");
  }
};


  // Followers / Following modal
  const handleOpenModal = async (type) => {
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
      console.error(err);
      alert("Failed to load users.");
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
              <span
                onClick={() => handleOpenModal("followers")}
                style={{ cursor: "pointer" }}
              >
                {user.followers?.length || 0} followers
              </span>
              <span
                onClick={() => handleOpenModal("following")}
                style={{ cursor: "pointer" }}
              >
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
                <span key={i} className="badge bg-primary text-white">
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

        {/* Posts */}
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
                      style={{ width: "100%", height: "200px", objectFit: "cover" }}
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
            <div className="modal-content scrollable" onClick={e => e.stopPropagation()}>
              <h4>{modalTitle}</h4>
              <ul>
                {modalUsers.map((u) => (
                  <li key={u._id}>
                    <img
                      src={u.image ? `${backendURL}${u.image}` : "https://via.placeholder.com/40"}
                      alt={u.username}
                      style={{ width: "30px", borderRadius: "50%", marginRight: "10px" }}
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
