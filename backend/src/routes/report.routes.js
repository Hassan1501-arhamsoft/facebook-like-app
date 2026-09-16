import express from "express";
import { submitReport } from "../controllers/report.controller.js";
import { protect } from "../middlewares/auth.middleware.js"; // Adjust path if necessary

const router = express.Router();

router.post("/", protect, submitReport);

export default router;