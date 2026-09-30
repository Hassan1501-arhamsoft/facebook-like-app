import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import { 
  createPost, 
  getMyPosts, 
  deletePost, 
  getGlobalFeed, 
  getFriendsFeed,
  toggleSavePost, 
  getSavedPosts
} from "../controllers/post.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Post creation, feeds, and bookmarking management
 */

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new post
 *     description: Creates a new post with an optional image upload. Requires a valid JWT token.
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 description: The text content of the post
 *               postImage:
 *                 type: string
 *                 format: binary
 *                 description: An optional image file to upload with the post
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Bad request (e.g., missing required fields)
 *       401:
 *         description: Not authorized
 */
router.post("/", protect, upload.single("postImage"), createPost);

/**
 * @swagger
 * /api/posts/my-posts:
 *   get:
 *     summary: Get the authenticated user's posts
 *     description: Retrieves all posts created by the currently logged-in user.
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of the user's posts
 *       401:
 *         description: Not authorized
 */
router.get("/my-posts", protect, getMyPosts);

/**
 * @swagger
 * /api/posts/saved:
 *   get:
 *     summary: Get saved posts
 *     description: Retrieves a list of all posts bookmarked/saved by the authenticated user.
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of saved posts
 *       401:
 *         description: Not authorized
 */
router.get("/saved", protect, getSavedPosts);

/**
 * @swagger
 * /api/posts/{id}/save:
 *   post:
 *     summary: Toggle save post status
 *     description: Bookmarks or un-bookmarks a specific post for the logged-in user.
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the post to save or unsave
 *     responses:
 *       200:
 *         description: Post save status toggled successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Post not found
 */
router.post("/:id/save", protect, toggleSavePost);

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Delete a post
 *     description: Removes a specific post. Users can only delete their own posts, or admins can delete any post.
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the post to delete
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden (Not the author of the post)
 *       404:
 *         description: Post not found
 */
router.delete("/:id", protect, deletePost);

/**
 * @swagger
 * /api/posts/feed:
 *   get:
 *     summary: Get the global feed
 *     description: Retrieves the public feed of posts. Supports infinite scrolling pagination via query parameters.
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number to retrieve
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of posts per page
 *     responses:
 *       200:
 *         description: A paginated list of global posts
 *       401:
 *         description: Not authorized
 */
router.get("/feed", protect, getGlobalFeed);

/**
 * @swagger
 * /api/posts/friends-feed:
 *   get:
 *     summary: Get the friends feed
 *     description: Retrieves posts specifically from users that the authenticated user is friends with.
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number to retrieve
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of posts per page
 *     responses:
 *       200:
 *         description: A paginated list of friends' posts
 *       401:
 *         description: Not authorized
 */
router.get("/friends-feed", protect, getFriendsFeed);

export default router;