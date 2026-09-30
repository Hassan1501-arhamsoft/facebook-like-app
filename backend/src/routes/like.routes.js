import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { toggleLike } from "../controllers/like.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Likes
 *   description: Post interaction management
 */

/**
 * @swagger
 * /api/likes/{postId}/toggle:
 *   post:
 *     summary: Toggle a like on a post
 *     description: Likes or unlikes a specific post for the authenticated user.
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the post to like or unlike
 *     responses:
 *       200:
 *         description: Post liked or unliked successfully
 *       401:
 *         description: Not authorized, token missing or invalid
 *       403:
 *         description: You cannot interact with this user's content (blocked)
 *       404:
 *         description: Post not found
 */
router.post("/:postId/toggle", protect, toggleLike);

export default router;