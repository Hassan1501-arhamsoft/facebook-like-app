import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { getUserNotificationsService } from "../services/notification.service.js";

const router = express.Router();

router.get("/", protect, async (req, res, next) => {
  try {
    const notifications = await getUserNotificationsService(req.user.id);
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    next(error);
  }
});

export default router;