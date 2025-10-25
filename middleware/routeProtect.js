// import jwt from 'jsonwebtoken';
// import User from '../model/user.js';

// export const routeProtect = async (req, res, next) => {
//   try {
//     const token = req.cookies.jwt;

//     if (!token) {
//       return res.status(401).json({ message: 'User not logged in' });
//     }

//     // Verify and decode token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Find user by decoded token id
//     const user = await User.findById(decoded.id).select('-password');

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: 'Invalid or expired token' });
//   }
// };

import jwt from "jsonwebtoken";
import User from "../model/user.js";

// ✅ Verify login and attach user to req
export const routeProtect = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "User not logged in" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Support both _id and custom userId (like TCH100)
    const query = decoded.userId
      ? { userId: decoded.userId }
      : { _id: decoded.id };

    const user = await User.findOne(query).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Error:", error);
    return res
      .status(401)
      .json({ message: "Invalid or expired token. Please log in again." });
  }
};

// ✅ Check role authorization
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access denied: unauthorized role" });
    }
    next();
  };
};

// import jwt from "jsonwebtoken";
// import User from "../model/user.js";

// // Protect routes - require authentication
// export const routeProtect = async (req, res, next) => {
//   try {
//     let token;

//     // Check for token in cookies or Authorization header
//     if (req.cookies.jwt) {
//       token = req.cookies.jwt;
//     } else if (
//       req.headers.authorization &&
//       req.headers.authorization.startsWith("Bearer")
//     ) {
//       token = req.headers.authorization.split(" ")[1];
//     }

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Not authorized, please login",
//       });
//     }

//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Find user by decoded token id
//     const user = await User.findById(decoded.id).select("-password");

//     if (!user || !user.isActive) {
//       return res.status(401).json({
//         success: false,
//         message: "User not found or inactive",
//       });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     return res.status(401).json({
//       success: false,
//       message: "Invalid or expired token",
//     });
//   }
// };

// // Restrict to specific roles
// export const restrictTo = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({
//         success: false,
//         message: "You do not have permission to perform this action",
//       });
//     }
//     next();
//   };
// };

// // Check if user is a teacher
// export const isTeacher = (req, res, next) => {
//   if (req.user.role !== "teacher") {
//     return res.status(403).json({
//       success: false,
//       message: "This action is only available to teachers",
//     });
//   }
//   next();
// };

// // Check if user is a student
// export const isStudent = (req, res, next) => {
//   if (req.user.role !== "student") {
//     return res.status(403).json({
//       success: false,
//       message: "This action is only available to students",
//     });
//   }
//   next();
// };

// // Verify teacher owns the resource
// export const verifyTeacherOwnership = async (req, res, next) => {
//   try {
//     const { teacherId } = req.params;

//     if (req.user.role !== "teacher") {
//       return res.status(403).json({
//         success: false,
//         message: "Only teachers can access this resource",
//       });
//     }

//     if (req.user.username !== teacherId) {
//       return res.status(403).json({
//         success: false,
//         message: "You can only access your own resources",
//       });
//     }

//     next();
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Error verifying ownership",
//     });
//   }
// };
