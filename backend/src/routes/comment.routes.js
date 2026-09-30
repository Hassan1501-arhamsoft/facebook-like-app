import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { addComment, getPostComments } from "../controllers/comment.controller.js";

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Post comment management
 */

/**
 * @swagger
 * /api/comments/{postId}:
 *   post:
 *     summary: Add a comment to a post
 *     description: Creates a new comment on a specific post. Requires a valid JWT token.
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the post to comment on
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 example: "This is a great post!"
 *     responses:
 *       201:
 *         description: Comment added successfully
 *       401:
 *         description: Not authorized, token missing or invalid
 *       403:
 *         description: You cannot interact with this user's content (blocked)
 *       404:
 *         description: Post not found
 */
router.post("/:postId", protect, addComment);
/**
 * @swagger
 * /api/comments/{postId}:
 *   get:
 *     summary: Get all comments for a post
 *     description: Retrieves all comments associated with a specific post ID.
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the post to retrieve comments for
 *     responses:
 *       200:
 *         description: A list of comments for the specified post
 *       401:
 *         description: Not authorized, token missing or invalid
 */
router.get("/:postId", protect, getPostComments);

export default router;