import React, { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { MdLock, MdCheckCircle } from "react-icons/md";
import { authAPI } from "../services/api";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [form, setForm]           = useState({ password: "", confirm: "" });
  const [errors, setErrors]       = useState({});
  const [showPw, setShowPw]       = useState(false);
  const [showCf, setShowCf]       = useState(false);
  const [loading, setLoading]     = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess]     = useState(false);

  const validate = () => {
    const e = {};
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "At least 6 characters";
    if (!form.confirm) e.confirm = "Please confirm your password";
    else if (form.password !== form.confirm) e.confirm = "Passwords do not match";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setServerError("");
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (!token) { setServerError("Invalid reset link."); return; }
    setLoading(true);
    try {
      await authAPI.resetPassword(token, form.password);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 dark:text-white duration-200 flex flex-col">
      <div className="bg-primary/40 py-3 px-4 flex items-center justify-between shadow-md">
        <Link to="/" className="font-bold text-xl sm:text-2xl flex items-center gap-2">
          <img src={logo} alt="logo" className="w-8 h-8 sm:w-10 sm:h-10" />
          Motorly
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 sm:p-10 duration-200">

            {success ? (
              <div className="text-center py-4">
                <div className="flex justify-center mb-5">
                  <div className="bg-green-100 dark:bg-green-900/30 p-5 rounded-full">
                    <MdCheckCircle className="text-green-500 text-5xl" />
                  </div>
                </div>
                <h1 className="text-2xl font-bold mb-3">Password Reset!</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                  Your password has been updated successfully.
                </p>
                <p className="text-gray-400 text-xs">Redirecting to sign in...</p>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                    <div className="bg-primary/10 dark:bg-primary/20 p-4 rounded-full">
                      <MdLock className="text-primary text-3xl" />
                    </div>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold mb-1">Set New Password</h1>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Choose a strong password for your account.
                  </p>
                </div>

                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                  {[
                    { key: "password", label: "New Password",      show: showPw, toggle: () => setShowPw(!showPw) },
                    { key: "confirm",  label: "Confirm Password",   show: showCf, toggle: () => setShowCf(!showCf) },
                  ].map(({ key, label, show, toggle }) => (
                    <div key={key} className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
                      <div className={`flex items-center gap-3 border rounded-xl px-4 py-3 bg-gray-50 dark:bg-gray-800 transition-all duration-200 ${
                        errors[key] ? "border-red-400" : "border-gray-300 dark:border-gray-600 focus-within:border-primary"
                      }`}>
                        <MdLock className="text-gray-400 text-lg flex-shrink-0" />
                        <input
                          type={show ? "text" : "password"}
                          value={form[key]}
                          onChange={(e) => { setForm({ ...form, [key]: e.target.value }); if (errors[key]) setErrors({ ...errors, [key]: "" }); }}
                          placeholder="••••••••"
                          className="flex-1 bg-transparent outline-none text-sm placeholder-gray-400 dark:placeholder-gray-500"
                        />
                        <button type="button" onClick={toggle} className="text-gray-400 hover:text-primary duration-200">
                          {show ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                      {errors[key] && <p className="text-red-500 text-xs">{errors[key]}</p>}
                    </div>
                  ))}

                  {serverError && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
                      <p className="text-red-600 dark:text-red-400 text-sm">{serverError}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-primary/80 to-secondary text-white font-semibold py-3 rounded-xl hover:scale-[1.02] duration-200 shadow-md disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                        Resetting...
                      </>
                    ) : "Reset Password"}
                  </button>
                </form>

                <div className="flex justify-center mt-5">
                  <Link to="/login" className="text-sm text-gray-400 hover:text-primary duration-200">
                    ← Back to Sign In
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
