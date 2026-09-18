import { toggleLikeService } from "../services/like.service.js";
import { createTargetedNotification } from "../services/notification.service.js"; 
import Post from "../models/post.model.js"; 
import { getIO } from "../socket/socket.js";

export const toggleLike = async (req, res, next) => {
  try {
    const { postId } = req.params;
    
    
    const result = await toggleLikeService(req.user.id, postId, req.user.excludedIds);

    getIO().emit("post_like_updated", { postId: parseInt(postId), likesCount: result.likesCount });

    if (result.liked) {
      const post = await Post.findByPk(postId);
      if (post) {
        await createTargetedNotification(post.user_id, req.user.id, postId, "like");
      }
    }

    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};