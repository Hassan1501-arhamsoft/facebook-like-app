import api from "../../../api/axios";

export const submitReportApi = async (reportedId, reason, description) => {
  const response = await api.post("/reports", {
    reportedId,
    reason,
    description,
  });
  return response.data;
};