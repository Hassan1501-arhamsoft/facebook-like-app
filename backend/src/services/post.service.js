import fs from "fs";
import path from "path";
import { Op } from "sequelize";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import PostLike from "../models/postLike.model.js";
import Notification from "../models/notification.model.js";
export const createPostService = async (userId, file, description) => {
  if (!file) {
    throw new Error("An image is required to create a post.");
  }

  const imageUrl = file.path.replace(/\\/g, "/");

  const post = await Post.create({
    user_id: userId,
    description: description || null,
    image_url: imageUrl,
  });

  const populatedPost = await Post.findByPk(post.id, {
    include: [
      {
        model: User,
        as: "author",
        attributes: ["id", "name", "profileImage"],
      },
    ],
  });

  return populatedPost;
};

export const getMyPostsService = async (userId) => {
  const posts = await Post.findAll({
    where: { user_id: userId },
    include: [{ model: PostLike, as: "likes", attributes: ["user_id"] }],
    order: [["created_at", "DESC"]],
  });

  return posts.map(post => {
    const postJSON = post.toJSON();
    const likesCount = postJSON.likes ? postJSON.likes.length : 0;
    const isLiked = postJSON.likes ? postJSON.likes.some(like => like.user_id === userId) : false;
    delete postJSON.likes; 
    return { ...postJSON, likesCount, isLiked };
  });
};

export const deletePostService = async (userId, postId) => {
  const post = await Post.findByPk(postId);

  if (!post) {
    throw new Error("Post not found.");
  }

  if (post.user_id !== userId) {
    throw new Error("You are not authorized to delete this post.");
  }

  // 1. Temporarily store the image path
  const imagePath = post.image_url ? path.resolve(post.image_url) : null;

  // 2. Manual fallback: Delete associated notifications first
  await Notification.destroy({ where: { post_id: postId } });

  // 3. Delete the post from the database
  await post.destroy();

  // 4. ONLY delete the physical file if the database deletion was successful
  if (imagePath && fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
  }
};

export const getGlobalFeedService = async (userId) => {
  const posts = await Post.findAll({
    where: {
      user_id: {
        [Op.ne]: userId,
      },
    },
    include: [
      {
        model: User,
        as: "author",
        attributes: ["id", "name", "profileImage"],
      },
      {
        model: PostLike,
        as: "likes",
        attributes: ["user_id"], // Only fetch user_id to calculate the toggle status
      }
    ],
    order: [["created_at", "DESC"]],
  });

  // Map over the results to format the like data for the frontend
  return posts.map(post => {
    const postJSON = post.toJSON();
    const likesCount = postJSON.likes ? postJSON.likes.length : 0;
    const isLiked = postJSON.likes ? postJSON.likes.some(like => like.user_id === userId) : false;
    
    delete postJSON.likes; // Clean up the raw array to save bandwidth

    return {
      ...postJSON,
      likesCount,
      isLiked
    };
  });
};