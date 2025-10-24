// import express from "express";
// import {
//   registerTeacher,
//   loginTeacher,
// } from "../controllers/teacherAuthController.js";

// const router = express.Router();

// router.post("/register", registerTeacher);
// router.post("/login", loginTeacher);

// export default router;

import jwt from "jsonwebtoken";
import Teacher from "../model/teacher.js";

export const teacherAuth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided or invalid format",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find teacher by ID
    const teacher = await Teacher.findOne({ teacherId: decoded.teacherId });
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    req.user = teacher; // attach teacher info to the request
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
