import express from "express";
import { 
  getAllUsers, 
  toggleBanUser, 
  getAllReports, 
  updateReportStatus 
} from "../controllers/admin.controller.js";
import { protect, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Apply the double-lock security to ALL routes in this file
router.use(protect, isAdmin);

// User Routes
router.get("/users", getAllUsers);
router.post("/users/:id/ban", toggleBanUser);

// Report Routes
router.get("/reports", getAllReports);
router.put("/reports/:id/status", updateReportStatus);

export default router;