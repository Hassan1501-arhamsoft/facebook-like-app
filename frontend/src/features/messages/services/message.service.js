import api from "../../../api/axios"; // Adjust path to your axios instance

export const getChatHistoryApi = async (friendId) => {
  const response = await api.get(`/messages/${friendId}`);
  return response.data;
};