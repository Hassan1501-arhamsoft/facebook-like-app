import express from "express";
import { getSuggestions, sendRequest, getPendingRequests, respondToRequest } from "../controllers/follow.controller.js";
import { protect } from "../middlewares/auth.middleware.js"; 
import { getFriends } from "../controllers/follow.controller.js";
import { removeFriend } from "../controllers/follow.controller.js";
const router = express.Router();

router.use(protect);

router.get("/suggestions", getSuggestions);
router.get("/requests", getPendingRequests);
router.post("/:id/request", sendRequest);
router.put("/requests/:id/respond", respondToRequest);
router.get("/friends", getFriends);
router.delete("/friends/:id", removeFriend);

export default router;