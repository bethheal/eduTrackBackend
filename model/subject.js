import { Schema, model } from "mongoose";

const subjectSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Subject name is required"],
      trim: true,
    },
    teacherId: {
      type: String,
      required: [true, "Teacher ID is required"],
      validate: {
        validator: function (value) {
          return value.startsWith("TCH");
        },
        message: "Teacher ID must start with 'TCH'",
      },
    },
    // ✅ NEW: Array of students assigned to this subject
    students: [
      {
        studentId: {
          type: String,
          required: true,
          validate: {
            validator: function (value) {
              return value.startsWith("STU");
            },
            message: "Student ID must start with 'STU'",
          },
        },
        studentName: {
          type: String,
          required: true,
        },
        // Individual student performance in this subject
        averageScore: {
          type: Number,
          default: 0,
          min: 0,
          max: 100,
        },
        assignmentsDone: {
          type: Number,
          default: 0,
          min: 0,
        },
        testsDone: {
          type: Number,
          default: 0,
          min: 0,
        },
        status: {
          type: String,
          enum: ["Excellent", "Good", "Average", "Poor", "Pending"],
          default: "Pending",
        },
      },
    ],
    // Overall subject statistics
    averageScore: {
      type: Number,
      default: 0,
      min: [0, "Average score cannot be negative"],
      max: [100, "Average score cannot exceed 100"],
    },
    assignmentsDone: {
      type: Number,
      default: 0,
      min: [0, "Assignments done cannot be negative"],
    },
    testsDone: {
      type: Number,
      default: 0,
      min: [0, "Tests done cannot be negative"],
    },
    status: {
      type: String,
      enum: ["Excellent", "Good", "Average", "Poor", "Pending"],
      default: "Pending",
    },
    totalAssignments: {
      type: Number,
      default: 6,
    },
    totalTests: {
      type: Number,
      default: 3,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate subjects per teacher
subjectSchema.index({ name: 1, teacherId: 1 }, { unique: true });

const Subject = model("Subject", subjectSchema);

export default Subject;
