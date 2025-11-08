// src/pages/Profile/showup/posts.js
import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../../UserContext/usercontext";

const backendURL = "http://localhost:5000";

const Posts = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (currentUser?.posts) {
      // Make a deep copy to avoid state mutation issues
      setPosts(JSON.parse(JSON.stringify(currentUser.posts)));
    }
  }, [currentUser]);

  const handlePostImageChange = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(
        `${backendURL}/api/posts/upload/${currentUser._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // Update posts array with the new image URL
      const updatedPosts = [...posts];
      updatedPosts[index] = {
        ...updatedPosts[index],
        image: res.data.user.posts[index].image, // ensure correct path
      };
      setPosts(updatedPosts);

      // Update context immediately
      const updatedUser = { ...currentUser, posts: updatedPosts };
      setCurrentUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      console.error(err);
      alert("❌ Failed to upload post image.");
    }
  };

  return (
    <div className="profile-section">
      <h5>📝 Posts</h5>
      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <div className="posts-grid">
          {posts.map((post, idx) => (
            <div key={idx} className="post-card">
              <div className="post-thumb">
                <img
                  src={
                    post.image
                      ? post.image.startsWith("http")
                        ? post.image
                        : `${backendURL}${post.image}`
                      : `https://picsum.photos/seed/${idx}/300/300`
                  }
                  alt={post.title}
                  onError={(e) => {
                    e.target.src = `https://picsum.photos/seed/${idx}/300/300`;
                  }}
                />
                <div className="post-overlay">
                  <span>{post.title}</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handlePostImageChange(e, idx)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Posts;
