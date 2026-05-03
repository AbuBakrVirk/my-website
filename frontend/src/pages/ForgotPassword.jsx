import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { MdEmail, MdArrowBack, MdCheckCircle } from "react-icons/md";
import { authAPI } from "../services/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!email) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(email)) return "Enter a valid email address";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);
    try {
      await authAPI.forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
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
        <div className="w-full max-w-md">

          {/* Card */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 sm:p-10 duration-200">

            {!submitted ? (
              <>
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                    <div className="bg-primary/10 dark:bg-primary/20 p-4 rounded-full">
                      <MdEmail className="text-primary text-3xl" />
                    </div>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold mb-2">Forgot Password?</h1>
                  <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base leading-6">
                    No worries! Enter your email and we'll send you a reset link.
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
                      error
                        ? "border-red-400"
                        : "border-gray-300 dark:border-gray-600 focus-within:border-primary"
                    }`}>
                      <MdEmail className="text-gray-400 text-lg flex-shrink-0" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (error) setError("");
                        }}
                        placeholder="you@example.com"
                        className="flex-1 bg-transparent outline-none text-sm sm:text-base placeholder-gray-400 dark:placeholder-gray-500"
                      />
                    </div>
                    {error && (
                      <p className="text-red-500 text-xs">{error}</p>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-primary/80 to-secondary hover:from-primary hover:to-secondary/80 text-white font-semibold py-3 rounded-xl hover:scale-[1.02] duration-200 shadow-md disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                        Sending...
                      </>
                    ) : "Send Reset Link"}
                  </button>

                </form>

                {/* Back to login */}
                <div className="flex justify-center mt-6">
                  <Link
                    to="/login"
                    className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-primary duration-200 font-medium"
                  >
                    <MdArrowBack className="text-base" />
                    Back to Sign In
                  </Link>
                </div>
              </>
            ) : (
              /* Success state */
              <div className="text-center py-4">
                <div className="flex justify-center mb-5">
                  <div className="bg-green-100 dark:bg-green-900/30 p-5 rounded-full">
                    <MdCheckCircle className="text-green-500 text-5xl" />
                  </div>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-3">Check Your Email</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base leading-6 mb-2">
                  We've sent a password reset link to
                </p>
                <p className="text-primary font-semibold text-base mb-6 break-all">{email}</p>
                <p className="text-gray-400 dark:text-gray-500 text-xs sm:text-sm leading-5 mb-8">
                  Didn't receive the email? Check your spam folder or{" "}
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-primary hover:text-secondary duration-200 font-medium"
                  >
                    try again
                  </button>
                  .
                </p>

                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/80 to-secondary hover:from-primary hover:to-secondary/80 text-white font-semibold py-3 px-8 rounded-xl hover:scale-[1.02] duration-200 shadow-md"
                >
                  <MdArrowBack className="text-base" />
                  Back to Sign In
                </Link>
              </div>
            )}

          </div>

          {/* Help text */}
          {!submitted && (
            <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-5">
              Remember your password?{" "}
              <Link to="/login" className="text-primary hover:text-secondary duration-200 font-medium">
                Sign in here
              </Link>
            </p>
          )}

        </div>
      </div>

    </div>
  );
};

export default ForgotPassword;
