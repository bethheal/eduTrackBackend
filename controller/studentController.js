import Student from "../model/student.js";

// Create / Register a student
export const addStudent = async (req, res, next) => {
  try {
    const { firstName, lastName, studentCode, gender, classLevel, parentName } =
      req.body;

    if (!firstName || !lastName || !studentCode || !gender) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    const existingStudent = await Student.findOne({ studentCode });
    if (existingStudent) {
      return res
        .status(400)
        .json({ success: false, message: "Student code already exists" });
    }

    const student = await Student.create({
      firstName,
      lastName,
      studentCode,
      classLevel,
      gender,
      parentName,
    });

    res.status(201).json({
      success: true,
      message: "Student registered successfully",
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

// Get all students
export const getAllStudents = async (req, res, next) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: students });
  } catch (error) {
    next(error);
  }
};

// Get a single student
export const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student)
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};
