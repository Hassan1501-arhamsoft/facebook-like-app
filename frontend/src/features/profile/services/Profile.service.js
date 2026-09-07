import api from "../../../api/axios";

export const uploadProfileImage = async (file) => {
  const formData = new FormData();

  formData.append("profileImage", file);

  const response = await api.put(
    "/profile/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  console.log("Upload response:", response.data);
  return response.data;
};

