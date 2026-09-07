import api from "../../../api/axios";

// Register User
export const registerUser = async (formData) => {
  const response = await api.post("/auth/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// Login User
export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);

  return response.data;
};