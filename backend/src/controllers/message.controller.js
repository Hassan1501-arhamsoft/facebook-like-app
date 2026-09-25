import { getChatHistoryService } from "../services/message.service.js";
import Block from "../models/block.model.js";
import { Op } from "sequelize";


export const getChatHistory = async (req, res, next) => {
  try {
    const { friendId } = req.params;
    const messages = await getChatHistoryService(req.user.id, friendId);
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    next(error);
  }
};

export const toggleBlockUser = async (req, res, next) => {
  try {
    const { friendId } = req.params;
    const userId = req.user.id;

    const existingBlock = await Block.findOne({
      where: { blocker_id: userId, blocked_id: friendId }
    });

    if (existingBlock) {
      await existingBlock.destroy();
      return res.status(200).json({ success: true, blocked: false, message: "User unblocked" });
    } else {
      await Block.create({ blocker_id: userId, blocked_id: friendId });
      return res.status(200).json({ success: true, blocked: true, message: "User blocked" });
    }
  } catch (error) {
    next(error);
  }
};

export const checkBlockStatus = async (req, res, next) => {
  try {
    const { friendId } = req.params;
    const userId = req.user.id;

    const blockRecord = await Block.findOne({
      where: {
        [Op.or]: [
          { blocker_id: userId, blocked_id: friendId },
          { blocker_id: friendId, blocked_id: userId }
        ]
      }
    });

    if (!blockRecord) {
      return res.status(200).json({ isBlocked: false });
    }

    return res.status(200).json({
      isBlocked: true,
      blockedByMe: blockRecord.blocker_id === userId
    });
  } catch (error) {
    next(error);
  }
};