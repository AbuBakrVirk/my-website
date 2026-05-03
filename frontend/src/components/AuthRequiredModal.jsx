import React from "react";
import { Link } from "react-router-dom";
import { IoCloseOutline } from "react-icons/io5";
import { MdLock } from "react-icons/md";
import logo from "../assets/logo.png";

const AuthRequiredModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-8 duration-200 animate-fade-in">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 duration-200"
          aria-label="Close"
        >
          <IoCloseOutline className="text-2xl" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-5">
          <div className="relative">
            <div className="bg-primary/10 dark:bg-primary/20 p-4 rounded-full">
              <img src={logo} alt="Motorly" className="w-10 h-10" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-orange-500 rounded-full p-1">
              <MdLock className="text-white text-xs" />
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="text-center mb-7">
          <h2 className="text-xl font-bold mb-2 dark:text-white">Sign In Required</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-6">
            You need to be signed in to place an order. Join thousands of Motorly customers today.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            to="/login"
            onClick={onClose}
            className="w-full text-center bg-gradient-to-r from-primary/80 to-secondary hover:from-primary hover:to-secondary/80 text-white font-semibold py-3 rounded-xl hover:scale-[1.02] duration-200 shadow-md"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            onClick={onClose}
            className="w-full text-center border border-primary/50 text-primary hover:bg-primary/5 font-semibold py-3 rounded-xl duration-200"
          >
            Create Account
          </Link>
          <button
            onClick={onClose}
            className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 duration-200 mt-1"
          >
            Continue browsing
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthRequiredModal;
