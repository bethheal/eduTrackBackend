import Teacher from "../models/Teacher.js";

// 🟢 Get teacher profile
export const getTeacherProfile = async (req, res, next) => {
  try {
    const teacher = await Teacher.findById(req.user.id).select("-password");
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.status(200).json({ success: true, teacher });
  } catch (error) {
    next(error);
  }
};

// 🟡 Update teacher profile
export const updateTeacherProfile = async (req, res, next) => {
  try {
    const { phone, subjects, profileImage } = req.body;

    const updatedTeacher = await Teacher.findByIdAndUpdate(
      req.user.id,
      { phone, subjects, profileImage },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      teacher: updatedTeacher,
    });
  } catch (error) {
    next(error);
  }
};
