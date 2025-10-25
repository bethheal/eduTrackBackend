import User from "../model/user.js";
import jwt from "jsonwebtoken";

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Register new user (can be used by admin or public)
export const register = async (req, res, next) => {
  try {
    const {
      username,
      userId, // Support both username and userId
      password,
      role,
      firstName,
      lastName,
      email,
      phoneNumber,
      className,
      grade,
      parentName,
      parentContact,
      subjects,
      subjectsTaught,
      qualification,
      yearsOfExperience,
    } = req.body;

    // Validate required fields
    if (!password || !role || !firstName || !lastName || !email) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Use userId if provided, otherwise use username
    const userIdentifier = userId || username;

    // Check if username/userId already exists (if provided)
    if (userIdentifier) {
      const existingUsername = await User.findOne({
        $or: [{ username: userIdentifier }, { userId: userIdentifier }],
      });
      if (existingUsername) {
        return res.status(400).json({
          success: false,
          message: "Username/User ID already taken",
        });
      }
    }

    // Validate student requirements
    if (role === "student" || role === "parent") {
      if (!className && !grade) {
        return res.status(400).json({
          success: false,
          message: "Class/Grade is required for students",
        });
      }
    }

    // Create user object
    const userData = {
      username: userIdentifier,
      userId: userIdentifier, // Store in both fields for compatibility
      password,
      role,
      firstName,
      lastName,
      email,
      phoneNumber,
      status: "approved", // Auto-approve
      isActive: true,
    };

    // Add role-specific fields
    if (role === "student" || role === "parent") {
      userData.className = className || grade;
      userData.grade = grade || className;
      userData.parentName = parentName;
      userData.parentContact = parentContact;
    } else if (role === "teacher") {
      userData.subjects = subjects || subjectsTaught || [];
      userData.subjectsTaught = subjectsTaught || subjects || [];
      userData.qualification = qualification;
      userData.yearsOfExperience = yearsOfExperience;
    }

    const user = await User.create(userData);

    // Generate token
    const token = generateToken(user._id);

    // Set cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        _id: user._id,
        username: user.username || user.userId,
        userId: user.userId || user.username,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        className: user.className,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// Alias for admin registration
export const adminRegister = register;

// Login user
export const login = async (req, res, next) => {
  try {
    const { username, userId, password } = req.body;

    // Support both username and userId
    const userIdentifier = userId || username;

    // Validate input
    if (!userIdentifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide username and password",
      });
    }

    // Find user by username or userId
    const user = await User.findOne({
      $or: [{ username: userIdentifier }, { userId: userIdentifier }],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if user is active
    if (user.isActive === false) {
      return res.status(401).json({
        success: false,
        message: "Account is inactive. Please contact administrator.",
      });
    }

    // Check if user is approved
    if (user.status && user.status !== "approved") {
      return res.status(401).json({
        success: false,
        message: `Account is ${user.status}. Please wait for approval.`,
      });
    }

    // Check password - support both comparePassword and isMatch methods
    let isPasswordCorrect = false;

    if (typeof user.comparePassword === "function") {
      isPasswordCorrect = await user.comparePassword(password);
    } else if (typeof user.isMatch === "function") {
      isPasswordCorrect = await user.isMatch(password);
    } else {
      // Direct comparison if no method exists (not recommended)
      const bcrypt = await import("bcryptjs");
      isPasswordCorrect = await bcrypt.compare(
        password,
        user.password || user.tempPassword
      );
    }

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Set cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        _id: user._id,
        username: user.username || user.userId,
        userId: user.userId || user.username,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        className: user.className,
        grade: user.grade,
        profileImage: user.profileImage,
        profilePicture: user.profilePicture,
        status: user.status,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// Logout user
export const logout = async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

// Get current user profile
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-password -tempPassword"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        username: user.username || user.userId,
        userId: user.userId || user.username,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        className: user.className,
        grade: user.grade,
        parentName: user.parentName,
        parentContact: user.parentContact,
        subjects: user.subjects,
        subjectsTaught: user.subjectsTaught,
        qualification: user.qualification,
        yearsOfExperience: user.yearsOfExperience,
        profileImage: user.profileImage,
        profilePicture: user.profilePicture,
        status: user.status,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update user profile
export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Fields that can be updated
    const allowedUpdates = [
      "firstName",
      "lastName",
      "email",
      "phoneNumber",
      "profileImage",
      "profilePicture",
      "parentName",
      "parentContact",
      "subjects",
      "subjectsTaught",
      "qualification",
      "yearsOfExperience",
      "grade",
      "className",
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    // Handle password update separately
    if (req.body.password) {
      user.password = req.body.password;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        _id: user._id,
        username: user.username || user.userId,
        userId: user.userId || user.username,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profileImage: user.profileImage,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Change password
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify current password
    let isMatching = false;
    if (typeof user.comparePassword === "function") {
      isMatching = await user.comparePassword(currentPassword);
    } else if (typeof user.isMatch === "function") {
      isMatching = await user.isMatch(currentPassword);
    }

    if (!isMatching) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Set new password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};
