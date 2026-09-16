import api from "../../../api/axios";

export const getAdminUsersApi = async () => {
  const response = await api.get("/admin/users");
  return response.data;
};

export const toggleBanApi = async (userId) => {
  const response = await api.post(`/admin/users/${userId}/ban`);
  return response.data;
};

export const getAdminReportsApi = async () => {
  const response = await api.get("/admin/reports");
  return response.data;
};

export const updateReportStatusApi = async (reportId, status) => {
  const response = await api.put(`/admin/reports/${reportId}/status`, { status });
  return response.data;
};