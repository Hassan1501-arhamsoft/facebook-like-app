import Comment from "../models/comment.model.js";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";

export const addCommentService = async (userId, postId, text) => {
  const post = await Post.findByPk(postId);
  if (!post) throw new Error("Post not found.");

  const comment = await Comment.create({
    user_id: userId,
    post_id: postId,
    text,
  });

  // Fetch the newly created comment with the author's details so the frontend can display it immediately
  return await Comment.findByPk(comment.id, {
    include: [{ model: User, as: "author", attributes: ["id", "name", "profileImage"] }],
  });
};

export const getPostCommentsService = async (postId) => {
  return await Comment.findAll({
    where: { post_id: postId },
    include: [{ model: User, as: "author", attributes: ["id", "name", "profileImage"] }],
    order: [["created_at", "ASC"]], // Oldest comments first (standard feed behavior)
  });
};