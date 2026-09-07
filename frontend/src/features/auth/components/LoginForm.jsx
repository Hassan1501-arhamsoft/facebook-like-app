import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth.service";
import useAuth from "../hooks/useAuth";

function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    if (type === "checkbox") {
      setRememberMe(checked);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

      const response = await loginUser(formData);

      login(
        response.data.user,
        response.data.token
      );

      navigate("/dashboard");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message || "Login failed."
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
        <h2 className="text-[21px] font-bold text-gray-900 m-0 mb-1.5">Welcome Back 👋</h2>
        <p className="text-[13px] text-gray-500 m-0">Login to continue to your account</p>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
              placeholder="Enter your password"
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

        {/* Remember me & Forgot Password Row */}
        <div className="flex justify-between items-center -mt-0.5 mb-1">
          <label className="flex items-center gap-2 text-[13px] text-gray-700 font-medium cursor-pointer">
            <input
              type="checkbox"
              name="rememberMe"
              checked={rememberMe}
              onChange={handleChange}
              className="w-[15px] h-[15px] rounded-[4px] border border-gray-300 cursor-pointer accent-indigo-700"
            />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-[13px] text-indigo-700 font-semibold no-underline hover:underline">
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="w-full bg-indigo-700 text-white p-[13px] rounded-[10px] text-[15px] font-semibold border-none cursor-pointer transition-colors duration-200 hover:bg-indigo-800 disabled:opacity-70 disabled:cursor-not-allowed" 
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Signup Link */}
        <p className="text-center text-[13px] text-gray-700 mt-1 m-0">
          Don't have an account? <Link to="/signup" className="text-indigo-700 font-semibold no-underline hover:underline">Sign up</Link>
        </p>
      </form>
    </div>
  );
}

export default LoginForm;