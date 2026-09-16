import Report from "../models/report.model.js";

export const submitReport = async (req, res, next) => {
  try {
    const { reportedId, reason, description } = req.body;
    const reporterId = req.user.id;

    // Prevent users from reporting themselves
    if (parseInt(reporterId, 10) === parseInt(reportedId, 10)) {
      return res.status(400).json({ success: false, message: "You cannot report yourself." });
    }

    const report = await Report.create({
      reporter_id: parseInt(reporterId, 10),
      reported_id: parseInt(reportedId, 10),
      reason,
      description
    });

    res.status(201).json({ 
      success: true, 
      message: "Report submitted successfully.", 
      data: report 
    });
  } catch (error) {
    next(error);
  }
};