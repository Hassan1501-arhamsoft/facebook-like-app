import User from "../models/user.model.js";
import Report from "../models/report.model.js";

// ==========================================
// USER MANAGEMENT SERVICES
// ==========================================

export const getAllUsersService = async () => {
  return await User.findAll({
    attributes: { exclude: ["password"] },
    order: [["created_at", "DESC"]],
  });
};

export const toggleBanUserService = async (adminId, targetUserId) => {
  // Prevent admin from banning themselves
  if (parseInt(targetUserId, 10) === parseInt(adminId, 10)) {
    throw new Error("You cannot ban yourself.");
  }

  const user = await User.findByPk(targetUserId);
  if (!user) {
    throw new Error("User not found.");
  }

  // Flip the ban status
  user.isBanned = !user.isBanned;
  await user.save();

  return user;
};

// ==========================================
// REPORT MANAGEMENT SERVICES
// ==========================================

export const getAllReportsService = async () => {
  return await Report.findAll({
    include: [
      { model: User, as: "Reporter", attributes: ["id", "name", "email", "profileImage"] },
      { model: User, as: "Reported", attributes: ["id", "name", "email", "profileImage"] }
    ],
    order: [
      ["status", "ASC"], // Pending first
      ["createdat", "DESC"]
    ],
  });
};

export const updateReportStatusService = async (reportId, status) => {
  const validStatuses = ["pending", "reviewed", "resolved"];
  if (!validStatuses.includes(status)) {
    throw new Error("Invalid status.");
  }

  const report = await Report.findByPk(reportId);
  if (!report) {
    throw new Error("Report not found.");
  }

  report.status = status;
  await report.save();

  return report;
};