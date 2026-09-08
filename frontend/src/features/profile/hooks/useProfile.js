//  import { uploadProfileImage } from "../services/Profile.service";
// import useAuth from "../../auth/hooks/useAuth";

// function useProfile() {
//   const { user, login } = useAuth();

//   const changeProfileImage = async (file) => {
//     const response = await uploadProfileImage(file);

//     // Backend returns updated user
//     const updatedUser = response.data;

//     // Update AuthContext + localStorage
//     login(updatedUser, localStorage.getItem("token"));

//     return updatedUser;
//   };

//   return {
//     user,
//     changeProfileImage,
//   };
// }

// export default useProfile;