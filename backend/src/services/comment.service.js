import Comment from "../models/comment.model.js";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import { Op } from "sequelize";

// CHANGED: Added excludedIds parameter
export const addCommentService = async (userId, postId, text, excludedIds = []) => {
  const post = await Post.findByPk(postId);
  if (!post) throw new Error("Post not found.");

  // NEW: Reject interaction if the post author is blocked
  if (excludedIds.includes(post.user_id)) {
    throw new Error("You cannot interact with this user's content.");
  }

  const comment = await Comment.create({
    user_id: userId,
    post_id: postId,
    text,
  });

  return await Comment.findByPk(comment.id, {
    include: [{ model: User, as: "author", attributes: ["id", "name", "profileImage"] }],
  });
};

export const getPostCommentsService = async (postId, excludedIds = []) => {
  
  // NEW: Dynamically build the where clause to hide comments from blocked users
  const whereCondition = { post_id: postId };
  if (excludedIds.length > 0) {
    whereCondition.user_id = { [Op.notIn]: excludedIds };
  }

  return await Comment.findAll({
    where: whereCondition, // APPLIED dynamically
    include: [{ model: User, as: "author", attributes: ["id", "name", "profileImage"] }],
    order: [["created_at", "ASC"]], 
  });
};