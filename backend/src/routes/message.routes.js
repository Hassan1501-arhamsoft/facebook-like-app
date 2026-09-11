import express from "express";
import { getChatHistory } from "../controllers/message.controller.js";
import { protect } from "../middlewares/auth.middleware.js"; // Use your auth middleware

const router = express.Router();

router.get("/:friendId", protect, getChatHistory);

export default router;