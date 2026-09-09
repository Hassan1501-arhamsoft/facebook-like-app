import api from "../../../api/axios";

export const createPostApi = async (formData) => {
  const response = await api.post("/posts", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Added Pagination arguments
export const getMyPostsApi = async (page = 1, limit = 5) => {
  const response = await api.get(`/posts/my-posts?page=${page}&limit=${limit}`);
  return response.data;
};

export const deletePostApi = async (postId) => {
  const response = await api.delete(`/posts/${postId}`);
  return response.data;
};

// Added Pagination arguments
export const getGlobalFeedApi = async (page = 1, limit = 5) => {
  const response = await api.get(`/posts/feed?page=${page}&limit=${limit}`);
  return response.data;
};

export const toggleLikeApi = async (postId) => {
  const response = await api.post(`/likes/${postId}/toggle`);
  return response.data;
};