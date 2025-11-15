
// export default Profile;

import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../UserContext/usercontext";
import EditProfile from "./Editprofile/editProfile";
import "./profile.css";
import Header from "../../Navbar/header";

const BACKEND_URL = "https://zen-app-5b3s.onrender.com";

const Profile = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [user, setUser] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      if (!currentUser?._id) return;
      try {
        const res = await axios.get(`${BACKEND_URL}/api/users/${currentUser._id}`);
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [currentUser]);

  const handleUpdate = (updatedUser) => {
    setUser(updatedUser);
    setCurrentUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  if (loading) return <div className="profile-loading">Loading profile...</div>;
  if (!user) return <div className="profile-error">Could not load profile.</div>;

  return (
    <>
      <Header />
      <div className="profile-container-outer mt-5 pt-4">
        <div className="profile-container row">
          {/* LEFT COLUMN */}
          <div className="col-4">
            <aside className="profile-left">
              <div className="profile-card card-1">
                <div className="profile-banner"></div>
                <div className="profile-avatar-wrapper">
                </div>
                <div className="profile-basic mt-5">
                  <div className="profile-name">{user.username}</div>
                  <div className="profile-title">{user.title || user.bio || ""}</div>
                  {user.location && <div className="profile-location">{user.location}</div>}
                </div>
                <div className="profile-stats">
                  <div>
                    <div className="stat-count">{user.followers?.length || 0}</div>
                    <div className="stat-label">Followers</div>
                  </div>
                  <div>
                    <div className="stat-count">{user.following?.length || 0}</div>
                    <div className="stat-label">Following</div>
                  </div>
                </div>
                <div className="card skills-card">
                  <h3 className="section-title">Skills</h3>
                  <div className="skills-list">
                    {user.skills?.length
                      ? user.skills.map((skill, i) => (
                          <span key={i} className="skill-tag">{skill.name}</span>
                        ))
                      : <p className="empty-text">No skills added yet.</p>}
                  </div>
                </div>
                <div className="card achievements-card">
                  <h3 className="section-title">Achievements</h3>
                  {user.achievements?.length
                    ? <ul className="achievements-list">{user.achievements.map((a, i) => <li key={i}>{a}</li>)}</ul>
                    : <p className="empty-text">No achievements yet.</p>}
                </div>
                <button className="profile-edit-btn" onClick={() => setShowEdit(true)}>Edit Profile</button>
              </div>

              <div className="profile-card card-2">
                <h4 className="card-heading">Analytics</h4>
                <div className="analytics-row">
                  <span className="analytics-label">Profile views</span>
                  <span className="analytics-value">{user.profileViews ?? 0}</span>
                </div>
                <div className="analytics-row">
                  <span className="analytics-label">Post impressions</span>
                  <span className="analytics-value">{user.postImpressions ?? 0}</span>
                </div>
              </div>

              <div className="profile-card card-3">
                <h4 className="card-heading">Resources</h4>
                <ul className="shortcuts-list">
                  <li className="shortcut-item">🔖 Saved items</li>
                  <li className="shortcut-item">👥 Groups</li>
                  <li className="shortcut-item">📰 Newsletters</li>
                  <li className="shortcut-item">📅 Events</li>
                </ul>
              </div>
            </aside>
          </div>

          {/* RIGHT COLUMN */}
          <div className="col-8" style={{ backgroundColor: "grey" }}>
            {/* You can add more main content here */}
          </div>
        </div>
      </div>

      {showEdit && (
        <EditProfile
          user={user}
          onClose={() => setShowEdit(false)}
          onUpdate={handleUpdate}
        />
      )}
    </>
  );
};

export default Profile;














// import React, { useContext, useEffect, useState } from "react";
// import axios from "axios";
// import { UserContext } from "../UserContext/usercontext";
// import EditProfile from "./Editprofile/editProfile";
// import "./profile.css";
// import Header from "../../Navbar/header";
// import ProfileImage from "./showup/profileimage";

// const BACKEND_URL = "https://zen-app-5b3s.onrender.com";

// const Profile = () => {
//   const { currentUser, setCurrentUser } = useContext(UserContext);
//   const [user, setUser] = useState(null);
//   const [showEdit, setShowEdit] = useState(false);
//   const [loading, setLoading] = useState(true);

//   // Fetch user data
//   useEffect(() => {
//     const fetchUser = async () => {
//       if (!currentUser?._id) return;
//       try {
//         const res = await axios.get(`${BACKEND_URL}/api/users/${currentUser._id}`);
//         setUser(res.data);
//       } catch (err) {
//         console.error("Error fetching user profile:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUser();
//   }, [currentUser]);

//   const handleUpdate = (updatedUser) => {
//     setUser(updatedUser);
//     setCurrentUser(updatedUser);
//     localStorage.setItem("user", JSON.stringify(updatedUser));
//   };

//   if (loading) return <div className="profile-loading">Loading profile...</div>;
//   if (!user) return <div className="profile-error">Could not load profile.</div>;

//   return (
//     <>
//       <Header />

//       <div className="container-fluid">
//         <div>
//       <div className="profile-page mt-5">

//         {/* LEFT SIDEBAR (30%) */}
//         <aside className="profile-left">
//           {/* Card 1: Banner + Avatar + Basic Info */}
//           <div className="profile-card card-1">
//             <div className="profile-banner" aria-hidden="true"></div>

//             <div className="profile-avatar-wrapper">
//               <ProfileImage
//                 user={user}
//                 setUser={setUser}
//                 setCurrentUser={setCurrentUser}
//                 BACKEND_URL={BACKEND_URL}
//               />
//             </div>

//             <div className="profile-basic">
//               <div className="profile-name">{user.username}</div>
//               <div className="profile-title">{user.title || user.bio || ""}</div>
//               {user.location && <div className="profile-location">{user.location}</div>}
//             </div>

//             <div className="profile-stats">
//               <div>
//                 <div className="stat-count">{user.followers?.length || 0}</div>
//                 <div className="stat-label">Followers</div>
//               </div>
//               <div>
//                 <div className="stat-count">{user.following?.length || 0}</div>
//                 <div className="stat-label">Following</div>
//               </div>
//             </div>

//             {/* skill card */}
//             <div className="card skills-card">
//             <h3 className="section-title">Skills</h3>
//             <div className="skills-list">
//               {user.skills && user.skills.length > 0 ? (
//                 user.skills.map((skill, i) => (
//                   <span key={i} className="skill-tag">{skill.name}</span>
//                 ))
//               ) : (
//                 <p className="empty-text">No skills added yet.</p>
//               )}
//             </div>
//           </div>

//               {/* Achievement card */}
//           <div className="card achievements-card">
//             <h3 className="section-title">Achievements</h3>
//             {user.achievements && user.achievements.length > 0 ? (
//               <ul className="achievements-list">
//                 {user.achievements.map((a, i) => (
//                   <li key={i}>{a}</li>
//                 ))}
//               </ul>
//             ) : (
//               <p className="empty-text">No achievements yet.</p>
//             )}
//           </div>

//             <button className="profile-edit-btn" onClick={() => setShowEdit(true)}>
//               Edit Profile
//             </button>
//           </div>

//           {/* Card 2: Profile viewers & Post impressions */}
//           <div className="profile-card card-2">
//             <h4 className="card-heading">Analytics</h4>
//             <div className="analytics-row">
//               <div className="analytics-label">Profile views</div>
//               <div className="analytics-value">{user.profileViews ?? 0}</div>
//             </div>
//             <div className="analytics-row">
//               <div className="analytics-label">Post impressions</div>
//               <div className="analytics-value">{user.postImpressions ?? 0}</div>
//             </div>
//           </div>

//           {/* Card 3: Shortcuts (Saved / Groups / Newsletters / Events) */}
//           <div className="profile-card card-3">
//             <h4 className="card-heading">Resources</h4>
//             <ul className="shortcuts-list">
//               <li className="shortcut-item">🔖 Saved items</li>
//               <li className="shortcut-item">👥 Groups</li>
//               <li className="shortcut-item">📰 Newsletters</li>
//               <li className="shortcut-item">📅 Events</li>
//             </ul>
//           </div>
//         </aside>

//         {/* RIGHT / MAIN CONTENT (70%) */}
//         <main className="profile-center">
//           {/* About / Bio card */}
//           {/* <div className="card about-card">
//             <h3 className="section-title">About</h3>
//             <p className="about-text">{user.about || user.bio || "No bio available."}</p>
//           </div> */}

//           {/* Skills card */}
//           {/* <div className="card skills-card">
//             <h3 className="section-title">Skills</h3>
//             <div className="skills-list">
//               {user.skills && user.skills.length > 0 ? (
//                 user.skills.map((skill, i) => (
//                   <span key={i} className="skill-tag">{skill.name}</span>
//                 ))
//               ) : (
//                 <p className="empty-text">No skills added yet.</p>
//               )}
//             </div>
//           </div> */}

//           {/* Achievements card */}
//           {/* <div className="card achievements-card">
//             <h3 className="section-title">Achievements</h3>
//             {user.achievements && user.achievements.length > 0 ? (
//               <ul className="achievements-list">
//                 {user.achievements.map((a, i) => (
//                   <li key={i}>{a}</li>
//                 ))}
//               </ul>
//             ) : (
//               <p className="empty-text">No achievements yet.</p>
//             )}
//           </div> */}
//         </main>
//       </div>
//       </div>
//       </div>
//       {/* Edit modal */}
//       {showEdit && (
//         <EditProfile
//           user={user}
//           onClose={() => setShowEdit(false)}
//           onUpdate={handleUpdate}
//         />
//       )}
//     </>
//   );
// };


