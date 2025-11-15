// import mongoose from "mongoose";

// //
// // POST SCHEMA (for modal upload)
// //
// const postSchema = new mongoose.Schema({
//   _id: { type: String }, // important for delete from frontend
//   image: { type: String, required: true },
//   caption: { type: String, default: "" },
//   date: { type: Date, default: Date.now },
// });


// //
// // USER SCHEMA
// //
// const userSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },

//   phone: { type: String, required: true },
//   password: { type: String, required: true },

//   image: { type: String }, // profile image

//   bio: { type: String, default: "" },

//   //
//   // SKILLS
//   //
//   skills: [
//     {
//       name: { type: String, trim: true },
//       category: { type: String, default: "Other" },
//     },
//   ],

//   //
//   // ACHIEVEMENTS
//   //
//   achievements: { type: [String], default: [] },

//   //
//   // POSTS (linked to modal upload)
//   //
//  posts: {
//   type: [
//     {
//       _id: String,
//       title: String,
//       description: String,
//       createdAt: Date,
//     },
//   ],
//   default: [],
// },


//   //
//   // SOCIAL
//   //
//   followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//   following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

//   //
//   // REGISTERED DATE
//   //
//   registeredAt: { type: Date, default: Date.now },
// });

// export default mongoose.model("User", userSchema);


import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const postSchema = new mongoose.Schema({
  content: { type: String },
  image: { type: String }, // URL to uploaded image
  createdAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    title: { type: String },
    bio: { type: String },
    location: { type: String },
    // profileImage: { type: String, default: "" }, // uploaded profile image path
    skills: [skillSchema],
    achievements: [{ type: String }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    // posts: [postSchema],
    profileViews: { type: Number, default: 5 },
    postImpressions: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
