// import { useState, useRef } from "react";
// import useProfile from "../hooks/useProfile";
// import { useNavigate } from "react-router-dom";

// function ProfilePage() {
//   const navigate = useNavigate();
//   const { profile, loading, error, uploadProfileImage } = useProfile();
  
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const fileInputRef = useRef(null);

//   const handleFileChange = (e) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setSelectedFile(file);
//       setPreviewUrl(URL.createObjectURL(file));
//     }
//   };

//   const handleUpload = async () => {
//     if (!selectedFile) return;

//     try {
//       setIsUploading(true);
//       await uploadProfileImage(selectedFile);
//       setSelectedFile(null);
//       setPreviewUrl(null);
//     } catch (error) {
//       console.error(error);
//       alert("Failed to update profile image.");
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const cancelSelection = () => {
//     setSelectedFile(null);
//     setPreviewUrl(null);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">
//         <h2 className="text-xl font-semibold">Loading profile...</h2>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-500">
//         <h2 className="text-xl font-semibold">{error}</h2>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
//       <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
        
//         <h1 className="text-2xl font-bold text-gray-900 mb-8">Account Settings</h1>

//         {/* Avatar Preview Section */}
//         <div className="relative mb-6">
//           <div className="w-32 h-32 rounded-full p-1 border-2 border-dashed border-gray-200">
//             <img
//               src={previewUrl || (profile?.profileImage ? `http://localhost:5000/${profile.profileImage}` : '/default-avatar.png')}
//               alt="Profile Preview"
//               className="w-full h-full rounded-full object-cover"
//             />
//           </div>
//         </div>

//         {/* User Details */}
//         <h2 className="text-xl font-bold text-gray-900">{profile?.name}</h2>
//         <p className="text-sm text-gray-500 mb-8">{profile?.email}</p>

//         {/* Upload Controls */}
//         <div className="w-full flex flex-col gap-3">
//           {!selectedFile ? (
//             <>
//               <button
//                 onClick={() => fileInputRef.current?.click()}
//                 className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-md flex justify-center items-center gap-2"
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
//                 Select New Photo
//               </button>
//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 accept="image/*"
//                 onChange={handleFileChange}
//                 className="hidden"
//               />
//             </>
//           ) : (
//             <div className="flex flex-col gap-3 w-full bg-gray-50 p-4 rounded-xl border border-gray-100">
//               <span className="text-xs font-medium text-gray-500 text-center truncate">
//                 Selected: {selectedFile.name}
//               </span>
              
//               <button
//                 onClick={handleUpload}
//                 disabled={isUploading}
//                 className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 disabled:opacity-50"
//               >
//                 {isUploading ? "Uploading..." : "Confirm Upload"}
//               </button>
              
//               <button
//                 onClick={cancelSelection}
//                 disabled={isUploading}
//                 className="w-full rounded-lg bg-white border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 disabled:opacity-50"
//               >
//                 Cancel
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       <button
//         onClick={() => navigate("/dashboard")}
//         className="mt-8 flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
//       >
//         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
//         Back to Dashboard
//       </button>
//     </div>
//   );
// }

// export default ProfilePage;