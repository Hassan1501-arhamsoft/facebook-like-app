import express from "express";
import {registerUser,loginUser} from "../controllers/auth.controller.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

// Register User
router.post("/register", upload.single("profileImage"), registerUser);

// Login User
router.post("/login", loginUser);

export default router;