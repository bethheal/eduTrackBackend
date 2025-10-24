// import Subject from "../model/subject.js";
// import User from "../model/user.js";

// // Add subject (teachers only)
// export const addSubject = async (req, res, next) => {
//   const {
//     name,
//     teacherId,
//     studentIds,
//     averageScore,
//     assignmentsDone,
//     testsDone,
//     status,
//   } = req.body;

//   if (!name || !teacherId) {
//     return res.status(400).json({
//       success: false,
//       message: "Subject name and teacher ID are required.",
//     });
//   }

//   try {
//     // Check if subject already exists for this teacher
//     const existingSubject = await Subject.findOne({ name, teacherId });
//     if (existingSubject) {
//       return res.status(400).json({
//         success: false,
//         message: "Subject already exists for this teacher.",
//       });
//     }

//     // Validate and fetch student data if studentIds provided
//     let studentsData = [];
//     if (studentIds && studentIds.length > 0) {
//       // Find all users with the provided IDs
//       const students = await User.find({
//         userId: { $in: studentIds },
//         role: "parent", // Students have role "parent" in your system
//       });

//       if (students.length !== studentIds.length) {
//         const foundIds = students.map((s) => s.userId);
//         const notFound = studentIds.filter((id) => !foundIds.includes(id));
//         return res.status(400).json({
//           success: false,
//           message: `Student(s) not found: ${notFound.join(", ")}`,
//         });
//       }

//       // Map students to the format needed for the subject
//       studentsData = students.map((student) => ({
//         studentId: student.userId,
//         studentName: `${student.firstName} ${student.lastName}`,
//         averageScore: 0,
//         assignmentsDone: 0,
//         testsDone: 0,
//         status: "Pending",
//       }));
//     }

//     const subject = new Subject({
//       name,
//       teacherId,
//       students: studentsData,
//       averageScore: averageScore || 0,
//       assignmentsDone: assignmentsDone || 0,
//       testsDone: testsDone || 0,
//       status: status || "Pending",
//     });

//     await subject.save();

//     res.status(201).json({
//       success: true,
//       message: "Subject added successfully.",
//       data: subject,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // Get all subjects
// export const getAllSubjects = async (req, res, next) => {
//   try {
//     const subjects = await Subject.find();
//     res.status(200).json({
//       success: true,
//       data: subjects,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // Update subject
// export const updateSubject = async (req, res, next) => {
//   const { id } = req.params;

//   try {
//     const subject = await Subject.findByIdAndUpdate(
//       id,
//       { ...req.body, updatedAt: new Date() },
//       { new: true, runValidators: true }
//     );

//     if (!subject) {
//       return res.status(404).json({
//         success: false,
//         message: "Subject not found.",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Subject updated successfully.",
//       data: subject,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // Delete a subject
// export const deleteSubject = async (req, res, next) => {
//   const { id } = req.params;

//   try {
//     const subject = await Subject.findById(id);

//     if (!subject) {
//       return res.status(404).json({
//         success: false,
//         message: "Subject not found.",
//       });
//     }

//     await Subject.findByIdAndDelete(id);

//     res.status(200).json({
//       success: true,
//       message: "Subject deleted successfully.",
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // Get subjects by teacher ID
// export const getSubjectsByTeacher = async (req, res, next) => {
//   const { teacherId } = req.params;

//   try {
//     const subjects = await Subject.find({ teacherId });

//     res.status(200).json({
//       success: true,
//       data: subjects,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // Get subjects by student ID
// export const getSubjectsByStudent = async (req, res, next) => {
//   const { studentId } = req.params;

//   try {
//     const subjects = await Subject.find({
//       "students.studentId": studentId,
//     });

//     // Filter to only return this student's data in each subject
//     const studentSubjects = subjects.map((subject) => {
//       const studentData = subject.students.find(
//         (s) => s.studentId === studentId
//       );

//       return {
//         _id: subject._id,
//         name: subject.name,
//         teacherId: subject.teacherId,
//         totalAssignments: subject.totalAssignments,
//         totalTests: subject.totalTests,
//         averageScore: studentData.averageScore,
//         assignmentsDone: studentData.assignmentsDone,
//         testsDone: studentData.testsDone,
//         status: studentData.status,
//       };
//     });

//     res.status(200).json({
//       success: true,
//       data: studentSubjects,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

import Subject from "../model/subject.js";
import User from "../model/user.js";

// Add subject (teachers only)
export const addSubject = async (req, res, next) => {
  const {
    name,
    teacherId,
    studentIds,
    averageScore,
    assignmentsDone,
    testsDone,
    status,
  } = req.body;

  if (!name || !teacherId) {
    return res.status(400).json({
      success: false,
      message: "Subject name and teacher ID are required.",
    });
  }

  try {
    // Check if subject already exists for this teacher
    const existingSubject = await Subject.findOne({ name, teacherId });
    if (existingSubject) {
      return res.status(400).json({
        success: false,
        message: "Subject already exists for this teacher.",
      });
    }

    // Validate and fetch student data if studentIds provided
    let studentsData = [];
    if (studentIds && studentIds.length > 0) {
      // Find all users with the provided IDs
      const students = await User.find({
        userId: { $in: studentIds },
        role: "parent", // Students have role "parent" in your system
      });

      if (students.length !== studentIds.length) {
        const foundIds = students.map((s) => s.userId);
        const notFound = studentIds.filter((id) => !foundIds.includes(id));
        return res.status(400).json({
          success: false,
          message: `Student(s) not found: ${notFound.join(", ")}`,
        });
      }

      // Map students to the format needed for the subject
      // ✅ FIX: Use the performance data from the form for ALL students
      studentsData = students.map((student) => ({
        studentId: student.userId,
        studentName: `${student.firstName} ${student.lastName}`,
        averageScore: averageScore || 0,
        assignmentsDone: assignmentsDone || 0,
        testsDone: testsDone || 0,
        status: status || "Pending",
      }));
    }

    const subject = new Subject({
      name,
      teacherId,
      students: studentsData,
      averageScore: averageScore || 0,
      assignmentsDone: assignmentsDone || 0,
      testsDone: testsDone || 0,
      status: status || "Pending",
    });

    await subject.save();

    res.status(201).json({
      success: true,
      message: "Subject added successfully.",
      data: subject,
    });
  } catch (error) {
    next(error);
  }
};

// Get all subjects
export const getAllSubjects = async (req, res, next) => {
  try {
    const subjects = await Subject.find();
    res.status(200).json({
      success: true,
      data: subjects,
    });
  } catch (error) {
    next(error);
  }
};

// Update subject
export const updateSubject = async (req, res, next) => {
  const { id } = req.params;

  try {
    const subject = await Subject.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Subject updated successfully.",
      data: subject,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a subject
export const deleteSubject = async (req, res, next) => {
  const { id } = req.params;

  try {
    const subject = await Subject.findById(id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found.",
      });
    }

    await Subject.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Subject deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

// Get subjects by teacher ID
export const getSubjectsByTeacher = async (req, res, next) => {
  const { teacherId } = req.params;

  try {
    const subjects = await Subject.find({ teacherId });

    res.status(200).json({
      success: true,
      data: subjects,
    });
  } catch (error) {
    next(error);
  }
};

// Get subjects by student ID
export const getSubjectsByStudent = async (req, res, next) => {
  const { studentId } = req.params;

  try {
    const subjects = await Subject.find({
      "students.studentId": studentId,
    });

    // Filter to only return this student's data in each subject
    const studentSubjects = subjects.map((subject) => {
      const studentData = subject.students.find(
        (s) => s.studentId === studentId
      );

      return {
        _id: subject._id,
        name: subject.name,
        teacherId: subject.teacherId,
        totalAssignments: subject.totalAssignments,
        totalTests: subject.totalTests,
        averageScore: studentData.averageScore,
        assignmentsDone: studentData.assignmentsDone,
        testsDone: studentData.testsDone,
        status: studentData.status,
      };
    });

    res.status(200).json({
      success: true,
      data: studentSubjects,
    });
  } catch (error) {
    next(error);
  }
};
