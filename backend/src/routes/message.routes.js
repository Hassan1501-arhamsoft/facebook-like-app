import express from "express";
import { getChatHistory, toggleBlockUser, checkBlockStatus } from "../controllers/message.controller.js";
import { protect } from "../middlewares/auth.middleware.js"; // Use your auth middleware

const router = express.Router();

router.get("/:friendId", protect, getChatHistory);
router.post("/block/:friendId", protect, toggleBlockUser);
router.get("/block-status/:friendId", protect, checkBlockStatus);
export default router;