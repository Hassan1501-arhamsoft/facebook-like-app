import { getSuggestionsService, sendFollowRequestService, getPendingRequestsService, respondToRequestService } from "../services/follow.service.js";
import { getIO } from "../socket/socket.js";
import { getFriendsService } from "../services/follow.service.js";

export const getSuggestions = async (req, res, next) => {
  try {
    const limit = req.query.limit || 5;
    const suggestions = await getSuggestionsService(req.user.id, limit);
    res.status(200).json({ success: true, data: suggestions });
  } catch (error) {
    next(error);
  }
};

export const sendRequest = async (req, res, next) => {
  try {
    const { id: followingId } = req.params;
    const result = await sendFollowRequestService(req.user.id, followingId);

    // Broadcast a live notification if it was a new request
    if (result.action === "requested") {
      getIO().emit("new_notification", {
        userId: parseInt(followingId), // Custom payload structure for frontend routing
        actor: { name: req.user.name, profileImage: req.user.profileImage },
        type: "follow_request"
      });
    }

    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const getPendingRequests = async (req, res, next) => {
  try {
    const requests = await getPendingRequestsService(req.user.id);
    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    next(error);
  }
};

export const respondToRequest = async (req, res, next) => {
  try {
    const { id: requestId } = req.params;
    const { action } = req.body; // Expects 'accept' or 'reject' from the frontend

    const result = await respondToRequestService(req.user.id, requestId, action);

    res.status(200).json({ success: true, message: `Follow request ${result.status}.` });
  } catch (error) {
    next(error);
  }
};

// network


export const getFriends = async (req, res, next) => {
  try {
    const friends = await getFriendsService(req.user.id);
    res.status(200).json({ success: true, data: friends });
  } catch (error) {
    next(error);
  }
};

import { removeFriendService } from "../services/follow.service.js"; // update imports

export const removeFriend = async (req, res, next) => {
  try {
    const { id: friendId } = req.params;
    await removeFriendService(req.user.id, friendId);
    res.status(200).json({ success: true, message: "Unfriended successfully." });
  } catch (error) {
    next(error);
  }
};