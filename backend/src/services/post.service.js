import fs from "fs";
import path from "path";
import { Op } from "sequelize";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import PostLike from "../models/postLike.model.js";
import Notification from "../models/notification.model.js";
import Follow from "../models/follow.model.js"
import SavedPost from "../models/savedPost.model.js";

//* Create Post
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

//* Get My Posts (WITH PAGINATION)
export const getMyPostsService = async (userId, page = 1, limit = 5, excludedIds = []) => {
  const offset = (page - 1) * limit;

  const { count, rows: posts } = await Post.findAndCountAll({
    where: { user_id: userId },
    include: [
      { 
        model: PostLike, 
        as: "likes", 
        attributes: ["user_id"],
        required: false,
        where: excludedIds.length > 0 ? { user_id: { [Op.notIn]: excludedIds } } : {}
      }
    ],
    order: [["created_at", "DESC"]],
    limit: parseInt(limit),
    offset: parseInt(offset),
    distinct: true,
  });

  const formattedPosts = posts.map(post => {
    const postJSON = post.toJSON();
    const likesCount = postJSON.likes ? postJSON.likes.length : 0;
    delete postJSON.likes; 
    return { ...postJSON, likesCount };
  });

  return { posts: formattedPosts, totalPages: Math.ceil(count / limit), currentPage: parseInt(page) };
};

//* Get Global Feed (WITH PAGINATION)
export const getGlobalFeedService = async (userId, page = 1, limit = 5, excludedIds = []) => {
  const offset = (page - 1) * limit;

  const whereCondition = {
    user_id: excludedIds.length > 0 
      ? { [Op.ne]: userId, [Op.notIn]: excludedIds } 
      : { [Op.ne]: userId }
  };

  const { count, rows: posts } = await Post.findAndCountAll({
    where: whereCondition, 
    include: [
      { model: User, as: "author", attributes: ["id", "name", "profileImage"] },
      { 
        model: PostLike, 
        as: "likes", 
        attributes: ["user_id"],
        required: false,
        where: excludedIds.length > 0 ? { user_id: { [Op.notIn]: excludedIds } } : {}
      },
      { model: SavedPost, as: "SavedPosts", attributes: ["user_id"], where: { user_id: userId }, required: false }
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
    const isSaved = postJSON.SavedPosts ? postJSON.SavedPosts.length > 0 : false;
    delete postJSON.likes;
    return { ...postJSON, likesCount, isLiked, isSaved };
  });

  return { posts: formattedPosts, totalPages: Math.ceil(count / limit), currentPage: parseInt(page) };
};

//* Delete Post
export const deletePostService = async (userId, postId) => {
  const post = await Post.findByPk(postId);
  if (!post) throw new Error("Post not found.");
  if (post.user_id !== userId) throw new Error("You are not authorized to delete this post.");

  const imagePath = post.image_url ? path.resolve(post.image_url) : null;
  await Notification.destroy({ where: { post_id: postId } }); 
  await post.destroy();

  if (imagePath && fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
  }
};

//* Get Friends Feed (WITH PAGINATION) 
export const getFriendsFeedService = async (userId, page = 1, limit = 5, excludedIds = []) => {
  const offset = (page - 1) * limit;

  const connections = await Follow.findAll({
    where: {
      status: "accepted",
      [Op.or]: [{ follower_id: userId }, { following_id: userId }]
    }
  });

  const friendIds = connections.map(conn => 
    conn.follower_id === userId ? conn.following_id : conn.follower_id
  );

  const validFriendIds = friendIds.filter(id => !excludedIds.includes(id));

  const { count, rows: posts } = await Post.findAndCountAll({
    where: { user_id: { [Op.in]: validFriendIds } }, 
    include: [
      { model: User, as: "author", attributes: ["id", "name", "profileImage"] },
      { 
        model: PostLike, 
        as: "likes", 
        attributes: ["user_id"],
        required: false,
        where: excludedIds.length > 0 ? { user_id: { [Op.notIn]: excludedIds } } : {}
      },
      { model: SavedPost, as: "SavedPosts", attributes: ["user_id"], where: { user_id: userId }, required: false }
    ],
    order: [["created_at", "DESC"]],
    limit: parseInt(limit),
    offset: parseInt(offset),
    distinct: true,
  });

  const formattedPosts = posts.map(post => {
    const postJSON = post.toJSON();
    const likesArray = postJSON.likes || postJSON.PostLikes || []; 
    const likesCount = likesArray.length;
    const isLiked = likesArray.some(like => like.user_id === userId);
    const isSaved = postJSON.SavedPosts ? postJSON.SavedPosts.length > 0 : false;
    delete postJSON.likes; 
    delete postJSON.PostLikes;
    return { ...postJSON, likesCount, isLiked, isSaved };
  });

  return { posts: formattedPosts, totalPages: Math.ceil(count / limit), currentPage: parseInt(page) };
};

//* Toggle Save Post
export const toggleSavePostService = async (userId, postId) => {

  const cleanUserId = parseInt(userId, 10);
  const cleanPostId = parseInt(postId, 10);

  const existingSave = await SavedPost.findOne({
    where: { user_id: cleanUserId, post_id: cleanPostId },
  });

  if (existingSave) {
    await existingSave.destroy();
    return { saved: false };
  } 
  else {
    await SavedPost.create({ user_id: cleanUserId, post_id: cleanPostId });
    return { saved: true };
  }
};

//* Get Saved Posts (WITH PAGINATION)
// CHANGED: Added excludedIds parameter
export const getSavedPostsService = async (userId, page = 1, limit = 5, excludedIds = []) => {
  const offset = (page - 1) * limit;

  const { count, rows: savedRecords } = await SavedPost.findAndCountAll({
    where: { user_id: userId },
    include: [
      {
        model: Post,
        as: "post",
        include: [
          { model: User, as: "author", attributes: ["id", "name", "profileImage"] },
          { 
            model: PostLike, 
            as: "likes", 
            attributes: ["user_id"],
            required: false,
            where: excludedIds.length > 0 ? { user_id: { [Op.notIn]: excludedIds } } : {}
          }
        ]
      }
    ],
    order: [["createdAt", "DESC"]],
    limit: parseInt(limit),
    offset: parseInt(offset),
  });

  const formattedPosts = savedRecords.map(record => {
    const postJSON = record.post.toJSON();
    const likesCount = postJSON.likes ? postJSON.likes.length : 0;
    const isLiked = postJSON.likes ? postJSON.likes.some(like => like.user_id === userId) : false;
    delete postJSON.likes;
    return { ...postJSON, likesCount, isLiked, isSaved: true };
  });

  return { posts: formattedPosts, totalPages: Math.ceil(count / limit), currentPage: parseInt(page) };
};