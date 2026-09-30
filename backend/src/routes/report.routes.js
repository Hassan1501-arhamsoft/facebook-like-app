import express from "express";
import { submitReport } from "../controllers/report.controller.js";
import { protect } from "../middlewares/auth.middleware.js"; 

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Community reporting system
 */

/**
 * @swagger
 * /api/reports:
 *   post:
 *     summary: Submit a new report
 *     description: Submits a report against a user, post, or message for administrator review. Requires a valid JWT token.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reportedId:
 *                 type: integer
 *                 description: The ID of the user, post, or item being reported
 *                 example: 15
 *               type:
 *                 type: string
 *                 description: The type of entity being reported (e.g., user, post, message)
 *                 example: user
 *               reason:
 *                 type: string
 *                 description: The detailed reason for the report
 *                 example: "Harassment and offensive language"
 *     responses:
 *       201:
 *         description: Report submitted successfully
 *       400:
 *         description: Bad request (e.g., missing required fields)
 *       401:
 *         description: Not authorized
 */
router.post("/", protect, submitReport);

export default router;