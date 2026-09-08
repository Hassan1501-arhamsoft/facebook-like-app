import { createPostService, getMyPostsService, deletePostService, getGlobalFeedService } from "../services/post.service.js";
import { successResponse, errorResponse } from "../utils/response.js"; 
import { getIO } from "../socket/socket.js";
export const createPost = async (req, res, next) => {
  try {
    const { description } = req.body;
    const post = await createPostService(req.user.id, req.file, description);

    // Format the post object with default interaction counts for the frontend
    const postData = {
      ...post.toJSON(),
      likesCount: 0,
      isLiked: false
    };

    // Broadcast the new post to everyone online
    getIO().emit("new_post", postData);

    res.status(201).json({
      success: true,
      message: "Post created successfully.",
      data: postData,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyPosts = async (req, res, next) => {
  try {
    const posts = await getMyPostsService(req.user.id);

    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

// ... existing createPost and getMyPosts controllers ...

export const deletePost = async (req, res, next) => {
    console.log(req.user.id, req.params.id);
    
  try {
    const postId = req.params.id;
    await deletePostService(req.user.id, postId);

    // Broadcast the deletion to all online users
    getIO().emit("post_deleted", parseInt(postId));

    res.status(200).json({
      success: true,
      message: "Post deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};



// ... existing controllers ...

export const getGlobalFeed = async (req, res, next) => {
  try {
    const posts = await getGlobalFeedService(req.user.id);

    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};