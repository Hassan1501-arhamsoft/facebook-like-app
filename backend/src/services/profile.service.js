import fs from "fs";
import path from "path";
import User from "../models/user.model.js";




// Get Logged-in User Profile
export const getUserProfile = async (userId) => {
  // SEQUELIZE FIX: Use findByPk and exclude attributes
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password'] }
  });

  if (!user) {
    throw new Error("User not found.");
  }

  return user;
};

// Upload / Update Profile Image
export const updateProfileImage = async (userId, file) => {
  if (!file) {
    throw new Error("Please upload an image.");
  }

  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  // Delete old profile image (SEQUELIZE FIX: Use profile_image to match DB schema)
  if (user.profileImage) {
    const oldImagePath = path.resolve(user.profileImage);

    if (fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath);
    }
  }

  // Save new image path (SEQUELIZE FIX: Use profile_image)
  user.profileImage = file.path.replace(/\\/g, "/");

  await user.save();

  // Strip password before returning using Sequelize's toJSON()
  const userData = user.toJSON();
  delete userData.password;
 
  return userData;
};


