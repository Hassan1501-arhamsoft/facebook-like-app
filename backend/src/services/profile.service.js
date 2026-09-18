import fs from "fs";
import path from "path";
import User from "../models/user.model.js";


//* Get Logged-in User Profile
export const getUserProfile = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password'] }
  });

  if (!user) {
    throw new Error("User not found.");
  }

  return user;
};

//* Upload / Update Profile Image
export const updateProfileImage = async (userId, file) => {
  if (!file) {
    throw new Error("Please upload an image.");
  }

  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  if (user.profileImage) {
    const oldImagePath = path.resolve(user.profileImage);

    if (fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath);
    }
  }

  user.profileImage = file.path.replace(/\\/g, "/");

  await user.save();

  const userData = user.toJSON();
  delete userData.password;
 
  return userData;
};


