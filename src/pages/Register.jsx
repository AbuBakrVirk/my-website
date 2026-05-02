import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { MdEmail, MdLock, MdPerson, MdPhone } from "react-icons/md";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (formData.phone && !/^\+?[\d\s\-()]{7,15}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid phone number";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "You must agree to the terms and conditions";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitting(true);
    try {
      await register({
        firstName: formData.firstName,
        lastName:  formData.lastName,
        email:     formData.email,
        password:  formData.password,
        phone:     formData.phone,
      });
      navigate("/shop", { replace: true });
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getPasswordStrength = () => {
    const p = formData.password;
    if (!p) return null;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    if (score <= 1) return { label: "Weak", color: "bg-red-400", width: "w-1/4" };
    if (score === 2) return { label: "Fair", color: "bg-yellow-400", width: "w-2/4" };
    if (score === 3) return { label: "Good", color: "bg-blue-400", width: "w-3/4" };
    return { label: "Strong", color: "bg-green-500", width: "w-full" };
  };

  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 dark:text-white duration-200 flex flex-col">

      {/* Top bar */}
      <div className="bg-primary/40 py-3 px-4 flex items-center justify-between shadow-md">
        <Link to="/" className="font-bold text-xl sm:text-2xl flex items-center gap-2">
          <img src={logo} alt="logo" className="w-8 h-8 sm:w-10 sm:h-10" />
          Motorly
        </Link>
        <div className="flex items-center gap-3 text-sm sm:text-base">
          <span className="text-gray-700 dark:text-gray-300">Already have an account?</span>
          <Link
            to="/login"
            className="bg-gradient-to-r from-primary/50 to-secondary/90 text-white py-1.5 px-4 rounded-full hover:scale-105 duration-200 font-medium"
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg">

          {/* Card */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 sm:p-10 duration-200">

            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="bg-primary/10 dark:bg-primary/20 p-4 rounded-full">
                  <img src={logo} alt="logo" className="w-10 h-10" />
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-1">Create Account</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                Join Motorly and upgrade your ride
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

              {/* Name row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* First Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    First Name
                  </label>
                  <div className={`flex items-center gap-3 border rounded-xl px-4 py-3 bg-gray-50 dark:bg-gray-800 transition-all duration-200 ${
                    errors.firstName
                      ? "border-red-400"
                      : "border-gray-300 dark:border-gray-600 focus-within:border-primary"
                  }`}>
                    <MdPerson className="text-gray-400 text-lg flex-shrink-0" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      className="flex-1 bg-transparent outline-none text-sm sm:text-base placeholder-gray-400 dark:placeholder-gray-500"
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-red-500 text-xs">{errors.firstName}</p>
                  )}
                </div>

                {/* Last Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Last Name
                  </label>
                  <div className={`flex items-center gap-3 border rounded-xl px-4 py-3 bg-gray-50 dark:bg-gray-800 transition-all duration-200 ${
                    errors.lastName
                      ? "border-red-400"
                      : "border-gray-300 dark:border-gray-600 focus-within:border-primary"
                  }`}>
                    <MdPerson className="text-gray-400 text-lg flex-shrink-0" />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      className="flex-1 bg-transparent outline-none text-sm sm:text-base placeholder-gray-400 dark:placeholder-gray-500"
                    />
                  </div>
                  {errors.lastName && (
                    <p className="text-red-500 text-xs">{errors.lastName}</p>
                  )}
                </div>
              </div>

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
                  <p className="text-red-500 text-xs">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone Number <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <div className={`flex items-center gap-3 border rounded-xl px-4 py-3 bg-gray-50 dark:bg-gray-800 transition-all duration-200 ${
                  errors.phone
                    ? "border-red-400"
                    : "border-gray-300 dark:border-gray-600 focus-within:border-primary"
                }`}>
                  <MdPhone className="text-gray-400 text-lg flex-shrink-0" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 234 567 8900"
                    className="flex-1 bg-transparent outline-none text-sm sm:text-base placeholder-gray-400 dark:placeholder-gray-500"
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-xs">{errors.phone}</p>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
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
                    placeholder="Create a strong password"
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
                {/* Password strength */}
                {strength && (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`} />
                    </div>
                    <span className={`text-xs font-medium ${
                      strength.label === "Weak" ? "text-red-400" :
                      strength.label === "Fair" ? "text-yellow-500" :
                      strength.label === "Good" ? "text-blue-400" : "text-green-500"
                    }`}>{strength.label}</span>
                  </div>
                )}
                {errors.password && (
                  <p className="text-red-500 text-xs">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Confirm Password
                </label>
                <div className={`flex items-center gap-3 border rounded-xl px-4 py-3 bg-gray-50 dark:bg-gray-800 transition-all duration-200 ${
                  errors.confirmPassword
                    ? "border-red-400"
                    : "border-gray-300 dark:border-gray-600 focus-within:border-primary"
                }`}>
                  <MdLock className="text-gray-400 text-lg flex-shrink-0" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat your password"
                    className="flex-1 bg-transparent outline-none text-sm sm:text-base placeholder-gray-400 dark:placeholder-gray-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-400 hover:text-primary duration-200 flex-shrink-0"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Terms */}
              <div className="flex flex-col gap-1">
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="w-4 h-4 mt-0.5 accent-primary cursor-pointer flex-shrink-0"
                  />
                  <label htmlFor="agreeTerms" className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer leading-5">
                    I agree to the{" "}
                    <span className="text-primary hover:text-secondary duration-200 font-medium cursor-pointer">
                      Terms of Service
                    </span>{" "}
                    and{" "}
                    <span className="text-primary hover:text-secondary duration-200 font-medium cursor-pointer">
                      Privacy Policy
                    </span>
                  </label>
                </div>
                {errors.agreeTerms && (
                  <p className="text-red-500 text-xs ml-6">{errors.agreeTerms}</p>
                )}
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
                disabled={submitting}
                className="w-full bg-gradient-to-r from-primary/80 to-secondary hover:from-primary hover:to-secondary/80 text-white font-semibold py-3 rounded-xl hover:scale-[1.02] duration-200 shadow-md mt-1 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Creating Account...
                  </>
                ) : "Create Account"}
              </button>

            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
              <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">OR</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            </div>

            {/* Social signup */}
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

            {/* Sign in link */}
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:text-secondary font-semibold duration-200">
                Sign in
              </Link>
            </p>

          </div>
        </div>
      </div>

    </div>
  );
};

export default Register;
