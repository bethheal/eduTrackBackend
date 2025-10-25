import express from "express";
import {
  createTeacher,
  getAllTeachers,
  getTeacherSubjects,
} from "../controller/teacherController.js";

const router = express.Router();

router.post("/register", createTeacher);
router.get("/", getAllTeachers);
router.get("/:teacherId/subjects", getTeacherSubjects);

export default router;
