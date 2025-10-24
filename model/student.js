import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    studentCode: {
      type: String,
      unique: true,
      required: [true, "Student code is required"],
      match: [/^STU\d{4}$/, "Invalid student code format"], // e.g., STU0001
    },
    classLevel: {
      type: String,
      enum: [
        "Primary 1",
        "Primary 2",
        "Primary 3",
        "Primary 4",
        "Primary 5",
        "Primary 6",
        "JHS 1",
        "JHS 2",
        "JHS 3",
      ],
      default: "Primary 1",
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: true,
    },
    parentName: {
      type: String,
      default: "N/A",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);

// import mongoose from "mongoose";

// const studentSchema = new mongoose.Schema(
//   {
//     firstName: {
//       type: String,
//       required: [true, "First name is required"],
//       trim: true,
//     },
//     lastName: {
//       type: String,
//       required: [true, "Last name is required"],
//       trim: true,
//     },
//     studentCode: {
//       type: String,
//       unique: true,
//       required: [true, "Student code is required"],
//       match: [/^STU\d{4}$/, "Invalid student code format"],
//     },
//     password: {
//       type: String,
//       required: [true, "Password is required"],
//       minlength: [6, "Password must be at least 6 characters"],
//       select: false,
//     },
//     phoneNumber: {
//       // ✅ Add this
//       type: String,
//       default: "",
//     },
//     profileImage: {
//       // ✅ Add this
//       type: String,
//       default: null,
//     },
//     classLevel: {
//       type: String,
//       enum: [
//         "Primary 1",
//         "Primary 2",
//         "Primary 3",
//         "Primary 4",
//         "Primary 5",
//         "Primary 6",
//         "JHS 1",
//         "JHS 2",
//         "JHS 3",
//       ],
//       default: "Primary 1",
//     },
//     gender: {
//       type: String,
//       enum: ["Male", "Female"],
//       required: true,
//     },
//     parentName: {
//       type: String,
//       default: "N/A",
//     },
//     children: [
//       {
//         // ✅ Add for parent functionality
//         firstName: String,
//         lastName: String,
//         name: String,
//         classLevel: String,
//         profileImage: String,
//         dateOfBirth: Date,
//         gender: String,
//       },
//     ],
//   },
//   { timestamps: true }
// );

// // Add virtual for email if needed
// studentSchema.virtual("email").get(function () {
//   return `${this.studentCode.toLowerCase()}@student.school.com`;
// });

// studentSchema.set("toJSON", { virtuals: true });
// studentSchema.set("toObject", { virtuals: true });

// export default mongoose.model("Student", studentSchema);
