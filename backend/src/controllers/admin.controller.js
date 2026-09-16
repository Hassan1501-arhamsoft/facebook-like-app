import {
  getAllUsersService,
  toggleBanUserService,
  getAllReportsService,
  updateReportStatusService
} from "../services/admin.service.js";

// ==========================================
// USER MANAGEMENT
// ==========================================

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await getAllUsersService();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

export const toggleBanUser = async (req, res, next) => {
  try {
    const targetUserId = req.params.id;
    const adminId = req.user.id;

    const user = await toggleBanUserService(adminId, targetUserId);
    
    const action = user.isBanned ? "banned" : "unbanned";
    res.status(200).json({ 
      success: true, 
      message: `User has been successfully ${action}.`,
      isBanned: user.isBanned
    });
  } catch (error) {
    // If it's a known error from the service (like "User not found"), send a 400
    if (error.message === "You cannot ban yourself." || error.message === "User not found.") {
        return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

// ==========================================
// REPORT MANAGEMENT
// ==========================================

export const getAllReports = async (req, res, next) => {
  try {
    const reports = await getAllReportsService();
    res.status(200).json({ success: true, data: reports });
  } catch (error) {
    next(error);
  }
};

export const updateReportStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const report = await updateReportStatusService(id, status);

    res.status(200).json({ 
      success: true, 
      message: "Report status updated.", 
      data: report 
    });
  } catch (error) {
    if (error.message === "Invalid status." || error.message === "Report not found.") {
        return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};