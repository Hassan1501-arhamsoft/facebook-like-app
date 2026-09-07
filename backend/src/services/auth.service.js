import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";

export const registerUserService = async (userData) => {
  const { name, email, password, profileImage } = userData;

  // Check existing user
  const existingUser = await User.findOne({ where: { email } });

  if (existingUser) {
    throw new Error("Email already exists.");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    profileImage,
  });

  // Generate JWT
  const token = generateToken({
    userId:  user.id,
  });

  // Return response data
  return {
    token,
    user: {
      id:  user.id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
    },
  };
};

export const loginUserService = async (email, password) => {
  // Find user
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  // Compare password
  const isPasswordMatched = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordMatched) {
    throw new Error("Invalid email or password.");
  }

  // Generate JWT
  const token = generateToken({
    userId: user.id,
  });

  // Return response data
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
    },
  };
};