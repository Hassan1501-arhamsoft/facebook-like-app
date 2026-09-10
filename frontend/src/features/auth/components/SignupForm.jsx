import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/auth.service";
import useAuth from "../hooks/useAuth";

function SignupForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setErrorMsg("");
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    setErrorMsg("");
    const file = event.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setErrorMsg("");

      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("password", formData.password);

      if (image) {
        data.append("profileImage", image);
      }

      const response = await registerUser(data);

      login(
        response.data.user,
        response.data.token
      );

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setErrorMsg(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white w-full max-w-[420px] mx-auto p-8 sm:p-10 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 font-sans transition-all">
      
      {/* Header section */}
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-5 border border-indigo-100 shadow-sm rotate-3 hover:rotate-0 transition-transform duration-300">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C6.477 2 2 6.03 2 11C2 13.565 3.208 15.88 5.148 17.472C5.025 18.337 4.542 19.68 3.32 20.916C3.121 21.118 3.197 21.455 3.473 21.536C5.46 22.122 7.373 21.493 8.528 20.73C9.626 21.054 10.79 21.222 12 21.222C17.523 21.222 22 17.192 22 12.222C22 7.253 17.523 2 12 2Z"
              fill="#4338ca"
            />
            <circle cx="8" cy="11" r="1.5" fill="white" />
            <circle cx="12" cy="11" r="1.5" fill="white" />
            <circle cx="16" cy="11" r="1.5" fill="white" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 m-0 mb-2 tracking-tight">Create Account</h2>
        <p className="text-[14px] text-gray-500 m-0">Join and start connecting with your network</p>
      </div>

      {/* Inline Error Message */}
      {errorMsg && (
        <div className="mb-6 p-3.5 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 animate-fade-in">
          <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-[13px] text-red-700 font-medium m-0 leading-tight">{errorMsg}</p>
        </div>
      )}

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        
        {/* Full Name Input */}
        <div className="flex flex-col text-left">
          <label htmlFor="name" className="text-[13px] font-bold text-gray-700 mb-2">Full Name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            required
            className="w-full py-3 px-4 border border-gray-200 rounded-xl text-[14px] text-gray-900 bg-gray-50/50 hover:bg-gray-50 outline-none transition-all duration-200 placeholder-gray-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
          />
        </div>

        {/* Email Input */}
        <div className="flex flex-col text-left">
          <label htmlFor="email" className="text-[13px] font-bold text-gray-700 mb-2">Email Address</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="name@example.com"
            required
            className="w-full py-3 px-4 border border-gray-200 rounded-xl text-[14px] text-gray-900 bg-gray-50/50 hover:bg-gray-50 outline-none transition-all duration-200 placeholder-gray-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
          />
        </div>

        {/* Password Input */}
        <div className="flex flex-col text-left">
          <label htmlFor="password" className="text-[13px] font-bold text-gray-700 mb-2">Password</label>
          <div className="relative w-full">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
              className="w-full py-3 pl-4 pr-12 border border-gray-200 rounded-xl text-[14px] text-gray-900 bg-gray-50/50 hover:bg-gray-50 outline-none transition-all duration-200 placeholder-gray-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors bg-transparent border-none p-1 cursor-pointer flex items-center justify-center rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Profile Picture Upload Box */}
        <div className="flex flex-col text-left">
          <label className="text-[13px] font-bold text-gray-700 mb-2">Profile Picture <span className="text-gray-400 font-normal">(Optional)</span></label>
          <label htmlFor="profile-upload" className="w-full h-[90px] border-2 border-dashed border-gray-200 bg-gray-50/50 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200 hover:bg-indigo-50/50 hover:border-indigo-400 group">
            <input
              id="profile-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />
            {preview ? (
              <div className="flex items-center gap-4">
                <img src={preview} alt="Profile Preview" className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" />
                <span className="text-[13px] text-indigo-600 font-bold group-hover:text-indigo-700">Change image</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1.5">
                <div className="bg-white p-2 rounded-full shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 16l-4-4-4 4M12 12v9" />
                    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                  </svg>
                </div>
                <span className="text-[12.5px] font-medium text-gray-500 group-hover:text-indigo-600">Click to upload image</span>
              </div>
            )}
          </label>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="w-full bg-indigo-600 text-white py-3.5 rounded-xl text-[15px] font-bold border-none cursor-pointer mt-2 transition-all duration-200 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2" 
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </button>

        {/* Login Link */}
        <p className="text-center text-[14px] text-gray-600 mt-2 m-0">
          Already have an account? <Link to="/login" className="text-indigo-600 font-bold no-underline hover:text-indigo-800 transition-colors">Sign In</Link>
        </p>
      </form>
    </div>
  );
}

export default SignupForm;