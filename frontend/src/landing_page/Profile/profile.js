// src/pages/Profile/Profile.js
import React, { useRef, useState, useEffect, useContext } from "react";
import axios from "axios";
import Header from "../../Navbar/header";
import { UserContext } from "../UserContext/usercontext";
import Skill from "./showup/skills";
import Posts from "./showup/posts";
import "./profile.css";


const backendURL = "https://zen-app-5b3s.onrender.com";

const Profile = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const fileInputRef = useRef(null);

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    currentUser?.image
      ? `${backendURL}${currentUser.image}`
      : "https://via.placeholder.com/150"
  );

  const [skills, setSkills] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [posts, setPosts] = useState([]);
  const [bioInput, setBioInput] = useState("");

  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalUsers, setModalUsers] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);

  // -----------------------------
  // Load currentUser data
  // -----------------------------
  useEffect(() => {
    if (!currentUser) return;

    let userSkills = currentUser.skills || [];
    if (!Array.isArray(userSkills)) {
      userSkills = Object.values(userSkills)
        .filter((val) => typeof val === "string" || val?.name)
        .map((val) =>
          typeof val === "string" ? { name: val, category: "Unspecified" } : val
        );
    }
    setSkills(userSkills);

    setAchievements(currentUser.achievements || []);
    setPosts(currentUser.posts || []);
    setBioInput(currentUser.bio || "");
    setFollowerCount(currentUser.followers?.length || 0);
    setFollowingCount(currentUser.following?.length || 0);

    setImagePreview(
      currentUser.image
        ? `${backendURL}${currentUser.image}`
        : "https://via.placeholder.com/150"
    );
  }, [currentUser]);

  // -----------------------------
  // Profile Image Upload
  // -----------------------------
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!image) return alert("Select an image first!");
    if (!currentUser?._id) return alert("User not found!");

    const formData = new FormData();
    formData.append("image", image);

    try {
      const res = await axios.post(
        `${backendURL}/api/upload/${currentUser._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setCurrentUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      alert("✅ Profile image updated successfully!");
      setImage(null);
    } catch (err) {
      console.error(err);
      alert("❌ Upload failed.");
    }
  };

  // -----------------------------
  // Followers / Following Modal
  // -----------------------------
  const handleOpenModal = async (type) => {
    try {
      const userIds =
        type === "followers" ? currentUser.followers : currentUser.following;

      if (!userIds?.length) {
        setModalUsers([]);
        setModalTitle(type === "followers" ? "Followers" : "Following");
        setShowModal(true);
        return;
      }

      const usersRes = await Promise.all(
        userIds.map((id) => axios.get(`${backendURL}/api/users/${id}`))
      );
      setModalUsers(usersRes.map((res) => res.data));
      setModalTitle(type === "followers" ? "Followers" : "Following");
      setShowModal(true);
    } catch (err) {
      console.error("Error fetching users:", err);
      alert("Failed to load users.");
    }
  };

  // -----------------------------
  // Save Profile + Posts
  // -----------------------------
  const handleSaveProfile = async () => {
    try {
      const res = await axios.put(
        `${backendURL}/api/users/${currentUser._id}`,
        { bio: bioInput, skills, achievements, posts }
      );

      setCurrentUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      alert("✅ Profile updated successfully!");
      setShowEditModal(false);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update profile.");
    }
  };

  // -----------------------------
  // Handle post image upload in modal
  // -----------------------------
  const handlePostImageChange = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(
        `${backendURL}/api/posts/upload/${currentUser._id}?index=${index}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // Update posts after backend confirms
      const updatedPosts = [...posts];
      updatedPosts[index] = {
        ...updatedPosts[index],
        image: res.data.user.posts[index].image,
      };
      setPosts(updatedPosts);

      // Update currentUser context
      const updatedUser = { ...currentUser, posts: updatedPosts };
      setCurrentUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // ✅ Only alert after successful upload
      alert("✅ Post image uploaded!");
    } catch (err) {
      console.error(err);

      // Only alert if something actually failed
      alert("❌ Failed to upload post image. Please try again.");
    }
  };

  // -----------------------------
  // Add new post row
  // -----------------------------
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostDate, setNewPostDate] = useState("");
  const [newPostImage, setNewPostImage] = useState(null);

  const handleAddNewPost = async () => {
    if (!newPostTitle || !newPostDate) {
      alert("Please enter title and date for the post.");
      return;
    }

    // Temporarily add post without image
    const newPost = { title: newPostTitle, date: newPostDate, image: null };
    const updatedPosts = [...posts, newPost];
    setPosts(updatedPosts);

    // Upload image if selected
    if (newPostImage) {
      const formData = new FormData();
      formData.append("image", newPostImage);

      try {
        const res = await axios.post(
          `${backendURL}/api/posts/upload/${currentUser._id}?index=${
            updatedPosts.length - 1
          }`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        updatedPosts[updatedPosts.length - 1].image =
          res.data.user.posts[updatedPosts.length - 1].image;
        setPosts([...updatedPosts]);

        const updatedUser = { ...currentUser, posts: updatedPosts };
        setCurrentUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        alert("✅ Post added successfully!");
      } catch (err) {
        console.error(err);
        alert("❌ Failed to upload post image.");
      }
    }

    // Reset new post inputs
    setNewPostTitle("");
    setNewPostDate("");
    setNewPostImage(null);
  };

  // -----------------------------
  // Render JSX
  // -----------------------------
  return (
    <>
      <Header />
      <div className="insta-profile">
        {/* Profile Header */}
        <div className="profile-header">
          <div
            className="profile-pic-wrapper"
            onClick={() => fileInputRef.current?.click()}
          >
            <img src={imagePreview} alt="Profile" className="profile-pic" />
            <div className="pic-overlay">
              <span>Edit</span>
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
            {image && (
              <button className="upload-btn" onClick={handleUpload}>
                Update
              </button>
            )}
          </div>

          <div className="profile-info">
            <div className="profile-header-top">
              <h2>{currentUser?.username || "User"}</h2>
              <button
                className="edit-profile-btn"
                onClick={() => setShowEditModal(true)}
              >
                Edit Profile
              </button>
            </div>

            <div className="profile-stats">
              <span>{posts.length} posts</span>
              <span
                style={{ cursor: "pointer", textDecoration: "underline" }}
                onClick={() => handleOpenModal("followers")}
              >
                {followerCount} followers
              </span>
              <span
                style={{ cursor: "pointer", textDecoration: "underline" }}
                onClick={() => handleOpenModal("following")}
              >
                {followingCount} following
              </span>
            </div>

            <div className="profile-bio">{currentUser?.bio || bioInput}</div>
          </div>
        </div>

        <hr className="profile-divider" />

        {/* Skills */}
        <Skill skills={skills} setSkills={setSkills} />

        {/* Achievements */}
        <div className="profile-section">
          <h5>🏆 Achievements</h5>
          <ul className="achievement-list">
            {achievements.map((ach, idx) => (
              <li key={idx}>{ach}</li>
            ))}
          </ul>
        </div>

        {/* Posts */}
        <Posts />

        {/* Followers / Following Modal */}
        {showModal && (
          <div className="modal-backdrop" onClick={() => setShowModal(false)}>
            <div
              className="modal-content scrollable-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <h4>{modalTitle}</h4>
              {modalUsers.length === 0 ? (
                <p>No users found</p>
              ) : (
                <ul>
                  {modalUsers.map((user) => (
                    <li key={user._id}>
                      <img
                        src={
                          user.image
                            ? `${backendURL}${user.image}`
                            : "https://via.placeholder.com/40"
                        }
                        alt={user.username}
                        style={{
                          width: "30px",
                          borderRadius: "50%",
                          marginRight: "10px",
                        }}
                      />
                      {user.username}
                    </li>
                  ))}
                </ul>
              )}
              <button
                className="modal-close-btn"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Edit Profile Modal */}
        {showEditModal && (
          <div
            className="modal-backdrop"
            onClick={() => setShowEditModal(false)}
          >
            <div
              className="modal-content scrollable-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <h4>Edit Profile</h4>

              {/* Bio Input */}
              <label htmlFor="bio">Bio:</label>
              <textarea
                id="bio"
                value={bioInput}
                onChange={(e) => setBioInput(e.target.value)}
                placeholder="Add your bio..."
                rows={4}
              />

              {/* Save Button */}
              <button
                className="follow-btn"
                onClick={() => {
                  // Save bio logic here
                  console.log("Saved Bio:", bioInput);
                  setShowEditModal(false);
                }}
              >
                Save
              </button>

              {/* <textarea value={bioInput} onChange={(e) => setBioInput(e.target.value)} placeholder="Add your bio..." rows={3} style={{ width: "100%", marginBottom: "10px" }} /> */}

              {/* Skills */}
              <Skill skills={skills} setSkills={setSkills} />
              <input
                type="text"
                placeholder="Type a skill and press Enter"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.target.value.trim()) {
                    e.preventDefault();
                    setSkills([
                      ...skills,
                      { name: e.target.value.trim(), category: "Unspecified" },
                    ]);
                    e.target.value = "";
                  }
                }}
                className="form-control"
                style={{ marginBottom: "10px" }}
              />

              {/* Achievements */}
              <label>Achievements:</label>
              <input
                type="text"
                placeholder="Type an achievement and press Enter"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.target.value.trim()) {
                    e.preventDefault();
                    setAchievements([...achievements, e.target.value.trim()]);
                    e.target.value = "";
                  }
                }}
                className="form-control"
                style={{ marginBottom: "10px" }}
              />
              <ul className="achievement-list" style={{ marginBottom: "10px" }}>
                {achievements.map((ach, idx) => (
                  <li key={idx}>
                    {ach}{" "}
                    <button
                      onClick={() =>
                        setAchievements(
                          achievements.filter((_, i) => i !== idx)
                        )
                      }
                      style={{
                        background: "none",
                        border: "none",
                        color: "red",
                        marginLeft: "8px",
                        cursor: "pointer",
                      }}
                    >
                      ✖
                    </button>
                  </li>
                ))}
              </ul>

              {/* Add New Post */}
              <label>Add Post:</label>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginBottom: "10px",
                  flexWrap: "wrap",
                }}
              >
                <input
                  type="text"
                  placeholder="Post title"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  className="form-control"
                />
                <input
                  type="date"
                  value={newPostDate}
                  onChange={(e) => setNewPostDate(e.target.value)}
                  className="form-control"
                  style={{ maxWidth: "150px" }}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewPostImage(e.target.files[0])}
                />
                <button
                  className="follow-btn"
                  style={{ padding: "5px 10px" }}
                  onClick={handleAddNewPost}
                >
                  Add
                </button>
              </div>

              {/* Existing Posts */}
              <label>Existing Posts:</label>
              <ul>
                {posts.map((p, idx) => (
                  <li key={idx} style={{ marginBottom: "10px" }}>
                    {p.title} - <small>{p.date}</small>
                    {p.image && (
                      <img
                        src={`${backendURL}${p.image}`}
                        alt="Post"
                        style={{
                          width: "50px",
                          marginLeft: "10px",
                          verticalAlign: "middle",
                        }}
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePostImageChange(e, idx)}
                      style={{ marginLeft: "10px" }}
                    />
                    <button
                      onClick={() =>
                        setPosts(posts.filter((_, i) => i !== idx))
                      }
                      style={{
                        background: "none",
                        border: "none",
                        color: "red",
                        marginLeft: "10px",
                        cursor: "pointer",
                      }}
                    >
                      ✖
                    </button>
                  </li>
                ))}
              </ul>

              <button className="follow-btn" onClick={handleSaveProfile}>
                Save All Changes
              </button>
              <button
                className="modal-close-btn"
                onClick={() => setShowEditModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
