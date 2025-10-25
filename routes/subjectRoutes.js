import express from "express";
import {
  addSubject,
  getAllSubjects,
  updateSubject,
  deleteSubject,
  getSubjectsByTeacher,
  getSubjectsByStudent,
} from "../controller/subjectController.js";
import { routeProtect } from "../middleware/routeProtect.js";

const router = express.Router();

router.post("/", routeProtect, addSubject);
router.get("/", routeProtect, getAllSubjects);
router.put("/:id", routeProtect, updateSubject);
router.delete("/:id", routeProtect, deleteSubject);

// Get subjects by teacher or student
router.get("/teacher/:teacherId", routeProtect, getSubjectsByTeacher);
router.get("/student/:studentId", routeProtect, getSubjectsByStudent);

export default router;
