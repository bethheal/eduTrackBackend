// import { Schema, model } from "mongoose";

// const profileSchema = new Schema(
//   {
//     userId: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     userType: {
//       type: String,
//       enum: ["teacher", "parent"],
//       required: true,
//     },
//     firstName: String,
//     lastName: String,
//     email: String,
//     phoneNumber: String, // ✅ Important
//     title: String,
//     profileImage: String, // ✅ Important
//     subjects: [String], // ✅ For teachers
//     children: [
//       {
//         firstName: String,
//         lastName: String,
//         name: String,
//         classLevel: String,
//         dateOfBirth: Date,
//         gender: String,
//         profileImage: String,
//       },
//     ],
//     isActive: {
//       type: Boolean,
//       default: true,
//     },
//   },
//   { timestamps: true }
// );

// const Profile = model("Profile", profileSchema);
// export default Profile;
// models/Profile.js
import { Schema, model } from "mongoose";

const profileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userType: {
      type: String,
      enum: ["teacher", "parent", "student"],
      required: true,
    },
    firstName: String,
    lastName: String,
    email: String,
    phoneNumber: String,
    title: String,
    profileImage: String,
    classLevel: String, // ✅ Added for students
    subjects: [String], // For teachers
    children: [
      {
        firstName: String,
        lastName: String,
        name: String,
        classLevel: String,
        dateOfBirth: Date,
        gender: String,
        profileImage: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Profile = model("Profile", profileSchema);
export default Profile;
