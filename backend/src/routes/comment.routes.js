import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { addComment, getPostComments } from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/:postId", protect, addComment);
router.get("/:postId", protect, getPostComments);

export default router;