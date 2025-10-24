import express from "express";
import {
  getProfile,
  updateProfile,
  addChild,
  updateChild,
  removeChild,
  getAllSubjects,
  assignSubject,
  removeSubject,
  getAllTeachers,
  getAllParents,
} from "../controller/profileController.js";

import * as profileController from "../controller/profileController.js";
import { routeProtect } from "../middleware/routeProtect.js";
import { adminAuth } from "../middleware/adminAuth.js";
import upload from "../middleware/multer.js";

const router = express.Router();

// 🔹 Common routes for both teachers and parents
router.get("/", routeProtect, profileController.getProfile);
router.patch(
  "/",
  routeProtect,
  upload.single("profileImage"),
  profileController.updateProfile
);

// 🔹 Parent-specific routes
router.post("/parent/child", routeProtect, addChild);
router.patch("/parent/child/:childId", routeProtect, updateChild);
router.delete("/parent/child/:childId", routeProtect, removeChild);

// 🔹 Teacher-specific routes
router.get("/subjects", getAllSubjects);

// 🔹 Admin routes
router.post("/admin/assign-subject", routeProtect, adminAuth, assignSubject);
router.delete("/admin/remove-subject", routeProtect, adminAuth, removeSubject);
router.get("/admin/teachers", routeProtect, adminAuth, getAllTeachers);
router.get("/admin/parents", routeProtect, adminAuth, getAllParents);

export default router;
