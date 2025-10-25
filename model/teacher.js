// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";

// const teacherSchema = new mongoose.Schema(
//   {
//     teacherId: {
//       type: String,
//       required: [true, "Teacher ID is required"],
//       unique: true,
//       validate: {
//         validator: (value) => value.startsWith("TCH"),
//         message: "Teacher ID must start with 'TCH'",
//       },
//     },
//     fullName: {
//       type: String,
//       required: [true, "Full name is required"],
//       trim: true,
//     },
//     email: {
//       type: String,
//       required: [true, "Email is required"],
//       unique: true,
//       lowercase: true,
//     },
//     password: {
//       type: String,
//       required: [true, "Password is required"],
//       minlength: [6, "Password must be at least 6 characters"],
//       select: false, // hides it when fetching teacher
//     },
//     subjectSpecialization: {
//       type: String,
//       default: "General",
//     },
//   },
//   { timestamps: true }
// );

// // Hash password before saving
// teacherSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// // Compare entered password with stored one
// teacherSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// const Teacher = mongoose.model("Teacher", teacherSchema);
// export default Teacher;

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const teacherSchema = new mongoose.Schema(
  {
    teacherId: {
      type: String,
      required: [true, "Teacher ID is required"],
      unique: true,
      validate: {
        validator: (value) => value.startsWith("TCH"),
        message: "Teacher ID must start with 'TCH'",
      },
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // hides it when fetching teacher
    },
    subjectSpecialization: {
      type: String,
      default: "General",
    },
  },
  { timestamps: true }
);

// ❌ REMOVE THIS - it's causing double hashing!
// teacherSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// Compare entered password with stored one
teacherSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Teacher = mongoose.model("Teacher", teacherSchema);
export default Teacher;

// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";

// const teacherSchema = new mongoose.Schema(
//   {
//     teacherId: {
//       type: String,
//       required: [true, "Teacher ID is required"],
//       unique: true,
//       validate: {
//         validator: (value) => value.startsWith("TCH"),
//         message: "Teacher ID must start with 'TCH'",
//       },
//     },
//     fullName: {
//       type: String,
//       required: [true, "Full name is required"],
//       trim: true,
//     },
//     email: {
//       type: String,
//       required: [true, "Email is required"],
//       unique: true,
//       lowercase: true,
//     },
//     password: {
//       type: String,
//       required: [true, "Password is required"],
//       minlength: [6, "Password must be at least 6 characters"],
//       select: false, // hides it when fetching teacher
//     },
//     subjectSpecialization: {
//       type: String,
//       default: "General",
//     },
//   },
//   { timestamps: true }
// );

// // Hash password before saving
// teacherSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// // Compare entered password with stored one
// teacherSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// const Teacher = mongoose.model("Teacher", teacherSchema);
// export default Teacher;
