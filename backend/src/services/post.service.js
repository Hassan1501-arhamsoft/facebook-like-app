import fs from "fs";
import path from "path";
import { Op } from "sequelize";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import PostLike from "../models/postLike.model.js";
import Notification from "../models/notification.model.js";

// Get Logged-in User Profile
export const getUserProfile = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password'] }
  });
  if (!user) throw new Error("User not found.");
  return user;
};

// Upload / Update Profile Image
export const updateProfileImage = async (userId, file) => {
  if (!file) throw new Error("Please upload an image.");
  
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found.");

  if (user.profileImage) {
    const oldImagePath = path.resolve(user.profileImage);
    if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
  }

  user.profileImage = file.path.replace(/\\/g, "/");
  await user.save();

  const userData = user.toJSON();
  delete userData.password;
  return userData;
};

// Create Post
export const createPostService = async (userId, file, description) => {
  if (!file) throw new Error("An image is required to create a post.");
  
  const imageUrl = file.path.replace(/\\/g, "/");
  const post = await Post.create({
    user_id: userId,
    description: description || null,
    image_url: imageUrl,
  });

  return await Post.findByPk(post.id, {
    include: [{ model: User, as: "author", attributes: ["id", "name", "profileImage"] }],
  });
};

// Get My Posts (WITH PAGINATION)
export const getMyPostsService = async (userId, page = 1, limit = 5) => {
  const offset = (page - 1) * limit;

  const { count, rows: posts } = await Post.findAndCountAll({
    where: { user_id: userId },
    include: [{ model: PostLike, as: "likes", attributes: ["user_id"] }],
    order: [["created_at", "DESC"]],
    limit: parseInt(limit),
    offset: parseInt(offset),
    distinct: true,
  });

  const formattedPosts = posts.map(post => {
    const postJSON = post.toJSON();
    const likesCount = postJSON.likes ? postJSON.likes.length : 0;
    // const isLiked = postJSON.likes ? postJSON.likes.some(like => like.user_id === userId) : false;
    delete postJSON.likes; 
    return { ...postJSON, likesCount };
  });

  return { posts: formattedPosts, totalPages: Math.ceil(count / limit), currentPage: parseInt(page) };
};

// Get Global Feed (WITH PAGINATION)
export const getGlobalFeedService = async (userId, page = 1, limit = 5) => {
  const offset = (page - 1) * limit;

  const { count, rows: posts } = await Post.findAndCountAll({
    where: { user_id: { [Op.ne]: userId } },
    include: [
      { model: User, as: "author", attributes: ["id", "name", "profileImage"] },
      { model: PostLike, as: "likes", attributes: ["user_id"] }
    ],
    order: [["created_at", "DESC"]],
    limit: parseInt(limit),
    offset: parseInt(offset),
    distinct: true,
  });

  const formattedPosts = posts.map(post => {
    const postJSON = post.toJSON();
    const likesCount = postJSON.likes ? postJSON.likes.length : 0;
    const isLiked = postJSON.likes ? postJSON.likes.some(like => like.user_id === userId) : false;
    delete postJSON.likes;
    return { ...postJSON, likesCount, isLiked };
  });

  return { posts: formattedPosts, totalPages: Math.ceil(count / limit), currentPage: parseInt(page) };
};

// Delete Post
export const deletePostService = async (userId, postId) => {
  const post = await Post.findByPk(postId);
  if (!post) throw new Error("Post not found.");
  if (post.user_id !== userId) throw new Error("You are not authorized to delete this post.");

  const imagePath = post.image_url ? path.resolve(post.image_url) : null;
  await Notification.destroy({ where: { post_id: postId } }); // Handle constraints
  await post.destroy();

  if (imagePath && fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
  }
};