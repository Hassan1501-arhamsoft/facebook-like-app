import PostLike from "../models/postLike.model.js";
import Post from "../models/post.model.js";

export const toggleLikeService = async (userId, postId) => {
  const post = await Post.findByPk(postId);
  if (!post) throw new Error("Post not found.");

  const existingLike = await PostLike.findOne({
    where: { user_id: userId, post_id: postId },
  });

  let liked = false;

  if (existingLike) {
    await existingLike.destroy();
  } else {
    await PostLike.create({ user_id: userId, post_id: postId });
    liked = true;
  }

  // Count the exact number of likes after the toggle
  const likesCount = await PostLike.count({
    where: { post_id: postId },
  });

  return { liked, likesCount, message: liked ? "Post liked." : "Post unliked." };
};