import Teacher from "../model/teacher.js";
import Subject from "../model/subject.js";

// ✅ Register new teacher
export const createTeacher = async (req, res) => {
  try {
    const { teacherId, fullName, email, subjectSpecialization } = req.body;

    const existing = await Teacher.findOne({ teacherId });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Teacher ID already exists" });
    }

    const teacher = await Teacher.create({
      teacherId,
      fullName,
      email,
      subjectSpecialization,
    });

    res.status(201).json({ success: true, data: teacher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get all teachers
export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.status(200).json({ success: true, data: teachers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get subjects taught by a specific teacher
export const getTeacherSubjects = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const subjects = await Subject.find({ teacherId });

    res.status(200).json({
      success: true,
      data: subjects,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
