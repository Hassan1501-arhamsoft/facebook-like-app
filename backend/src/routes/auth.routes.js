import express from "express";
import {registerUser,loginUser} from "../controllers/auth.controller.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User login and registration
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     security: [] 
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               profileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request (e.g., missing fields or email already exists)
 */
// Register User
router.post("/register", upload.single("profileImage"), registerUser);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Authentication]
 *     security: [] 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *       401:
 *         description: Invalid email or password
 *       403:
 *         description: Account is banned
 */

// Login User
router.post("/login", loginUser);

export default router;