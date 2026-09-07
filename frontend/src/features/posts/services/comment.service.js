import api from "../../../api/axios";

export const getPostCommentsApi = async (postId) => {
  const response = await api.get(`/comments/${postId}`);
  return response.data;
};

export const addCommentApi = async (postId, text) => {
  const response = await api.post(`/comments/${postId}`, { text });
  return response.data;
};