import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { MdEmail, MdLock } from "react-icons/md";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/shop";

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      await login({ email: formData.email, password: formData.password });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 dark:text-white duration-200 flex flex-col">

      {/* Top bar */}
      <div className="bg-primary/40 py-3 px-4 flex items-center justify-between shadow-md">
        <Link to="/" className="font-bold text-xl sm:text-2xl flex items-center gap-2">
          <img src={logo} alt="logo" className="w-8 h-8 sm:w-10 sm:h-10" />
          Motorly
        </Link>
        <div className="flex items-center gap-3 text-sm sm:text-base">
          <span className="text-gray-700 dark:text-gray-300">Don't have an account?</span>
          <Link
            to="/register"
            className="bg-gradient-to-r from-primary/50 to-secondary/90 text-white py-1.5 px-4 rounded-full hover:scale-105 duration-200 font-medium"
          >
            Sign Up
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">

          {/* Card */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 sm:p-10 duration-200">

            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="bg-primary/10 dark:bg-primary/20 p-4 rounded-full">
                  <img src={logo} alt="logo" className="w-10 h-10" />
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-1">Welcome Back</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                Sign in to your Motorly account
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                <div className={`flex items-center gap-3 border rounded-xl px-4 py-3 bg-gray-50 dark:bg-gray-800 transition-all duration-200 ${
                  errors.email
                    ? "border-red-400"
                    : "border-gray-300 dark:border-gray-600 focus-within:border-primary"
                }`}>
                  <MdEmail className="text-gray-400 text-lg flex-shrink-0" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="flex-1 bg-transparent outline-none text-sm sm:text-base placeholder-gray-400 dark:placeholder-gray-500"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-0.5">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-primary hover:text-secondary duration-200 font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className={`flex items-center gap-3 border rounded-xl px-4 py-3 bg-gray-50 dark:bg-gray-800 transition-all duration-200 ${
                  errors.password
                    ? "border-red-400"
                    : "border-gray-300 dark:border-gray-600 focus-within:border-primary"
                }`}>
                  <MdLock className="text-gray-400 text-lg flex-shrink-0" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="flex-1 bg-transparent outline-none text-sm sm:text-base placeholder-gray-400 dark:placeholder-gray-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-primary duration-200 flex-shrink-0"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-0.5">{errors.password}</p>
                )}
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 accent-primary cursor-pointer"
                />
                <label htmlFor="remember" className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                  Remember me
                </label>
              </div>

              {/* Server error */}
              {serverError && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
                  <p className="text-red-600 dark:text-red-400 text-sm font-medium">{serverError}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary/80 to-secondary hover:from-primary hover:to-secondary/80 text-white font-semibold py-3 rounded-xl hover:scale-[1.02] duration-200 shadow-md mt-1 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Signing In...
                  </>
                ) : "Sign In"}
              </button>

            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
              <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">OR</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            </div>

            {/* Social login */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 rounded-xl py-2.5 px-4 hover:bg-gray-50 dark:hover:bg-gray-800 duration-200 text-sm font-medium">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 rounded-xl py-2.5 px-4 hover:bg-gray-50 dark:hover:bg-gray-800 duration-200 text-sm font-medium">
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>
            </div>

            {/* Sign up link */}
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
              New to Motorly?{" "}
              <Link to="/register" className="text-primary hover:text-secondary font-semibold duration-200">
                Create an account
              </Link>
            </p>

          </div>
        </div>
      </div>

    </div>
  );
};

export default Login;
