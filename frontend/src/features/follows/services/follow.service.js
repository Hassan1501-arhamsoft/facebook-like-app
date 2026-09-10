import api from "../../../api/axios";

export const getSuggestionsApi = async (limit = 5) => {
  const response = await api.get(`/follows/suggestions?limit=${limit}`);
  return response.data;
};

export const sendFollowRequestApi = async (userId) => {
  const response = await api.post(`/follows/${userId}/request`);
  return response.data;
};

export const getPendingRequestsApi = async () => {
  const response = await api.get("/follows/requests");
  return response.data;
};

export const respondToRequestApi = async (requestId, action) => {
  // action must be either 'accept' or 'reject'
  const response = await api.put(`/follows/requests/${requestId}/respond`, { action });
  return response.data;
};


export const getFriendsApi = async () => {
  const response = await api.get("/follows/friends");
  return response.data;
};

export const removeFriendApi = async (friendId) => {
  const response = await api.delete(`/follows/friends/${friendId}`);
  return response.data;
};