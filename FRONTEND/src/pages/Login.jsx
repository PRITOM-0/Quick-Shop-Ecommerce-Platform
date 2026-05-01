import React from "react";
import { useNavigate } from "react-router";
import { useState } from "react";
import api from "../api/axios";
import { Link } from "react-router";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [msg, setMsg] = useState({
    error: "",
    success: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMsg({ error: "", success: "" });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", formData);
      setFormData({
        email: "",
        password: "",
      });
      setMsg({ error: "", success: res.data.message });
      //save token to local storage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user.id);
      //navigate to home page
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      setMsg({
        error:
          err.response?.data?.message || "An error occurred. Please try again.",
        success: "",
      });
      setFormData({
        email: "",
        password: "",
      });
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 px-4">
        <div className="bg-white/80 backdrop-blur-sm p-10 rounded-3xl shadow-2xl shadow-orange-100 w-full max-w-md border border-orange-100">
          {/* Logo / Icon area */}
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-200">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-3xl font-extrabold mb-1 text-center text-gray-900 tracking-tight">
            Welcome back
          </h2>
          <p className="text-center text-gray-400 text-sm mb-8">
            Login to your account to continue
          </p>

          {msg.error && (
            <div className="mb-5 flex items-center gap-2.5 text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded-xl">
              {msg.error}
            </div>
          )}
          {msg.success && (
            <div className="mb-5 flex items-center gap-2.5 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-3 rounded-xl">
              <svg
                className="w-4 h-4 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
                  clipRule="evenodd"
                />
              </svg>
              {msg.success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                className="block text-sm font-semibold text-gray-700 mb-1.5"
                htmlFor="email"
              >
                Email address
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 focus:bg-white transition-all duration-200"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  className="block text-sm font-semibold text-gray-700"
                  htmlFor="password"
                >
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs text-orange-500 hover:text-orange-600 font-medium hover:underline underline-offset-2 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <input
                className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 focus:bg-white transition-all duration-200"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <button
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-200 hover:shadow-orange-300 transition-all duration-200 active:scale-[0.98] mt-2 tracking-wide"
              type="submit"
            >
              Login →
            </button>
          </form>

          <div className="mt-7 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-500 text-sm">
              Don't have an account?{" "}
              <button
                className="text-orange-500 hover:text-orange-600 font-semibold hover:underline underline-offset-2 transition-colors"
                onClick={() => navigate("/signup")}
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
