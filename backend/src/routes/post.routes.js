import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import { createPost, getMyPosts, deletePost, getGlobalFeed, getFriendsFeed} from "../controllers/post.controller.js";

const router = express.Router();

router.post("/", protect, upload.single("postImage"), createPost);
router.get("/my-posts", protect, getMyPosts);
router.delete("/:id", protect, deletePost);
router.get("/feed", protect, getGlobalFeed);
router.get("/friends-feed", protect, getFriendsFeed);
export default router;