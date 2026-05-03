import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/logo.png";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 dark:text-white flex flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md"
      >
        <Link to="/" className="flex items-center justify-center gap-2 font-bold text-2xl mb-8">
          <img src={logo} alt="Motorly" className="w-10 h-10" />
          <span>Motorly</span>
        </Link>

        <div className="text-8xl sm:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-4">
          404
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold mb-3 dark:text-white">Page Not Found</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          Looks like this page took a wrong turn. Let's get you back on the road.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-full border-2 border-primary text-primary font-semibold hover:bg-primary/5 duration-200"
          >
            ← Go Back
          </button>
          <Link
            to="/"
            className="px-6 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:scale-105 duration-200 shadow-md"
          >
            Go to Home
          </Link>
          <Link
            to="/shop"
            className="px-6 py-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 duration-200"
          >
            Browse Shop
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
