import {
  getUserProfile,
  updateProfileImage,
} from "../services/profile.service.js";

// Get Logged-in User Profile
export const getProfile = async (req, res, next) => {
  try {
    const user = await getUserProfile(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Upload / Update Profile Image
export const uploadProfileImage = async (req, res, next) => {
  try {
    const user = await updateProfileImage(req.user.id, req.file);

    res.status(200).json({
      success: true,
      message: "Profile image updated successfully.",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};