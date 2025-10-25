import jwt from "jsonwebtoken";
import { sendMail } from "../config/sendMail.js";
import User from "../model/user.js";

// 🔹 Helper: Detect role from userId
const getRoleFromUserId = (userId) => {
  if (userId.startsWith("STU")) return "parent";
  if (userId.startsWith("TCH")) return "teacher";
  if (userId.startsWith("AD")) return "admin";
  return null;
};

// 🔹 Helper: Generate JWT
const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT secret is missing");
  }
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// =====================================
//  ADMIN REGISTER
// =====================================
export const adminRegister = async (req, res, next) => {
  const { firstName, lastName, email, phoneNumber, userId } = req.body;

  if (!firstName || !lastName || !email || !phoneNumber || !userId) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const existingUser = await User.findOne({ userId });
    if (existingUser) {
      return res.status(400).json({ message: "User ID already exists." });
    }

    const role = getRoleFromUserId(userId);
    if (!role) {
      return res.status(400).json({ message: "Invalid user ID format." });
    }

    const user = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      userId,
      role,
    });

    // Generate temporary password
    const tempPass = await user.generateTempPass();
    await user.save();

    // Login link (temporary)
    const link = `${req.protocol}://localhost:5173/login/${userId}`;

    // Send email
    const subject = "Login Credentials";
    const html = `
      <p>Dear ${firstName},</p>
      <p>Your account has been created. Below are your login credentials:</p>
      <p><strong>Username:</strong> ${userId}</p>
      <p><strong>Temporary Password:</strong> ${tempPass}</p>
      <p><a href="${link}">Click here to log in</a> and please change your password after logging in.</p>
    `;

    await sendMail({ to: email, subject, html });

    res.status(201).json({
      success: true,
      message: `User registered successfully as ${role}. Login credentials sent to email.`,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================
//  USER LOGIN (with JWT + cookie)
// =====================================
export const login = async (req, res, next) => {
  const { userId, password } = req.body;

  if (!userId || !password) {
    const error = new Error("Username and Password required");
    error.statusCode = 400;
    return next(error);
  }

  try {
    const user = await User.findOne({ userId });
    if (!user) {
      const error = new Error("Username or Password Incorrect");
      error.statusCode = 401;
      return next(error);
    }

    const isMatching = await user.isMatch(password);
    if (!isMatching) {
      const error = new Error("Username or Password Incorrect");
      error.statusCode = 401;
      return next(error);
    }

    // 🔹 Generate JWT token
    const token = generateToken(user);

    // 🔹 Send cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // 🔹 Response
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        userId: user.userId,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        grade: user.grade,
        subjectsTaught: user.subjectsTaught,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    next(error);
  }
};

// =====================================
//  PROFILE UPDATE
// =====================================
export const updateProfile = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const {
      firstName,
      lastName,
      phoneNumber,
      grade,
      subjectsTaught,
      profilePicture,
    } = req.body;

    const user = await User.findOne({ userId });
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (grade) user.grade = grade;
    if (subjectsTaught) user.subjectsTaught = subjectsTaught;
    if (profilePicture) user.profilePicture = profilePicture;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        grade: user.grade,
        subjectsTaught: user.subjectsTaught,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    next(error);
  }
};

// =====================================
//  PROFILE IMAGE UPLOAD
// =====================================
export const profileUpload = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.profilePic = `uploads/${req.file.filename}`;
    await user.save();

    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      profilePic: user.profilePic,
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res) => {
  try {
    // req.user is added by routeProtect middleware
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

// import jwt from "jsonwebtoken";
// import bcrypt from "bcryptjs";
// import { sendMail } from "../config/sendMail.js";
// import User from "../model/user.js";
// import Teacher from "../model/teacher.js";
// import Student from "../model/student.js";

// // 🔹 Helper: Detect role from userId
// const getRoleFromUserId = (userId) => {
//   if (userId.startsWith("STU")) return "parent";
//   if (userId.startsWith("TCH")) return "teacher";
//   if (userId.startsWith("AD")) return "admin";
//   return null;
// };

// // 🔹 Helper: Generate JWT
// const generateToken = (user) => {
//   if (!process.env.JWT_SECRET) {
//     throw new Error("JWT secret is missing");
//   }
//   return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
//     expiresIn: "7d",
//   });
// };

// // =====================================
// //  ADMIN REGISTER
// // =====================================
// export const adminRegister = async (req, res, next) => {
//   const { firstName, lastName, email, phoneNumber, userId } = req.body;

//   if (!firstName || !lastName || !email || !phoneNumber || !userId) {
//     return res.status(400).json({ message: "All fields are required." });
//   }

//   try {
//     const existingUser = await User.findOne({ userId });
//     if (existingUser) {
//       return res.status(400).json({ message: "User ID already exists." });
//     }

//     const role = getRoleFromUserId(userId);
//     if (!role) {
//       return res.status(400).json({ message: "Invalid user ID format." });
//     }

//     const user = new User({
//       firstName,
//       lastName,
//       email,
//       phoneNumber,
//       userId,
//       role,
//     });

//     // Generate temporary password
//     const tempPass = await user.generateTempPass();
//     await user.save();

//     // Login link (temporary)
//     const link = `${req.protocol}://localhost:5173/login/${userId}`;

//     // Send email
//     const subject = "Login Credentials";
//     const html = `
//       <p>Dear ${firstName},</p>
//       <p>Your account has been created. Below are your login credentials:</p>
//       <p><strong>Username:</strong> ${userId}</p>
//       <p><strong>Temporary Password:</strong> ${tempPass}</p>
//       <p><a href="${link}">Click here to log in</a> and please change your password after logging in.</p>
//     `;

//     await sendMail({ to: email, subject, html });

//     res.status(201).json({
//       success: true,
//       message: `User registered successfully as ${role}. Login credentials sent to email.`,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // =====================================
// //  USER LOGIN (with JWT + cookie)
// // =====================================
// // THE ONE IM USING BEFORE THE SEED
// export const login = async (req, res, next) => {
//   const { userId, password } = req.body;

//   if (!userId || !password) {
//     const error = new Error("Username and Password required");
//     error.statusCode = 400;
//     return next(error);
//   }

//   try {
//     const user = await User.findOne({ userId });
//     if (!user) {
//       const error = new Error("Username or Password Incorrect");
//       error.statusCode = 401;
//       return next(error);
//     }

//     const isMatching = await user.isMatch(password);
//     if (!isMatching) {
//       const error = new Error("Username or Password Incorrect");
//       error.statusCode = 401;
//       return next(error);
//     }

//     // 🔹 Generate JWT token
//     const token = generateToken(user);

//     // 🔹 Send cookie
//     res.cookie("jwt", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//     });

//     // 🔹 Response
//     res.status(200).json({
//       success: true,
//       message: "Login successful",
//       token,
//       user: {
//         userId: user.userId,
//         role: user.role,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         phoneNumber: user.phoneNumber,
//         grade: user.grade,
//         subjectsTaught: user.subjectsTaught,
//         profilePicture: user.profilePicture,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // =====================================
// //  PROFILE UPDATE
// // =====================================
// export const login = async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     // Check if username exists
//     if (!username || !password) {
//       return res
//         .status(400)
//         .json({ message: "Username and password are required" });
//     }

//     let user;
//     if (username.startsWith("TCH")) {
//       // Changed from teacherCode to teacherId
//       user = await Teacher.findOne({ teacherId: username });
//     } else if (username.startsWith("STU")) {
//       user = await Student.findOne({ studentCode: username });
//     } else {
//       return res.status(400).json({ message: "Invalid username format" });
//     }

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Use bcrypt to compare hashed passwords
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     // Generate token
//     const token = generateToken(user._id, user.role);
//     res.status(200).json({ success: true, token, user });
//   } catch (error) {
//     console.error("Login Error:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// export const updateProfile = async (req, res, next) => {
//   try {
//     const { userId } = req.body;
//     const {
//       firstName,
//       lastName,
//       phoneNumber,
//       grade,
//       subjectsTaught,
//       profilePicture,
//     } = req.body;

//     const user = await User.findOne({ userId });
//     if (!user) {
//       const error = new Error("User not found");
//       error.statusCode = 404;
//       return next(error);
//     }

//     if (firstName) user.firstName = firstName;
//     if (lastName) user.lastName = lastName;
//     if (phoneNumber) user.phoneNumber = phoneNumber;
//     if (grade) user.grade = grade;
//     if (subjectsTaught) user.subjectsTaught = subjectsTaught;
//     if (profilePicture) user.profilePicture = profilePicture;

//     await user.save();

//     res.status(200).json({
//       success: true,
//       message: "Profile updated successfully.",
//       user: {
//         userId: user.userId,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         phoneNumber: user.phoneNumber,
//         role: user.role,
//         grade: user.grade,
//         subjectsTaught: user.subjectsTaught,
//         profilePicture: user.profilePicture,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // =====================================
// //  PROFILE IMAGE UPLOAD
// // =====================================
// export const profileUpload = async (req, res, next) => {
//   try {
//     const user = await User.findById(req.user._id);
//     user.profilePic = `uploads/${req.file.filename}`;
//     await user.save();

//     res.status(200).json({
//       success: true,
//       message: "File uploaded successfully",
//       profilePic: user.profilePic,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const getProfile = async (req, res) => {
//   try {
//     // req.user is added by routeProtect middleware
//     res.status(200).json({
//       success: true,
//       user: req.user,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch profile",
//     });
//   }
// };
