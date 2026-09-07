import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import { getProfile, uploadProfileImage } from "../controllers/profile.controller.js";

const router = express.Router();

// Get logged-in user's profile
router.get("/", protect, getProfile);

// Upload or update profile picture
router.put(
  "/upload",
  protect,
  upload.single("profileImage"),
  uploadProfileImage
);

export default router;