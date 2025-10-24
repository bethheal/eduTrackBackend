import { Router } from "express";
import {
  addStudent,
  getAllStudents,
  getStudentById,
} from "../controller/studentController.js";

const router = Router();

router.post("/", addStudent);
router.get("/", getAllStudents);
router.get("/:id", getStudentById);

export default router;
