// import mongoose from "mongoose";
// // import dotenv from "dotenv";
// import User from "../model/user.js";
// import Subject from "../model/subject.js";

// // dotenv.config();

// // Helper to generate unique IDs
// const generateUserId = (prefix, index) =>
//   `${prefix}${String(index).padStart(3, "0")}`;

// // Sample teachers and students
// const teachers = [
//   {
//     firstName: "John",
//     lastName: "Doe",
//     email: "john.doe@school.com",
//     phoneNumber: "0201234567",
//     role: "teacher",
//     status: "approved",
//     subjectsTaught: ["Mathematics", "Physics"],
//     qualification: "MSc Mathematics",
//     yearsOfExperience: 5,
//   },
//   {
//     firstName: "Jane",
//     lastName: "Smith",
//     email: "jane.smith@school.com",
//     phoneNumber: "0241234567",
//     role: "teacher",
//     status: "approved",
//     subjectsTaught: ["English", "Literature"],
//     qualification: "BA English Literature",
//     yearsOfExperience: 8,
//   },
//   {
//     firstName: "David",
//     lastName: "Johnson",
//     email: "david.johnson@school.com",
//     phoneNumber: "0271234567",
//     role: "teacher",
//     status: "approved",
//     subjectsTaught: ["Science", "Biology"],
//     qualification: "MSc Biology",
//     yearsOfExperience: 6,
//   },
// ];

// const students = [
//   {
//     firstName: "Alice",
//     lastName: "Brown",
//     email: "alice.brown@student.com",
//     phoneNumber: "0501234561",
//     role: "parent",
//     status: "approved",
//     grade: "Class 4",
//     className: "Class 4",
//     parentName: "Mr. Brown",
//     parentContact: "0531234561",
//   },
//   {
//     firstName: "Bob",
//     lastName: "Wilson",
//     email: "bob.wilson@student.com",
//     phoneNumber: "0501234562",
//     role: "parent",
//     status: "approved",
//     grade: "Class 4",
//     className: "Class 4",
//     parentName: "Mrs. Wilson",
//     parentContact: "0531234562",
//   },
//   {
//     firstName: "Charlie",
//     lastName: "Davis",
//     email: "charlie.davis@student.com",
//     phoneNumber: "0501234563",
//     role: "parent",
//     status: "approved",
//     grade: "Class 4",
//     className: "Class 4",
//     parentName: "Mr. Davis",
//     parentContact: "0531234563",
//   },
//   {
//     firstName: "Diana",
//     lastName: "Taylor",
//     email: "diana.taylor@student.com",
//     phoneNumber: "0501234564",
//     role: "parent",
//     status: "approved",
//     grade: "Class 4",
//     className: "Class 4",
//     parentName: "Mrs. Taylor",
//     parentContact: "0531234564",
//   },
//   {
//     firstName: "Edward",
//     lastName: "Martinez",
//     email: "edward.martinez@student.com",
//     phoneNumber: "0501234565",
//     role: "parent",
//     status: "approved",
//     grade: "Class 4",
//     className: "Class 4",
//     parentName: "Mr. Martinez",
//     parentContact: "0531234565",
//   },
//   {
//     firstName: "Fiona",
//     lastName: "Anderson",
//     email: "fiona.anderson@student.com",
//     phoneNumber: "0501234566",
//     role: "parent",
//     status: "approved",
//     grade: "Class 5",
//     className: "Class 5",
//     parentName: "Mrs. Anderson",
//     parentContact: "0531234566",
//   },
//   {
//     firstName: "George",
//     lastName: "Thomas",
//     email: "george.thomas@student.com",
//     phoneNumber: "0501234567",
//     role: "parent",
//     status: "approved",
//     grade: "Class 5",
//     className: "Class 5",
//     parentName: "Mr. Thomas",
//     parentContact: "0531234567",
//   },
//   {
//     firstName: "Hannah",
//     lastName: "Jackson",
//     email: "hannah.jackson@student.com",
//     phoneNumber: "0501234568",
//     role: "parent",
//     status: "approved",
//     grade: "Class 5",
//     className: "Class 5",
//     parentName: "Mrs. Jackson",
//     parentContact: "0531234568",
//   },
// ];

// // Subjects data
// const subjects = [
//   {
//     name: "Mathematics",
//     teacherIndex: 0,
//     className: "Class 4",
//     averageScore: 75,
//     assignmentsDone: 4,
//     testsDone: 2,
//     status: "Good",
//   },
//   {
//     name: "English",
//     teacherIndex: 1,
//     className: "Class 4",
//     averageScore: 82,
//     assignmentsDone: 5,
//     testsDone: 2,
//     status: "Excellent",
//   },
//   {
//     name: "Science",
//     teacherIndex: 2,
//     className: "Class 4",
//     averageScore: 70,
//     assignmentsDone: 3,
//     testsDone: 1,
//     status: "Good",
//   },
//   {
//     name: "Mathematics II", // changed name
//     teacherIndex: 0,
//     className: "Class 5",
//     averageScore: 78,
//     assignmentsDone: 5,
//     testsDone: 2,
//     status: "Good",
//   },
//   {
//     name: "English II", // changed name
//     teacherIndex: 1,
//     className: "Class 5",
//     averageScore: 85,
//     assignmentsDone: 6,
//     testsDone: 3,
//     status: "Excellent",
//   },
//   {
//     name: "Science II", // changed name
//     teacherIndex: 2,
//     className: "Class 5",
//     averageScore: 73,
//     assignmentsDone: 4,
//     testsDone: 2,
//     status: "Good",
//   },
// ];

// // Seed function
// const seedDatabase = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URL);
//     console.log("✅ Connected to MongoDB");

//     // Clear existing data
//     await User.deleteMany({});
//     await Subject.deleteMany({});
//     console.log("🗑️ Cleared existing users and subjects");

//     // Create teachers
//     const createdTeachers = [];
//     for (let i = 0; i < teachers.length; i++) {
//       const t = teachers[i];
//       t.userId = generateUserId("TCH", i + 1);
//       const user = new User(t);
//       const tempPass = await user.generateTempPass();
//       await user.save();
//       createdTeachers.push({ user, tempPass });
//     }

//     // Create students
//     const createdStudents = [];
//     for (let i = 0; i < students.length; i++) {
//       const s = students[i];
//       s.userId = generateUserId("STU", i + 1);
//       const user = new User(s);
//       const tempPass = await user.generateTempPass();
//       await user.save();
//       createdStudents.push({ user, tempPass });
//     }

//     // Create subjects and enroll students automatically
//     const createdSubjects = [];
//     for (let subj of subjects) {
//       const teacher = createdTeachers[subj.teacherIndex].user;

//       // Enroll students in the same class
//       const enrolledStudents = createdStudents
//         .filter((s) => s.user.grade === subj.className)
//         .map((s) => s.user.userId);

//       const subject = new Subject({
//         ...subj,
//         teacherId: teacher.userId,
//         enrolledStudents, // New field: array of student IDs
//       });

//       await subject.save();
//       createdSubjects.push(subject);
//     }

//     // Log summary with passwords
//     console.log("\n📊 Seed Summary:");
//     console.log(`   Teachers: ${createdTeachers.length}`);
//     console.log(`   Students: ${createdStudents.length}`);
//     console.log(`   Subjects: ${createdSubjects.length}`);

//     console.log("\n🔐 User Credentials:");
//     createdTeachers.forEach((t) =>
//       console.log(
//         `${t.user.userId} | ${t.user.firstName} ${t.user.lastName} | Temp: ${t.tempPass}`
//       )
//     );
//     createdStudents.forEach((s) =>
//       console.log(
//         `${s.user.userId} | ${s.user.firstName} ${s.user.lastName} | Temp: ${s.tempPass}`
//       )
//     );

//     console.log("\n📚 Subjects & Enrolled Students:");
//     createdSubjects.forEach((subj) =>
//       console.log(
//         `${subj.name} (${subj.className}) | Teacher: ${
//           subj.teacherId
//         } | Students: ${subj.enrolledStudents?.join(", ") || "None"}
// `
//       )
//     );

//     process.exit(0);
//   } catch (error) {
//     console.error("❌ Seed error:", error);
//     process.exit(1);
//   }
// };

// seedDatabase();

// import mongoose from "mongoose";
// import User from "../model/user.js";
// import Subject from "../model/subject.js";

// // Helper to generate unique IDs like TCH001 or STU001
// const generateUserId = (prefix, index) =>
//   `${prefix}${String(index).padStart(3, "0")}`;

// // === TEACHERS ===
// const teachers = [
//   {
//     firstName: "John",
//     lastName: "Doe",
//     email: "john.doe@school.com",
//     phoneNumber: "0201234567",
//     role: "teacher",
//     status: "approved",
//     subjectsTaught: ["Mathematics", "Physics"],
//     qualification: "MSc Mathematics",
//     yearsOfExperience: 5,
//   },
//   {
//     firstName: "Jane",
//     lastName: "Smith",
//     email: "jane.smith@school.com",
//     phoneNumber: "0241234567",
//     role: "teacher",
//     status: "approved",
//     subjectsTaught: ["English", "Literature"],
//     qualification: "BA English Literature",
//     yearsOfExperience: 8,
//   },
//   {
//     firstName: "David",
//     lastName: "Johnson",
//     email: "david.johnson@school.com",
//     phoneNumber: "0271234567",
//     role: "teacher",
//     status: "approved",
//     subjectsTaught: ["Science", "Biology"],
//     qualification: "MSc Biology",
//     yearsOfExperience: 6,
//   },
// ];

// // === STUDENTS ===
// const students = [
//   {
//     firstName: "Alice",
//     lastName: "Brown",
//     email: "alice.brown@student.com",
//     phoneNumber: "0501234561",
//     role: "parent",
//     status: "approved",
//     grade: "Class 4",
//     className: "Class 4",
//     parentName: "Mr. Brown",
//     parentContact: "0531234561",
//   },
//   {
//     firstName: "Bob",
//     lastName: "Wilson",
//     email: "bob.wilson@student.com",
//     phoneNumber: "0501234562",
//     role: "parent",
//     status: "approved",
//     grade: "Class 4",
//     className: "Class 4",
//     parentName: "Mrs. Wilson",
//     parentContact: "0531234562",
//   },
//   {
//     firstName: "Charlie",
//     lastName: "Davis",
//     email: "charlie.davis@student.com",
//     phoneNumber: "0501234563",
//     role: "parent",
//     status: "approved",
//     grade: "Class 4",
//     className: "Class 4",
//     parentName: "Mr. Davis",
//     parentContact: "0531234563",
//   },
//   {
//     firstName: "Diana",
//     lastName: "Taylor",
//     email: "diana.taylor@student.com",
//     phoneNumber: "0501234564",
//     role: "parent",
//     status: "approved",
//     grade: "Class 4",
//     className: "Class 4",
//     parentName: "Mrs. Taylor",
//     parentContact: "0531234564",
//   },
//   {
//     firstName: "Edward",
//     lastName: "Martinez",
//     email: "edward.martinez@student.com",
//     phoneNumber: "0501234565",
//     role: "parent",
//     status: "approved",
//     grade: "Class 4",
//     className: "Class 4",
//     parentName: "Mr. Martinez",
//     parentContact: "0531234565",
//   },
//   {
//     firstName: "Fiona",
//     lastName: "Anderson",
//     email: "fiona.anderson@student.com",
//     phoneNumber: "0501234566",
//     role: "parent",
//     status: "approved",
//     grade: "Class 5",
//     className: "Class 5",
//     parentName: "Mrs. Anderson",
//     parentContact: "0531234566",
//   },
//   {
//     firstName: "George",
//     lastName: "Thomas",
//     email: "george.thomas@student.com",
//     phoneNumber: "0501234567",
//     role: "parent",
//     status: "approved",
//     grade: "Class 5",
//     className: "Class 5",
//     parentName: "Mr. Thomas",
//     parentContact: "0531234567",
//   },
//   {
//     firstName: "Hannah",
//     lastName: "Jackson",
//     email: "hannah.jackson@student.com",
//     phoneNumber: "0501234568",
//     role: "parent",
//     status: "approved",
//     grade: "Class 5",
//     className: "Class 5",
//     parentName: "Mrs. Jackson",
//     parentContact: "0531234568",
//   },
// ];

// // === SUBJECTS ===
// const subjects = [
//   {
//     name: "Mathematics",
//     teacherIndex: 0,
//     className: "Class 4",
//     averageScore: 75,
//     assignmentsDone: 4,
//     testsDone: 2,
//     status: "Good",
//   },
//   {
//     name: "English",
//     teacherIndex: 1,
//     className: "Class 4",
//     averageScore: 82,
//     assignmentsDone: 5,
//     testsDone: 2,
//     status: "Excellent",
//   },
//   {
//     name: "Science",
//     teacherIndex: 2,
//     className: "Class 4",
//     averageScore: 70,
//     assignmentsDone: 3,
//     testsDone: 1,
//     status: "Good",
//   },
//   {
//     name: "Mathematics II",
//     teacherIndex: 0,
//     className: "Class 5",
//     averageScore: 78,
//     assignmentsDone: 5,
//     testsDone: 2,
//     status: "Good",
//   },
//   {
//     name: "English II",
//     teacherIndex: 1,
//     className: "Class 5",
//     averageScore: 85,
//     assignmentsDone: 6,
//     testsDone: 3,
//     status: "Excellent",
//   },
//   {
//     name: "Science II",
//     teacherIndex: 2,
//     className: "Class 5",
//     averageScore: 73,
//     assignmentsDone: 4,
//     testsDone: 2,
//     status: "Good",
//   },
// ];

// // === MAIN SEED FUNCTION ===
// const seedDatabase = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URL);
//     console.log("✅ Connected to MongoDB");

//     await User.deleteMany({});
//     await Subject.deleteMany({});
//     console.log("🗑️ Cleared existing users and subjects");

//     // --- Create Teachers ---
//     const createdTeachers = [];
//     for (let i = 0; i < teachers.length; i++) {
//       const t = teachers[i];
//       t.userId = generateUserId("TCH", i + 1);
//       const user = new User(t);
//       const tempPass = await user.generateTempPass();
//       await user.save();
//       createdTeachers.push({ user, tempPass });
//     }

//     // --- Create Students ---
//     const createdStudents = [];
//     for (let i = 0; i < students.length; i++) {
//       const s = students[i];
//       s.userId = generateUserId("STU", i + 1);
//       const user = new User(s);
//       const tempPass = await user.generateTempPass();
//       await user.save();
//       createdStudents.push({ user, tempPass });
//     }

//     // --- Create Subjects ---
//     const createdSubjects = [];
//     for (let subj of subjects) {
//       const teacher = createdTeachers[subj.teacherIndex].user;

//       // Match students based on className
//       const enrolledStudents = createdStudents
//         .filter((s) => s.user.className === subj.className)
//         .map((s) => s.user.userId);

//       const subject = new Subject({
//         ...subj,
//         teacherId: teacher.userId,
//         enrolledStudents,
//       });

//       await subject.save();
//       createdSubjects.push(subject);
//     }

//     // --- OUTPUT ---
//     console.log("\n📊 Seed Summary:");
//     console.log(`   Teachers: ${createdTeachers.length}`);
//     console.log(`   Students: ${createdStudents.length}`);
//     console.log(`   Subjects: ${createdSubjects.length}`);

//     console.log("\n🔐 User Credentials:");
//     createdTeachers.forEach((t) =>
//       console.log(
//         `${t.user.userId} | ${t.user.firstName} ${t.user.lastName} | Temp: ${t.tempPass}`
//       )
//     );
//     createdStudents.forEach((s) =>
//       console.log(
//         `${s.user.userId} | ${s.user.firstName} ${s.user.lastName} | Temp: ${s.tempPass}`
//       )
//     );

//     console.log("\n📚 Subjects & Enrolled Students:");
//     createdSubjects.forEach((subj) =>
//       console.log(
//         `${subj.name} (${subj.className}) | Teacher: ${
//           subj.teacherId
//         } | Students: ${subj.enrolledStudents?.join(", ") || "None"}`
//       )
//     );

//     process.exit(0);
//   } catch (error) {
//     console.error("❌ Seed error:", error);
//     process.exit(1);
//   }
// };

// // === RUN SEED ===
// seedDatabase();
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Teacher from "../model/teacher.js";
import Student from "../model/student.js";
import Subject from "../model/subject.js";

const generateTeacherId = (index) => `TCH${String(index + 1).padStart(3, "0")}`;
const generateStudentCode = (index) =>
  `STU${String(index + 1).padStart(4, "0")}`;

const DEFAULT_PASSWORD = "Password@123"; // Default password for all

// Sample teachers
const teachers = [
  {
    fullName: "John Doe",
    email: "john.doe@school.com",
    subjectSpecialization: "Mathematics",
  },
  {
    fullName: "Jane Smith",
    email: "jane.smith@school.com",
    subjectSpecialization: "English",
  },
  {
    fullName: "David Johnson",
    email: "david.johnson@school.com",
    subjectSpecialization: "Science",
  },
];

// Sample students
const students = [
  {
    firstName: "Alice",
    lastName: "Brown",
    gender: "Female",
    classLevel: "Primary 4",
    parentName: "Mr. Brown",
  },
  {
    firstName: "Bob",
    lastName: "Wilson",
    gender: "Male",
    classLevel: "Primary 4",
    parentName: "Mrs. Wilson",
  },
  {
    firstName: "Charlie",
    lastName: "Davis",
    gender: "Male",
    classLevel: "Primary 4",
    parentName: "Mr. Davis",
  },
  {
    firstName: "Diana",
    lastName: "Taylor",
    gender: "Female",
    classLevel: "Primary 4",
    parentName: "Mrs. Taylor",
  },
  {
    firstName: "Edward",
    lastName: "Martinez",
    gender: "Male",
    classLevel: "Primary 5",
    parentName: "Mr. Martinez",
  },
  {
    firstName: "Fiona",
    lastName: "Anderson",
    gender: "Female",
    classLevel: "Primary 5",
    parentName: "Mrs. Anderson",
  },
  {
    firstName: "George",
    lastName: "Thomas",
    gender: "Male",
    classLevel: "Primary 5",
    parentName: "Mr. Thomas",
  },
  {
    firstName: "Hannah",
    lastName: "Jackson",
    gender: "Female",
    classLevel: "Primary 5",
    parentName: "Mrs. Jackson",
  },
];

// Subjects
const subjects = [
  {
    name: "Mathematics",
    teacherIndex: 0,
    classLevel: "Primary 4",
    averageScore: 75,
    status: "Good",
  },
  {
    name: "English",
    teacherIndex: 1,
    classLevel: "Primary 4",
    averageScore: 82,
    status: "Excellent",
  },
  {
    name: "Science",
    teacherIndex: 2,
    classLevel: "Primary 4",
    averageScore: 70,
    status: "Good",
  },
  {
    name: "Mathematics II",
    teacherIndex: 0,
    classLevel: "Primary 5",
    averageScore: 78,
    status: "Good",
  },
  {
    name: "English II",
    teacherIndex: 1,
    classLevel: "Primary 5",
    averageScore: 85,
    status: "Excellent",
  },
  {
    name: "Science II",
    teacherIndex: 2,
    classLevel: "Primary 5",
    averageScore: 73,
    status: "Good",
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Connected to MongoDB");

    await Teacher.deleteMany({});
    await Student.deleteMany({});
    await Subject.deleteMany({});
    console.log("🗑️ Cleared existing data");

    // Create teachers
    const createdTeachers = [];
    for (let i = 0; i < teachers.length; i++) {
      const teacher = teachers[i];
      const teacherId = generateTeacherId(i);
      const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);

      const newTeacher = new Teacher({
        ...teacher,
        teacherId,
        password: hashedPassword,
      });

      await newTeacher.save();
      createdTeachers.push(newTeacher);
    }

    // Create students
    const createdStudents = [];
    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      const studentCode = generateStudentCode(i);
      const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);

      const newStudent = new Student({
        ...student,
        studentCode,
        password: hashedPassword,
      });

      await newStudent.save();
      createdStudents.push(newStudent);
    }

    // Create subjects
    const createdSubjects = [];
    for (let subj of subjects) {
      const teacher = createdTeachers[subj.teacherIndex];
      const subject = new Subject({
        name: subj.name,
        teacherId: teacher.teacherId,
        classLevel: subj.classLevel,
        averageScore: subj.averageScore,
        status: subj.status,
      });
      await subject.save();
      createdSubjects.push(subject);
    }

    console.log("\n📊 Seed Summary:");
    console.log(`Teachers: ${createdTeachers.length}`);
    console.log(`Students: ${createdStudents.length}`);
    console.log(`Subjects: ${createdSubjects.length}`);

    console.log("\n🔐 Login Credentials:");
    createdTeachers.forEach((t) =>
      console.log(
        `Teacher: ${t.fullName} | Username: ${t.teacherId} | Password: ${DEFAULT_PASSWORD}`
      )
    );
    createdStudents.forEach((s) =>
      console.log(
        `Student: ${s.firstName} ${s.lastName} | Username: ${s.studentCode} | Password: ${DEFAULT_PASSWORD}`
      )
    );

    console.log("\n✅ Done seeding!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
};

seedDatabase();
