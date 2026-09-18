import { addCommentService, getPostCommentsService } from "../services/comment.service.js";
import { getIO } from "../socket/socket.js";
import Post from "../models/post.model.js";
import { createTargetedNotification } from "../services/notification.service.js";

export const addComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    
    // CHANGED: Pass req.user.excludedIds to the add comment service
    const comment = await addCommentService(req.user.id, postId, text, req.user.excludedIds);
    getIO().emit("new_comment", comment);

    const post = await Post.findByPk(postId);
    if (post) {
      await createTargetedNotification(post.user_id, req.user.id, postId, "comment");
    }

    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    next(error);
  }
};

export const getPostComments = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const comments = await getPostCommentsService(postId, req.user.excludedIds);
    res.status(200).json({ success: true, data: comments });
  } catch (error) {
    next(error);
  }
};