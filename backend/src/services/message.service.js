import { Op } from "sequelize";
import Message from "../models/message.model.js";

export const getChatHistoryService = async (userId, friendId) => {
  return await Message.findAll({
    where: {
      [Op.or]: [
        { sender_id: userId, receiver_id: friendId },
        { sender_id: friendId, receiver_id: userId },
      ],
    },
    order: [["createdAt", "ASC"]], // Oldest first so chat flows top to bottom
  });
};