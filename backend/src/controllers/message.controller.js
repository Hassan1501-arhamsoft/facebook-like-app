import { getChatHistoryService } from "../services/message.service.js";

export const getChatHistory = async (req, res, next) => {
  try {
    const { friendId } = req.params;
    const messages = await getChatHistoryService(req.user.id, friendId);
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    next(error);
  }
};