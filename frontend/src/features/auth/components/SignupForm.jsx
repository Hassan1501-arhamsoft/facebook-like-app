import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/auth.service";
import useAuth from "../hooks/useAuth";

function SignupForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

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
      alert(
        error.response?.data?.message || "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white w-full max-w-[390px] mx-auto my-[30px] py-9 px-7 rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.06)] font-sans">
      {/* Header section with Chat Icon */}
      <div className="text-center mb-[22px]">
        <div className="mb-3 flex justify-center">
          <svg width="46" height="46" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C6.477 2 2 6.03 2 11C2 13.565 3.208 15.88 5.148 17.472C5.025 18.337 4.542 19.68 3.32 20.916C3.121 21.118 3.197 21.455 3.473 21.536C5.46 22.122 7.373 21.493 8.528 20.73C9.626 21.054 10.79 21.222 12 21.222C17.523 21.222 22 17.192 22 12.222C22 7.253 17.523 2 12 2Z"
              fill="#4338ca"
            />
            <circle cx="8" cy="11" r="1.5" fill="white" />
            <circle cx="12" cy="11" r="1.5" fill="white" />
            <circle cx="16" cy="11" r="1.5" fill="white" />
          </svg>
        </div>
        <h2 className="text-[21px] font-bold text-gray-900 m-0 mb-1.5">Create Account 🚀</h2>
        <p className="text-[13px] text-gray-500 m-0">Join and start chatting with friends</p>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Full Name Input */}
        <div className="flex flex-col text-left">
          <label htmlFor="name" className="text-[13px] font-semibold text-gray-700 mb-1.5">Full Name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
            className="w-full py-[11px] px-[14px] border border-gray-200 rounded-[10px] text-[14px] text-gray-900 outline-none bg-white transition-all duration-200 placeholder-gray-400 placeholder:text-[13.5px] focus:border-indigo-700 focus:shadow-[0_0_0_3px_rgba(67,56,202,0.1)]"
          />
        </div>

        {/* Email Input */}
        <div className="flex flex-col text-left">
          <label htmlFor="email" className="text-[13px] font-semibold text-gray-700 mb-1.5">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            className="w-full py-[11px] px-[14px] border border-gray-200 rounded-[10px] text-[14px] text-gray-900 outline-none bg-white transition-all duration-200 placeholder-gray-400 placeholder:text-[13.5px] focus:border-indigo-700 focus:shadow-[0_0_0_3px_rgba(67,56,202,0.1)]"
          />
        </div>

        {/* Password Input with Show/Hide Toggle */}
        <div className="flex flex-col text-left">
          <label htmlFor="password" className="text-[13px] font-semibold text-gray-700 mb-1.5">Password</label>
          <div className="relative w-full">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
              className="w-full py-[11px] pl-[14px] pr-[42px] border border-gray-200 rounded-[10px] text-[14px] text-gray-900 outline-none bg-white transition-all duration-200 placeholder-gray-400 placeholder:text-[13.5px] focus:border-indigo-700 focus:shadow-[0_0_0_3px_rgba(67,56,202,0.1)]"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none p-0 cursor-pointer flex items-center justify-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                // Eye Open Icon
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              ) : (
                // Eye Slashed/Hidden Icon
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Profile Picture Upload Box */}
        <div className="flex flex-col text-left">
          <label className="text-[13px] font-semibold text-gray-700 mb-1.5">Profile Picture</label>
          <label htmlFor="profile-upload" className="w-full h-[86px] border-[1.5px] border-dashed border-indigo-200 bg-[#f8faff] rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200 hover:bg-indigo-50 hover:border-indigo-400">
            <input
              id="profile-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />
            {preview ? (
              <div className="flex items-center gap-3">
                <img src={preview} alt="Profile Preview" className="w-12 h-12 rounded-full object-cover border-2 border-indigo-600" />
                <span className="text-[13px] text-indigo-600 font-medium">Change image</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-[5px]">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 16l-4-4-4 4M12 12v9" />
                  <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                </svg>
                <span className="text-[12.5px] font-medium text-indigo-600">Upload image</span>
              </div>
            )}
          </label>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="w-full bg-indigo-700 text-white p-[13px] rounded-[10px] text-[15px] font-semibold border-none cursor-pointer mt-1 transition-colors duration-200 hover:bg-indigo-800 disabled:opacity-70 disabled:cursor-not-allowed" 
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        {/* Login Link */}
        <p className="text-center text-[13px] text-gray-700 mt-1 m-0">
          Already have an account? <Link to="/login" className="text-indigo-700 font-semibold no-underline hover:underline">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default SignupForm;