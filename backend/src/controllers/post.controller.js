import { createPostService, getMyPostsService, deletePostService, getGlobalFeedService } from "../services/post.service.js";
import { successResponse, errorResponse } from "../utils/response.js"; 
import { getIO } from "../socket/socket.js";

export const createPost = async (req, res, next) => {
  try {
    const { description } = req.body;
    const post = await createPostService(req.user.id, req.file, description);

    const postData = {
      ...post.toJSON(),
      likesCount: 0,
      isLiked: false
    };

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
    const { page = 1, limit = 5 } = req.query; // Added for Pagination
    const result = await getMyPostsService(req.user.id, page, limit);

    res.status(200).json({
      success: true,
      data: result.posts,
      currentPage: result.currentPage,
      totalPages: result.totalPages
    });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  console.log(req.user.id, req.params.id);
    
  try {
    const postId = req.params.id;
    await deletePostService(req.user.id, postId);

    getIO().emit("post_deleted", parseInt(postId));

    res.status(200).json({
      success: true,
      message: "Post deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const getGlobalFeed = async (req, res, next) => {
  try {
    const { page = 1, limit = 5 } = req.query; // Added for Pagination
    const result = await getGlobalFeedService(req.user.id, page, limit);

    res.status(200).json({
      success: true,
      data: result.posts,
      currentPage: result.currentPage,
      totalPages: result.totalPages
    });
  } catch (error) {
    next(error);
  }
};