import React from "react";
import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router";
import { Link } from "react-router";

const demoUser = {
  name: "",
  email: "",
  password: "",
};

const Signup = () => {
  const [formData, setFormData] = useState(demoUser);
  const [msg, setMsg] = useState({
    error: "",
    success: "",
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMsg({error: "", success: ""});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission logic here
    try {
      const res = await api.post("/auth/signup", formData);
      setFormData(demoUser);
      setMsg({error: "", success: res.data.message});
    } catch (err) {
      setMsg({
        error: err.response?.data?.message || "An error occurred. Please try again.",
        success: "",
      });
      setFormData(demoUser);
    }
  };
  return (
    <>
   
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-4">
        <div className="bg-white/80 backdrop-blur-sm p-10 rounded-3xl shadow-2xl shadow-emerald-100 w-full max-w-md border border-emerald-100">

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-200">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
              </svg>
            </div>
          </div>

          <h2 className="text-3xl font-extrabold mb-1 text-center text-gray-900 tracking-tight">
            Create account
          </h2>
          <p className="text-center text-gray-400 text-sm mb-8">Sign up to get started today</p>

          {msg.error && (
            <div className="mb-5 flex items-center gap-2.5 text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded-xl">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd"/></svg>
              {msg.error}
            </div>
          )}
          {msg.success && (
            <div className="mb-5 flex items-center gap-2.5 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-3 rounded-xl">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd"/></svg>
              {msg.success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="username">
                Username
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 focus:bg-white transition-all duration-200"
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="email">
                Email address
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 focus:bg-white transition-all duration-200"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="password">
                Password
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 focus:bg-white transition-all duration-200"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <button
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transition-all duration-200 active:scale-[0.98] mt-2 tracking-wide"
              type="submit"
            >
              Create Account →
            </button>
          </form>

          <div className="mt-7 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-500 text-sm">
              Already have an account?{" "}
              <button
                className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline underline-offset-2 transition-colors"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            </p>
          </div>

        </div>
      </div>
    </>
  );
};

export default Signup;