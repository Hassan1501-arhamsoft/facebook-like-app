import api from "../../../api/axios";

export const createPostApi = async (formData) => {
  const response = await api.post("/posts", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getMyPostsApi = async () => {
  const response = await api.get("/posts/my-posts");
  return response.data;
};



export const deletePostApi = async (postId) => {
  const response = await api.delete(`/posts/${postId}`);
  return response.data;
};


export const getGlobalFeedApi = async () => {
  const response = await api.get("/posts/feed");
  return response.data;
};


export const toggleLikeApi = async (postId) => {
  const response = await api.post(`/likes/${postId}/toggle`);
  return response.data;
};