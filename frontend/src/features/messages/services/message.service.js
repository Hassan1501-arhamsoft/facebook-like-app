import api from "../../../api/axios"; // Adjust path to your axios instance

export const getChatHistoryApi = async (friendId) => {
  const response = await api.get(`/messages/${friendId}`);
  return response.data;
};


export const getBlockStatusApi = async (friendId) => {
  const response = await api.get(`/messages/block-status/${friendId}`); 
  return response.data;
};

export const toggleBlockApi = async (friendId) => {
  const response = await api.post(`/messages/block/${friendId}`);
  return response.data;
};