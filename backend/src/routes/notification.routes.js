import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { getUserNotificationsService } from "../services/notification.service.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: User notification management
 */

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get user notifications
 *     description: Retrieves a list of recent notifications for the authenticated user (e.g., likes, comments, system alerts).
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of notifications retrieved successfully
 *       401:
 *         description: Not authorized, token missing or invalid
 */
router.get("/", protect, async (req, res, next) => {
  try {
    const notifications = await getUserNotificationsService(req.user.id);
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    next(error);
  }
});

export default router;