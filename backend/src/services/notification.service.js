import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import { getIO, onlineUsers } from "../socket/socket.js";

export const createTargetedNotification = async (recipientId, actorId, postId, type) => {
  // Do not notify the user if they like/comment on their own post
  if (recipientId === actorId) return;

  const notification = await Notification.create({
    recipient_id: recipientId,
    actor_id: actorId,
    post_id: postId,
    type,
  });

  // Fetch the actor's details to show their name and picture in the UI
  const populatedNotification = await Notification.findByPk(notification.id, {
    include: [{ model: User, as: "actor", attributes: ["id", "name", "profileImage"] }],
  });

  // Send LIVE to the specific user if they are currently online
  const recipientSocketId = onlineUsers.get(recipientId);
  if (recipientSocketId) {
    getIO().to(recipientSocketId).emit("new_notification", populatedNotification);
  }
};

export const getUserNotificationsService = async (userId) => {
  return await Notification.findAll({
    where: { recipient_id: userId },
    include: [{ model: User, as: "actor", attributes: ["id", "name", "profileImage"] }],
    order: [["created_at", "DESC"]],
  });
};