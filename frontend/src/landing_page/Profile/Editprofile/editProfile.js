// // // src/landing_page/Profile/EditProfile/editprofile.js
// // import React, { useState, useEffect } from "react";
// // import axios from "axios";
// // import "./editprofile.css";

// // const BACKEND_URL = "https://zen-app-5b3s.onrender.com";

// // const EditProfile = ({ user, onClose, onUpdate }) => {
// //   // ✅ Add safety check before reading properties
// //   const [formData, setFormData] = useState({
// //     username: "",
// //     bio: "",
// //     skills: [],
// //     achievements: [],
// //   });

// //   const [skillInput, setSkillInput] = useState("");
// //   const [achievementInput, setAchievementInput] = useState("");

// //   // ✅ Load user data safely when it's available
// //   useEffect(() => {
// //     if (user) {
// //       setFormData({
// //         username: user.username || "",
// //         bio: user.bio || "",
// //         skills: user.skills || [],
// //         achievements: user.achievements || [],
// //       });
// //     }
// //   }, [user]);

// //   if (!user) {
// //     return (
// //       <div className="edit-modal">
// //         <div className="edit-modal-content">
// //           <p>Loading profile...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   const handleChange = (e) => {
// //     setFormData({ ...formData, [e.target.name]: e.target.value });
// //   };

// //   const handleAddSkill = () => {
// //     if (skillInput.trim()) {
// //       setFormData({
// //         ...formData,
// //         skills: [...formData.skills, { name: skillInput, category: "Other" }],
// //       });
// //       setSkillInput("");
// //     }
// //   };

// //   const handleAddAchievement = () => {
// //     if (achievementInput.trim()) {
// //       setFormData({
// //         ...formData,
// //         achievements: [...formData.achievements, achievementInput],
// //       });
// //       setAchievementInput("");
// //     }
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     try {
// //       const res = await axios.put(
// //         `${BACKEND_URL}/api/users/${user._id}`,
// //         formData
// //       );
// //       onUpdate(res.data);
// //       onClose();
// //     } catch (err) {
// //       console.error("Error updating profile:", err);
// //       alert("Failed to update profile");
// //     }
// //   };

// //   return (
// //     <div className="edit-modal">
// //       <div className="edit-modal-content">
// //         <h3>Edit Profile</h3>
// //         <form onSubmit={handleSubmit}>
// //           <label>Username</label>
// //           <input
// //             name="username"
// //             value={formData.username}
// //             onChange={handleChange}
// //           />

// //           <label>Bio</label>
// //           <textarea
// //             name="bio"
// //             value={formData.bio}
// //             onChange={handleChange}
// //           />

// //           <label>Add Skill</label>
// //           <div className="inline-input">
// //             <input
// //               type="text"
// //               value={skillInput}
// //               onChange={(e) => setSkillInput(e.target.value)}
// //             />
// //             <button type="button" onClick={handleAddSkill}>
// //               Add
// //             </button>
// //           </div>
// //           <div className="tag-list">
// //             {formData.skills.map((s, i) => (
// //               <span key={i} className="tag">
// //                 {s.name}
// //               </span>
// //             ))}
// //           </div>

// //           <label>Add Achievement</label>
// //           <div className="inline-input">
// //             <input
// //               type="text"
// //               value={achievementInput}
// //               onChange={(e) => setAchievementInput(e.target.value)}
// //             />
// //             <button type="button" onClick={handleAddAchievement}>
// //               Add
// //             </button>
// //           </div>
// //           <div className="tag-list">
// //             {formData.achievements.map((a, i) => (
// //               <span key={i} className="tag">
// //                 {a}
// //               </span>
// //             ))}
// //           </div>

// //           <div className="button-row">
// //             <button type="submit" className="save-btn">Save Changes</button>
// //             <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // };

// // export default EditProfile;

// // src/landing_page/Profile/EditProfile/editprofile.js
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./editprofile.css";

// const BACKEND_URL = "https://zen-app-5b3s.onrender.com";


// const EditProfile = ({ user, onClose, onUpdate }) => {
//   // Safe state initialization
//   const [formData, setFormData] = useState({
//     username: "",
//     bio: "",
//     skills: [],
//     achievements: [],
//     posts: [],
//   });

//   const [skillInput, setSkillInput] = useState("");
//   const [achievementInput, setAchievementInput] = useState("");
//   const [postCaption, setPostCaption] = useState("");
//   const [postImage, setPostImage] = useState(null);

//   // Load user data into form
//   useEffect(() => {
//     if (user) {
//       setFormData({
//         username: user.username || "",
//         bio: user.bio || "",
//         skills: user.skills || [],
//         achievements: user.achievements || [],
//         posts: user.posts || [],
//       });
//     }
//   }, [user]);

//   if (!user) return null;

//   // ------- BASIC TEXT INPUT CHANGE -------
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // ------- SKILLS -------
//   const handleAddSkill = () => {
//     if (!skillInput.trim()) return;
//     setFormData({
//       ...formData,
//       skills: [...formData.skills, { name: skillInput, category: "Other" }],
//     });
//     setSkillInput("");
//   };

//   const handleDeleteSkill = (index) => {
//     const updated = formData.skills.filter((_, i) => i !== index);
//     setFormData({ ...formData, skills: updated });
//   };

//   // ------- ACHIEVEMENTS -------
//   const handleAddAchievement = () => {
//     if (!achievementInput.trim()) return;
//     setFormData({
//       ...formData,
//       achievements: [...formData.achievements, achievementInput],
//     });
//     setAchievementInput("");
//   };

//   const handleDeleteAchievement = (index) => {
//     const updated = formData.achievements.filter((_, i) => i !== index);
//     setFormData({ ...formData, achievements: updated });
//   };

//   // ------- POSTS (ADD) -------
//   const handleAddPost = async () => {
//     if (!postImage || !postCaption.trim()) {
//       alert("Add image and caption");
//       return;
//     }

//     try {
//       // Step 1: Add post to DB without image
//       const res = await axios.post(
//         `${BACKEND_URL}/api/users/${user._id}/posts`,
//         { caption: postCaption }
//       );

//       const updatedUser = res.data;
//       const newPostIndex = updatedUser.posts.length - 1;

//       // Step 2: Upload image for this new post
//       const imgData = new FormData();
//       imgData.append("image", postImage);

//       await axios.post(
//         `${BACKEND_URL}/api/upload/post/${user._id}/${newPostIndex}`,
//         imgData
//       );

//       onUpdate(); // refresh UI
//       setPostCaption("");
//       setPostImage(null);
//     } catch (err) {
//       console.error("Error adding post:", err);
//       alert("Failed to add post");
//     }
//   };

//   // ------- DELETE POST -------
//   const handleDeletePost = async (postId) => {
//     try {
//       await axios.delete(`${BACKEND_URL}/api/users/${user._id}/posts/${postId}`);
//       onUpdate();
//     } catch (err) {
//       console.error("Error deleting post:", err);
//       alert("Failed to delete post");
//     }
//   };

//   // ------- SAVE BASIC INFO -------
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // Send only username & bio; skills, posts handled separately
//       const res = await axios.put(
//         `${BACKEND_URL}/api/users/${user._id}`,
//         {
//           username: formData.username,
//           bio: formData.bio,
//           skills: formData.skills,
//           achievements: formData.achievements,
//         }
//       );

//       onUpdate(res.data);
//       onClose();
//     } catch (err) {
//       console.error("Error updating profile:", err);
//       alert("Failed to save changes");
//     }
//   };

//   // ------- UI -------
//   return (
//     <div className="edit-modal">
//       <div className="edit-modal-content">
//         <h2>Edit Profile</h2>

//         <form onSubmit={handleSubmit}>
//           {/* USERNAME */}
//           <label>Username</label>
//           <input
//             name="username"
//             value={formData.username}
//             onChange={handleChange}
//           />

//           {/* BIO */}
//           <label>Bio</label>
//           <textarea
//             name="bio"
//             value={formData.bio}
//             onChange={handleChange}
//           />

//           {/* SKILLS */}
//           <label>Skills</label>
//           <div className="inline-input">
//             <input
//               value={skillInput}
//               onChange={(e) => setSkillInput(e.target.value)}
//               placeholder="Add skill"
//             />
//             <button type="button" onClick={handleAddSkill}>Add</button>
//           </div>

//           <div className="tag-list">
//             {formData.skills.map((s, i) => (
//               <div className="tag" key={i}>
//                 {s.name}
//                 <span className="delete" onClick={() => handleDeleteSkill(i)}>×</span>
//               </div>
//             ))}
//           </div>

//           {/* ACHIEVEMENTS */}
//           <label>Achievements</label>
//           <div className="inline-input">
//             <input
//               value={achievementInput}
//               onChange={(e) => setAchievementInput(e.target.value)}
//               placeholder="Add achievement"
//             />
//             <button type="button" onClick={handleAddAchievement}>Add</button>
//           </div>

//           <div className="tag-list">
//             {formData.achievements.map((a, i) => (
//               <div className="tag" key={i}>
//                 {a}
//                 <span className="delete" onClick={() => handleDeleteAchievement(i)}>×</span>
//               </div>
//             ))}
//           </div>

//           {/* ADD POST */}
//           <h3>Add Post</h3>
//           <input type="file" onChange={(e) => setPostImage(e.target.files[0])} />
//           <input
//             type="text"
//             placeholder="Caption"
//             value={postCaption}
//             onChange={(e) => setPostCaption(e.target.value)}
//           />
//           <button type="button" onClick={handleAddPost} className="add-post-btn">
//             ➕ Add Post
//           </button>

//           {/* EXISTING POSTS */}
//           <h3>Your Posts</h3>
//           <div className="post-list">
//             {formData.posts.map((post) => (
//               <div key={post._id} className="post-item">
//                 <img
//                   src={`${BACKEND_URL}${post.image}`}
//                   alt="post"
//                   className="post-thumb"
//                 />
//                 <p>{post.caption}</p>
//                 <button
//                   type="button"
//                   className="delete-post-btn"
//                   onClick={() => handleDeletePost(post._id)}
//                 >
//                   Delete
//                 </button>
//               </div>
//             ))}
//           </div>

//           {/* BUTTONS */}
//           <div className="button-row">
//             <button className="save-btn" type="submit">Save Changes</button>
//             <button className="cancel-btn" type="button" onClick={onClose}>
//               Cancel
//             </button>
//           </div>

//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditProfile;
// src/landing_page/Profile/EditProfile/editprofile.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./editprofile.css";

const BASE_URL = "https://zen-app-5b3s.onrender.com";

const EditProfile = ({ user, onClose, onUpdate }) => {
  // ------------------ STATES ------------------
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    skills: [],
    achievements: [],
    posts: [],
  });

  const [skillInput, setSkillInput] = useState("");
  const [achievementInput, setAchievementInput] = useState("");

  // Post upload
  // const [newPostCaption, setNewPostCaption] = useState("");
  // const [newPostImage, setNewPostImage] = useState(null);

  // ------------------ LOAD USER DATA ------------------
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        bio: user.bio || "",
        skills: user.skills || [],
        achievements: user.achievements || [],
        posts: user.posts || [],
      });
    }
  }, [user]);

  if (!user) return null;

  // ------------------ BASIC INPUT CHANGE ------------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ------------------ SKILLS ------------------
  const handleAddSkill = () => {
    if (!skillInput.trim()) return;

    setFormData({
      ...formData,
      skills: [...formData.skills, { name: skillInput, category: "Other" }],
    });

    setSkillInput("");
  };

  const handleDeleteSkill = (index) => {
    const updated = formData.skills.filter((_, i) => i !== index);
    setFormData({ ...formData, skills: updated });
  };

  // ------------------ ACHIEVEMENTS ------------------
  const handleAddAchievement = () => {
    if (!achievementInput.trim()) return;

    setFormData({
      ...formData,
      achievements: [...formData.achievements, achievementInput],
    });

    setAchievementInput("");
  };

  const handleDeleteAchievement = (index) => {
    const updated = formData.achievements.filter((_, i) => i !== index);
    setFormData({ ...formData, achievements: updated });
  };

  // ------------------ ADD POST ------------------
  // const handleAddPost = async () => {
  //   if (!newPostImage) {
  //     alert("Please select an image");
  //     return;
  //   }

  //   try {
  //     // Step 1: Create post with caption only
  //     const res = await axios.post(
  //       `${BASE_URL}/api/users/${user._id}/posts`,
  //       { caption: newPostCaption }
  //     );

  //     const updatedUser = res.data;
  //     const postIndex = updatedUser.posts.length - 1; // index of created post

  //     // Step 2: Upload image to this post
  //     const imgData = new FormData();
  //     imgData.append("image", newPostImage);

  //     await axios.post(
  //       `${BASE_URL}/api/upload/post/${user._id}/${postIndex}`,
  //       imgData,
  //       {
  //         headers: { "Content-Type": "multipart/form-data" },
  //       }
  //     );

  //     onUpdate(); // reload UI

  //     setNewPostCaption("");
  //     setNewPostImage(null);
  //     alert("Post added successfully!");
  //   } catch (err) {
  //     console.error("Error adding post:", err);
  //     alert("Failed to add post");
  //   }
  // };

  // ------------------ DELETE POST ------------------
  // const handleDeletePost = async (postId) => {
  //   if (!window.confirm("Delete this post?")) return;

  //   try {
  //     await axios.delete(`${BASE_URL}/api/users/${user._id}/posts/${postId}`);

  //     onUpdate(); // reload UI
  //   } catch (err) {
  //     console.log("Error deleting post:", err);
  //     alert("Failed to delete post");
  //   }
  // };

  // ------------------ SAVE PROFILE ------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(`${BASE_URL}/api/users/${user._id}`, {
        username: formData.username,
        bio: formData.bio,
        skills: formData.skills,
        achievements: formData.achievements,
      });

      onUpdate(res.data);
      onClose();
    } catch (err) {
      console.error("Error updating:", err);
      alert("Update failed");
    }
  };

  // ------------------ UI ------------------
  return (
    <div className="edit-modal">
      <div className="edit-modal-content">
        <h3>Edit Profile</h3>

        <form onSubmit={handleSubmit}>
          
          {/* USERNAME */}
          <label>Username</label>
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
          />

          {/* BIO */}
          <label>Bio</label>
          <textarea name="bio" value={formData.bio} onChange={handleChange} />

          {/* SKILLS */}
          <label>Skills</label>
          <div className="inline-input">
            <input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="Add skill"
            />
            <button type="button" onClick={handleAddSkill}>
              Add
            </button>
          </div>

          <div className="tag-list">
            {formData.skills.map((s, i) => (
              <span className="tag" key={i}>
                {s.name}
                <span className="delete" onClick={() => handleDeleteSkill(i)}>
                  ×
                </span>
              </span>
            ))}
          </div>

          {/* ACHIEVEMENTS */}
          <label>Achievements</label>
          <div className="inline-input">
            <input
              value={achievementInput}
              onChange={(e) => setAchievementInput(e.target.value)}
              placeholder="Add achievement"
            />
            <button type="button" onClick={handleAddAchievement}>
              Add
            </button>
          </div>

          <div className="tag-list">
            {formData.achievements.map((a, i) => (
              <span className="tag" key={i}>
                {a}
                <span
                  className="delete"
                  onClick={() => handleDeleteAchievement(i)}
                >
                  ×
                </span>
              </span>
            ))}
          </div>

          {/* ADD POST */}
          {/* <h3>Add Post</h3>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewPostImage(e.target.files[0])}
          />
          <input
            type="text"
            placeholder="Caption"
            value={newPostCaption}
            onChange={(e) => setNewPostCaption(e.target.value)}
          /> */}

          {/* <button type="button" onClick={handleAddPost} className="add-post-btn">
            + Add Post
          </button> */}

          {/* POSTS DISPLAY */}
          {/* <h3>Your Posts</h3>
          <div className="post-list">
            {formData.posts.map((post) => (
              <div key={post._id} className="post-item">
                <img
                  src={`${BASE_URL}${post.image}`}
                  alt=""
                  className="post-thumb"
                />
                <p>{post.caption}</p>

                <button
                  type="button"
                  className="delete-post-btn"
                  onClick={() => handleDeletePost(post._id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div> */}

          {/* SAVE BUTTONS */}
          <div className="button-row">
            <button className="save-btn" type="submit">
              Save Changes
            </button>
            <button className="cancel-btn" type="button" onClick={onClose}>
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditProfile;
