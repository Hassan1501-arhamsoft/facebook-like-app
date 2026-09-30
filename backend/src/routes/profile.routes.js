import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import { getProfile, uploadProfileImage } from "../controllers/profile.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: User profile management and avatar uploads
 */

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get logged-in user's profile
 *     description: Retrieves the full profile details of the currently authenticated user.
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *       401:
 *         description: Not authorized, token missing or invalid
 *       404:
 *         description: User profile not found
 */
router.get("/", protect, getProfile);

/**
 * @swagger
 * /api/profile/upload:
 *   put:
 *     summary: Upload or update profile picture
 *     description: Uploads a new avatar image and updates the user's profile to reference it. Requires a valid JWT token.
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profileImage:
 *                 type: string
 *                 format: binary
 *                 description: The image file to upload as the new profile picture
 *     responses:
 *       200:
 *         description: Profile picture updated successfully
 *       400:
 *         description: Bad request (e.g., no file uploaded or invalid format)
 *       401:
 *         description: Not authorized
 */
router.put(
  "/upload",
  protect,
  upload.single("profileImage"),
  uploadProfileImage
);

export default router;