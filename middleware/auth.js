import jwt from "jsonwebtoken";
import User from "../model/user.js";

// Protect routes - require authentication
export const routeProtect = async (req, res, next) => {
  try {
    let token;

    // Check for token in cookies or Authorization header
    if (req.cookies.jwt) {
      token = req.cookies.jwt;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, please login",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by decoded token id
    const user = await User.findById(decoded.id).select("-tempPassword");

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "User not found or inactive",
      });
    }

    // Check if user is approved
    if (user.status !== "approved") {
      return res.status(403).json({
        success: false,
        message: `Account is ${user.status}. Please wait for approval.`,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// Restrict to specific roles
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action",
      });
    }
    next();
  };
};

// Check if user is a teacher
export const isTeacher = (req, res, next) => {
  if (req.user.role !== "teacher") {
    return res.status(403).json({
      success: false,
      message: "This action is only available to teachers",
    });
  }
  next();
};

// Check if user is a student/parent
export const isParent = (req, res, next) => {
  if (req.user.role !== "parent") {
    return res.status(403).json({
      success: false,
      message: "This action is only available to students/parents",
    });
  }
  next();
};

// Check if user is admin
export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "This action is only available to administrators",
    });
  }
  next();
};

// Verify teacher owns the resource
export const verifyTeacherOwnership = async (req, res, next) => {
  try {
    const { teacherId } = req.params;

    if (req.user.role !== "teacher") {
      return res.status(403).json({
        success: false,
        message: "Only teachers can access this resource",
      });
    }

    if (req.user.userId !== teacherId) {
      return res.status(403).json({
        success: false,
        message: "You can only access your own resources",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error verifying ownership",
    });
  }
};

// Optional authentication (for routes that work with or without auth)
export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.cookies.jwt) {
      token = req.cookies.jwt;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-tempPassword");

      if (user && user.isActive && user.status === "approved") {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Continue without auth if token is invalid
    next();
  }
};
