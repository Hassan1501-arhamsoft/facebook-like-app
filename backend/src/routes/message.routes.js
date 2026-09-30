import express from "express";
import { getChatHistory, toggleBlockUser, checkBlockStatus } from "../controllers/message.controller.js";
import { protect } from "../middlewares/auth.middleware.js"; 

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Direct messaging and chat controls
 */

/**
 * @swagger
 * /api/messages/{friendId}:
 *   get:
 *     summary: Get chat history
 *     description: Retrieves the direct message history between the authenticated user and a specific friend.
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: friendId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the friend to fetch messages for
 *     responses:
 *       200:
 *         description: A list of message objects
 *       401:
 *         description: Not authorized
 */
router.get("/:friendId", protect, getChatHistory);

/**
 * @swagger
 * /api/messages/block/{friendId}:
 *   post:
 *     summary: Toggle block status
 *     description: Blocks or unblocks a specific user, preventing them from sending messages or interacting with the authenticated user.
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: friendId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user to block or unblock
 *     responses:
 *       200:
 *         description: User blocked or unblocked successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: User not found
 */
router.post("/block/:friendId", protect, toggleBlockUser);

/**
 * @swagger
 * /api/messages/block-status/{friendId}:
 *   get:
 *     summary: Check block status
 *     description: Checks if there is an active block between the authenticated user and the specified friend.
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: friendId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user to check the block status against
 *     responses:
 *       200:
 *         description: Returns the current block status
 *       401:
 *         description: Not authorized
 */
router.get("/block-status/:friendId", protect, checkBlockStatus);

export default router;