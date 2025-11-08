import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../../UserContext/usercontext";

const backendURL = "https://zen-app-5b3s.onrender.com";

const Posts = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", image: null });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (currentUser?.posts) {
      setPosts(JSON.parse(JSON.stringify(currentUser.posts)));
    }
  }, [currentUser]);

  // ✅ Upload new post (works on mobile)
  const handleNewPostUpload = async () => {
    if (!newPost.image) return alert("Please select an image!");
    if (!newPost.title.trim()) return alert("Enter a title!");

    const formData = new FormData();
    formData.append("title", newPost.title);
    formData.append("image", newPost.image);

    try {
      setUploading(true);
      const res = await axios.post(
        `${backendURL}/api/posts/upload/${currentUser._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const updatedUser = res.data.user;
      setPosts(updatedUser.posts);
      setCurrentUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setNewPost({ title: "", image: null });
      alert("✅ Post uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to upload post.");
    } finally {
      setUploading(false);
    }
  };

  const handleNewImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setNewPost((prev) => ({ ...prev, image: file }));
  };

  return (
    <div className="profile-section">
      <h5 className="fw-bold">📝 Your Posts</h5>

      {/* ✅ New Post Upload Section */}
     

      {/* ✅ Show All Posts */}
      {posts.length === 0 ? (
        <p className="text-muted text-center">No posts yet. Upload your first one!</p>
      ) : (
        <div className="posts-grid">
          {posts.map((post, idx) => (
            <div key={idx} className="post-card rounded-3 overflow-hidden">
              <div className="post-thumb position-relative">
                <img
                  src={
                    post.image
                      ? post.image.startsWith("http")
                        ? post.image
                        : `${backendURL}${post.image}`
                      : `https://picsum.photos/seed/${idx}/400/400`
                  }
                  alt={post.title}
                  className="post-img"
                  onError={(e) => {
                    e.target.src = `https://picsum.photos/seed/${idx}/400/400`;
                  }}
                />
                <div className="post-overlay">
                  <span>{post.title}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .posts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 12px;
        }
        .post-card {
          position: relative;
          background: #fff;
          border: 1px solid #eee;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .post-card:hover {
          transform: scale(1.03);
        }
        .post-img {
          width: 100%;
          height: 180px;
          object-fit: cover;
        }
        .post-overlay {
          position: absolute;
          bottom: 0;
          width: 100%;
          background: rgba(0, 0, 0, 0.5);
          color: #fff;
          text-align: center;
          padding: 4px 0;
          font-size: 14px;
        }
        .preview img {
          border: 2px solid #ddd;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
        }
        @media (max-width: 600px) {
          .posts-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }
          .post-img {
            height: 140px;
          }
        }
      `}</style>
    </div>
  );
};

export default Posts;
