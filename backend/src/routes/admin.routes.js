import express from "express";
import { 
  getAllUsers, 
  toggleBanUser, 
  getAllReports, 
  updateReportStatus 
} from "../controllers/admin.controller.js";
import { protect, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Administrative dashboard commands and moderation
 */
// Apply the double-lock security to ALL routes in this file
router.use(protect, isAdmin);
/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Retrieve all users
 *     description: Fetches a list of all users for the admin dashboard. Requires admin privileges.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *       401:
 *         description: Not authorized, token missing or invalid
 *       403:
 *         description: Access Denied (Not an admin)
 */
// User Routes
router.get("/users", getAllUsers);
/**
 * @swagger
 * /api/admin/users/{id}/ban:
 *   post:
 *     summary: Toggle a user's ban status
 *     description: Bans or unbans a user based on their current status. Requires admin privileges.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user to ban/unban
 *     responses:
 *       200:
 *         description: Ban status updated successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Access Denied (Not an admin)
 *       404:
 *         description: User not found
 */

router.post("/users/:id/ban", toggleBanUser);
/**
 * @swagger
 * /api/admin/reports:
 *   get:
 *     summary: Retrieve all community reports
 *     description: Fetches a list of all user-submitted reports for admin review. Requires admin privileges.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of reports
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Access Denied (Not an admin)
 */
// Report Routes
router.get("/reports", getAllReports);
/**
 * @swagger
 * /api/admin/reports/{id}/status:
 *   put:
 *     summary: Update the status of a report
 *     description: Changes the resolution status (e.g., pending, resolved, dismissed) of a specific report. Requires admin privileges.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the report to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: resolved
 *     responses:
 *       200:
 *         description: Report status updated successfully
 *       400:
 *         description: Invalid status provided
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Access Denied (Not an admin)
 *       404:
 *         description: Report not found
 */
router.put("/reports/:id/status", updateReportStatus);

export default router;