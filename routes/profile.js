import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { fileUpload } from "../config/fileUpload.js"; // ✅ import multer setup

import {
  getTeacherProfile,
  updateTeacherProfile,
} from "../controllers/teacherProfile.js";
import {
  getParentProfile,
  updateParentProfile,
} from "../controllers/parentProfile.js";

const router = express.Router();

// ✅ Get profile based on user role
router.get("/", verifyToken, async (req, res, next) => {
  try {
    if (req.user.role === "teacher") {
      return getTeacherProfile(req, res, next);
    } else if (req.user.role === "parent") {
      return getParentProfile(req, res, next);
    } else {
      return res.status(403).json({ message: "Unauthorized role" });
    }
  } catch (error) {
    next(error);
  }
});

// ✅ Update profile based on user role
router.patch(
  "/",
  verifyToken,
  fileUpload.single("profileImage"), // ✅ use shared multer setup
  async (req, res, next) => {
    try {
      if (req.user.role === "teacher") {
        return updateTeacherProfile(req, res, next);
      } else if (req.user.role === "parent") {
        return updateParentProfile(req, res, next);
      } else {
        return res.status(403).json({ message: "Unauthorized role" });
      }
    } catch (error) {
      next(error);
    }
  }
);

export default router;
