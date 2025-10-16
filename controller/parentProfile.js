import Parent from "../models/Parent.js";

// 🟢 Get parent profile
export const getParentProfile = async (req, res, next) => {
  try {
    const parent = await Parent.findById(req.user.id).select("-password");
    if (!parent) {
      return res.status(404).json({ message: "Parent not found" });
    }
    res.status(200).json({ success: true, parent });
  } catch (error) {
    next(error);
  }
};

// 🟡 Update parent profile
export const updateParentProfile = async (req, res, next) => {
  try {
    const { phone, children, profileImage } = req.body;

    const updatedParent = await Parent.findByIdAndUpdate(
      req.user.id,
      { phone, children, profileImage },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedParent) {
      return res.status(404).json({ message: "Parent not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      parent: updatedParent,
    });
  } catch (error) {
    next(error);
  }
};
