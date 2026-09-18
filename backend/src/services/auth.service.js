import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";
// NEW: Imported Block model and Op for database querying
import Block from "../models/block.model.js";
import { Op } from "sequelize";

export const registerUserService = async (userData) => {
  const { name, email, password, profileImage } = userData;

  const existingUser = await User.findOne({ where: { email } });

  if (existingUser) {
    throw new Error("Email already exists.");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    profileImage,
  });

  const token = generateToken({
    userId:  user.id,
    excludedIds: [] // NEW: Default to empty array for new users
  });

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
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const isPasswordMatched = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordMatched) {
    throw new Error("Invalid email or password.");
  }

  // NEW: Fetch all block relationships for this user
  const blocks = await Block.findAll({
    where: {
      [Op.or]: [{ blocker_id: user.id }, { blocked_id: user.id }]
    }
  });

  
  const excludedIds = blocks.map(block => 
    block.blocker_id === user.id ? block.blocked_id : block.blocker_id
  );
  

  const token = generateToken({
    userId: user.id,
    excludedIds: excludedIds 
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      role: user.role,
      isBanned: user.isBanned
    },
  };
};