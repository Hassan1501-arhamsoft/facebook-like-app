import express from "express";
import { 
  getSuggestions, 
  sendRequest, 
  getPendingRequests, 
  respondToRequest,
  getFriends,
  removeFriend
} from "../controllers/follow.controller.js";
import { protect } from "../middlewares/auth.middleware.js"; 

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Network
 *   description: Friend requests, suggestions, and connection management
 */

// Apply authentication middleware to all routes in this file
router.use(protect);

/**
 * @swagger
 * /api/follows/suggestions:
 *   get:
 *     summary: Get friend suggestions
 *     description: Retrieves a list of suggested users to follow or add as friends.
 *     tags: [Network]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of suggested users
 *       401:
 *         description: Not authorized
 */
router.get("/suggestions", getSuggestions);

/**
 * @swagger
 * /api/follows/requests:
 *   get:
 *     summary: Get pending friend requests
 *     description: Retrieves a list of pending incoming friend/follow requests for the logged-in user.
 *     tags: [Network]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of pending requests
 *       401:
 *         description: Not authorized
 */
router.get("/requests", getPendingRequests);

/**
 * @swagger
 * /api/follows/{id}/request:
 *   post:
 *     summary: Send a friend request
 *     description: Sends a friend or follow request to another user.
 *     tags: [Network]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user to send a request to
 *     responses:
 *       200:
 *         description: Request sent successfully
 *       400:
 *         description: Request already sent or invalid action
 *       401:
 *         description: Not authorized
 *       404:
 *         description: User not found
 */
router.post("/:id/request", sendRequest);

/**
 * @swagger
 * /api/follows/requests/{id}/respond:
 *   put:
 *     summary: Respond to a friend request
 *     description: Accepts or rejects a pending friend request.
 *     tags: [Network]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the request to respond to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [accepted, rejected]
 *                 example: accepted
 *     responses:
 *       200:
 *         description: Request updated successfully
 *       400:
 *         description: Invalid status
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Request not found
 */
router.put("/requests/:id/respond", respondToRequest);

/**
 * @swagger
 * /api/follows/friends:
 *   get:
 *     summary: Get user's friends list
 *     description: Retrieves the list of accepted friends for the logged-in user.
 *     tags: [Network]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of friends
 *       401:
 *         description: Not authorized
 */
router.get("/friends", getFriends);

/**
 * @swagger
 * /api/follows/friends/{id}:
 *   delete:
 *     summary: Remove a friend
 *     description: Unfriends a user by removing the accepted connection.
 *     tags: [Network]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the friend to remove
 *     responses:
 *       200:
 *         description: Friend removed successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Connection not found
 */
router.delete("/friends/:id", removeFriend);

export default router;