// import Profile from "../model/profile.js";
// import Subject from "../model/subject.js";

// export const getProfile = async (req, res) => {
//   try {
//     let profile = await Profile.findOne({ userId: req.user._id });

//     // Auto-create if missing
//     if (!profile) {
//       profile = await Profile.create({
//         userId: req.user._id,
//         userType: req.user.userType || req.user.role,
//         firstName: req.user.firstName,
//         lastName: req.user.lastName,
//         email: req.user.email,
//         phoneNumber: req.user.phoneNumber || "",
//         title: req.user.role === "teacher" ? "Teacher" : "Parent",
//         profileImage: req.user.profilePicture || "",
//         subjects: [],
//         children: [],
//         isActive: true,
//       });
//     }

//     res.json(
//       profile.userType === "teacher"
//         ? { teacher: profile }
//         : { parent: profile }
//     );
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // ✅ FIXED: Update profile - now updates Profile model correctly
// export const updateProfile = async (req, res) => {
//   try {
//     const { phone, subjectsInput } = req.body;

//     console.log("📥 Received update data:", {
//       phone,
//       subjectsInput,
//       hasFile: !!req.file,
//       userId: req.user._id,
//       userType: req.user.role || req.user.userType,
//     });

//     // Find the profile document
//     const profile = await Profile.findOne({ userId: req.user._id });

//     if (!profile) {
//       console.log("❌ Profile not found for userId:", req.user._id);
//       return res.status(404).json({ message: "Profile not found" });
//     }

//     console.log("📋 Current profile before update:", {
//       phoneNumber: profile.phoneNumber,
//       profileImage: profile.profileImage,
//       subjects: profile.subjects,
//       userType: profile.userType,
//     });

//     // Update phone number if provided
//     if (phone !== undefined && phone !== null) {
//       profile.phoneNumber = phone;
//       console.log("📱 Updated phone to:", phone);
//     }

//     // Update profile image if uploaded
//     if (req.file) {
//       profile.profileImage = `uploads/${req.file.filename}`;
//       console.log("🖼️ Updated image path to:", profile.profileImage);
//     }

//     // Update subjects if provided (even if empty string to clear subjects)
//     if (subjectsInput !== undefined && profile.userType === "teacher") {
//       const subjects = subjectsInput
//         .split(",")
//         .map((s) => s.trim())
//         .filter(Boolean);

//       console.log("📚 Updating subjects to:", subjects);
//       profile.subjects = subjects;
//     }

//     // Save the updated profile
//     await profile.save();

//     console.log("✅ Profile saved successfully:", {
//       phoneNumber: profile.phoneNumber,
//       profileImage: profile.profileImage,
//       subjects: profile.subjects,
//     });

//     // Return the appropriate response based on userType
//     const responseData = {
//       message: "Profile updated successfully",
//     };

//     if (profile.userType === "teacher") {
//       responseData.teacher = profile;
//     } else {
//       responseData.parent = profile;
//     }

//     console.log("📤 Sending response:", responseData);

//     res.status(200).json(responseData);
//   } catch (err) {
//     console.error("❌ Update profile error:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// export const addChild = async (req, res) => {
//   try {
//     const { firstName, lastName, classLevel, dateOfBirth, gender } = req.body;

//     const profile = await Profile.findOne({ userId: req.user._id });
//     if (!profile) return res.status(404).json({ message: "Profile not found" });
//     if (profile.userType !== "parent") {
//       return res.status(403).json({ message: "Only parents can add children" });
//     }

//     const child = {
//       firstName,
//       lastName,
//       name: `${firstName} ${lastName}`,
//       classLevel,
//       dateOfBirth,
//       gender,
//     };

//     profile.children.push(child);
//     await profile.save();

//     res.json({ message: "Child added successfully", parent: profile });
//   } catch (err) {
//     console.error("❌ addChild error:", err);
//     res.status(500).json({ message: "Failed to add child" });
//   }
// };

// export const updateChild = async (req, res) => {
//   try {
//     const { childId } = req.params;
//     const { firstName, lastName, classLevel, dateOfBirth, gender } = req.body;

//     const profile = await Profile.findOne({ userId: req.user._id });
//     if (!profile || profile.userType !== "parent") {
//       return res.status(404).json({ message: "Parent profile not found" });
//     }

//     const child = profile.children.id(childId);
//     if (!child) return res.status(404).json({ message: "Child not found" });

//     if (firstName) child.firstName = firstName;
//     if (lastName) child.lastName = lastName;
//     if (firstName || lastName)
//       child.name = `${child.firstName} ${child.lastName}`;
//     if (classLevel) child.classLevel = classLevel;
//     if (dateOfBirth) child.dateOfBirth = dateOfBirth;
//     if (gender) child.gender = gender;

//     await profile.save();
//     res.json({ message: "Child updated successfully", parent: profile });
//   } catch (err) {
//     console.error("❌ updateChild error:", err);
//     res.status(500).json({ message: "Failed to update child" });
//   }
// };

// export const removeChild = async (req, res) => {
//   try {
//     const { childId } = req.params;

//     const profile = await Profile.findOne({ userId: req.user._id });
//     if (!profile || profile.userType !== "parent") {
//       return res.status(404).json({ message: "Parent profile not found" });
//     }

//     profile.children.pull(childId);
//     await profile.save();

//     res.json({ message: "Child removed successfully", parent: profile });
//   } catch (err) {
//     console.error("❌ removeChild error:", err);
//     res.status(500).json({ message: "Failed to remove child" });
//   }
// };

// // ✅ Assign subject to teacher (Admin function)
// export const assignSubject = async (req, res) => {
//   try {
//     const { teacherId, subjectId } = req.body;
//     if (!teacherId || !subjectId) {
//       return res
//         .status(400)
//         .json({ message: "teacherId and subjectId are required" });
//     }

//     const profile = await Profile.findById(teacherId);
//     if (!profile || profile.userType !== "teacher") {
//       return res.status(404).json({ message: "Teacher not found" });
//     }

//     const subject = await Subject.findById(subjectId);
//     if (!subject) return res.status(404).json({ message: "Subject not found" });

//     if (!profile.subjects.includes(subjectId)) {
//       profile.subjects.push(subjectId);
//       await profile.save();
//     }

//     const updatedProfile = await profile.populate("subjects");
//     res.json({
//       message: "Subject assigned successfully",
//       teacher: updatedProfile,
//     });
//   } catch (err) {
//     console.error("❌ assignSubject error:", err);
//     res.status(500).json({ message: "Failed to assign subject" });
//   }
// };

// // ✅ Remove subject from teacher
// export const removeSubject = async (req, res) => {
//   try {
//     const { teacherId, subjectId } = req.body;

//     const profile = await Profile.findById(teacherId);
//     if (!profile || profile.userType !== "teacher") {
//       return res.status(404).json({ message: "Teacher not found" });
//     }

//     profile.subjects = profile.subjects.filter(
//       (id) => id.toString() !== subjectId
//     );
//     await profile.save();

//     const updatedProfile = await profile.populate("subjects");
//     res.json({
//       message: "Subject removed successfully",
//       teacher: updatedProfile,
//     });
//   } catch (err) {
//     console.error("❌ removeSubject error:", err);
//     res.status(500).json({ message: "Failed to remove subject" });
//   }
// };

// // ✅ Get all available subjects
// export const getAllSubjects = async (req, res) => {
//   try {
//     const subjects = await Subject.find();
//     res.json({ subjects });
//   } catch (err) {
//     console.error("❌ getAllSubjects error:", err);
//     res.status(500).json({ message: "Failed to fetch subjects" });
//   }
// };

// // ✅ Get all teachers (for admin)
// export const getAllTeachers = async (req, res) => {
//   try {
//     const teachers = await Profile.find({
//       userType: "teacher",
//       isActive: true,
//     }).populate("subjects");

//     res.json({ teachers });
//   } catch (err) {
//     console.error("❌ getAllTeachers error:", err);
//     res.status(500).json({ message: "Failed to fetch teachers" });
//   }
// };

// // ✅ Get all parents (for admin)
// export const getAllParents = async (req, res) => {
//   try {
//     const parents = await Profile.find({
//       userType: "parent",
//       isActive: true,
//     });

//     res.json({ parents });
//   } catch (err) {
//     console.error("❌ getAllParents error:", err);
//     res.status(500).json({ message: "Failed to fetch parents" });
//   }
// };

import Profile from "../model/profile.js";
import Subject from "../model/subject.js";

export const getProfile = async (req, res) => {
  try {
    console.log(
      "🔍 Fetching profile for userId:",
      req.user._id,
      "role:",
      req.user.role
    );

    let profile = await Profile.findOne({ userId: req.user._id });

    // Auto-create if missing
    if (!profile) {
      console.log("⚠️ Profile not found, creating new one...");

      const userType = req.user.role || req.user.userType;

      profile = await Profile.create({
        userId: req.user._id,
        userType: userType,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        phoneNumber: req.user.phoneNumber || "",
        title:
          userType === "teacher"
            ? "Teacher"
            : userType === "parent"
            ? "Parent"
            : "Student",
        profileImage: req.user.profilePicture || "",
        classLevel: req.user.grade || "", // ✅ Get class level from User model if exists
        subjects: [],
        children: [],
        isActive: true,
      });

      console.log("✅ Created new profile:", {
        userType: profile.userType,
        firstName: profile.firstName,
        lastName: profile.lastName,
        classLevel: profile.classLevel,
      });
    }

    console.log("📤 Sending profile response:", {
      userType: profile.userType,
      phoneNumber: profile.phoneNumber,
      profileImage: profile.profileImage,
      classLevel: profile.classLevel,
      hasChildren: profile.children?.length || 0,
    });

    // Return appropriate response based on user type
    if (profile.userType === "teacher") {
      res.json({ teacher: profile });
    } else if (profile.userType === "parent") {
      res.json({ parent: profile });
    } else {
      res.json({ student: profile });
    }
  } catch (err) {
    console.error("❌ getProfile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ FIXED: Update profile - now updates Profile model correctly
export const updateProfile = async (req, res) => {
  try {
    const { phone, subjectsInput, classLevel } = req.body;

    console.log("📥 Received update data:", {
      phone,
      subjectsInput,
      classLevel,
      hasFile: !!req.file,
      userId: req.user._id,
      userType: req.user.role || req.user.userType,
    });

    // Find the profile document
    const profile = await Profile.findOne({ userId: req.user._id });

    if (!profile) {
      console.log("❌ Profile not found for userId:", req.user._id);
      return res.status(404).json({ message: "Profile not found" });
    }

    console.log("📋 Current profile before update:", {
      phoneNumber: profile.phoneNumber,
      profileImage: profile.profileImage,
      subjects: profile.subjects,
      classLevel: profile.classLevel,
      userType: profile.userType,
    });

    // Update phone number if provided
    if (phone !== undefined && phone !== null) {
      profile.phoneNumber = phone;
      console.log("📱 Updated phone to:", phone);
    }

    // Update class level if provided (for students/parents)
    if (classLevel !== undefined && classLevel !== null) {
      profile.classLevel = classLevel;
      console.log("🎓 Updated class level to:", classLevel);
    }

    // Update profile image if uploaded
    if (req.file) {
      profile.profileImage = `uploads/${req.file.filename}`;
      console.log("🖼️ Updated image path to:", profile.profileImage);
    }

    // Update subjects if provided (for teachers only)
    if (subjectsInput !== undefined && profile.userType === "teacher") {
      const subjects = subjectsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      console.log("📚 Updating subjects to:", subjects);
      profile.subjects = subjects;
    }

    // Save the updated profile
    await profile.save();

    console.log("✅ Profile saved successfully:", {
      phoneNumber: profile.phoneNumber,
      profileImage: profile.profileImage,
      subjects: profile.subjects,
      classLevel: profile.classLevel,
    });

    // Return the appropriate response based on userType
    const responseData = {
      message: "Profile updated successfully",
    };

    if (profile.userType === "teacher") {
      responseData.teacher = profile;
    } else if (profile.userType === "parent") {
      responseData.parent = profile;
    } else {
      responseData.student = profile;
    }

    console.log("📤 Sending response:", responseData);

    res.status(200).json(responseData);
  } catch (err) {
    console.error("❌ Update profile error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const addChild = async (req, res) => {
  try {
    const { firstName, lastName, classLevel, dateOfBirth, gender } = req.body;

    const profile = await Profile.findOne({ userId: req.user._id });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    if (profile.userType !== "parent") {
      return res.status(403).json({ message: "Only parents can add children" });
    }

    const child = {
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      classLevel,
      dateOfBirth,
      gender,
    };

    profile.children.push(child);
    await profile.save();

    res.json({ message: "Child added successfully", parent: profile });
  } catch (err) {
    console.error("❌ addChild error:", err);
    res.status(500).json({ message: "Failed to add child" });
  }
};

export const updateChild = async (req, res) => {
  try {
    const { childId } = req.params;
    const { firstName, lastName, classLevel, dateOfBirth, gender } = req.body;

    const profile = await Profile.findOne({ userId: req.user._id });
    if (!profile || profile.userType !== "parent") {
      return res.status(404).json({ message: "Parent profile not found" });
    }

    const child = profile.children.id(childId);
    if (!child) return res.status(404).json({ message: "Child not found" });

    if (firstName) child.firstName = firstName;
    if (lastName) child.lastName = lastName;
    if (firstName || lastName)
      child.name = `${child.firstName} ${child.lastName}`;
    if (classLevel) child.classLevel = classLevel;
    if (dateOfBirth) child.dateOfBirth = dateOfBirth;
    if (gender) child.gender = gender;

    await profile.save();
    res.json({ message: "Child updated successfully", parent: profile });
  } catch (err) {
    console.error("❌ updateChild error:", err);
    res.status(500).json({ message: "Failed to update child" });
  }
};

export const removeChild = async (req, res) => {
  try {
    const { childId } = req.params;

    const profile = await Profile.findOne({ userId: req.user._id });
    if (!profile || profile.userType !== "parent") {
      return res.status(404).json({ message: "Parent profile not found" });
    }

    profile.children.pull(childId);
    await profile.save();

    res.json({ message: "Child removed successfully", parent: profile });
  } catch (err) {
    console.error("❌ removeChild error:", err);
    res.status(500).json({ message: "Failed to remove child" });
  }
};

// ✅ Assign subject to teacher (Admin function)
export const assignSubject = async (req, res) => {
  try {
    const { teacherId, subjectId } = req.body;
    if (!teacherId || !subjectId) {
      return res
        .status(400)
        .json({ message: "teacherId and subjectId are required" });
    }

    const profile = await Profile.findById(teacherId);
    if (!profile || profile.userType !== "teacher") {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const subject = await Subject.findById(subjectId);
    if (!subject) return res.status(404).json({ message: "Subject not found" });

    if (!profile.subjects.includes(subjectId)) {
      profile.subjects.push(subjectId);
      await profile.save();
    }

    const updatedProfile = await profile.populate("subjects");
    res.json({
      message: "Subject assigned successfully",
      teacher: updatedProfile,
    });
  } catch (err) {
    console.error("❌ assignSubject error:", err);
    res.status(500).json({ message: "Failed to assign subject" });
  }
};

// ✅ Remove subject from teacher
export const removeSubject = async (req, res) => {
  try {
    const { teacherId, subjectId } = req.body;

    const profile = await Profile.findById(teacherId);
    if (!profile || profile.userType !== "teacher") {
      return res.status(404).json({ message: "Teacher not found" });
    }

    profile.subjects = profile.subjects.filter(
      (id) => id.toString() !== subjectId
    );
    await profile.save();

    const updatedProfile = await profile.populate("subjects");
    res.json({
      message: "Subject removed successfully",
      teacher: updatedProfile,
    });
  } catch (err) {
    console.error("❌ removeSubject error:", err);
    res.status(500).json({ message: "Failed to remove subject" });
  }
};

// ✅ Get all available subjects
export const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json({ subjects });
  } catch (err) {
    console.error("❌ getAllSubjects error:", err);
    res.status(500).json({ message: "Failed to fetch subjects" });
  }
};

// ✅ Get all teachers (for admin)
export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Profile.find({
      userType: "teacher",
      isActive: true,
    }).populate("subjects");

    res.json({ teachers });
  } catch (err) {
    console.error("❌ getAllTeachers error:", err);
    res.status(500).json({ message: "Failed to fetch teachers" });
  }
};

// ✅ Get all parents (for admin)
export const getAllParents = async (req, res) => {
  try {
    const parents = await Profile.find({
      userType: "parent",
      isActive: true,
    });

    res.json({ parents });
  } catch (err) {
    console.error("❌ getAllParents error:", err);
    res.status(500).json({ message: "Failed to fetch parents" });
  }
};
