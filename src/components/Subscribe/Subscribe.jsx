import React, { useState } from 'react';
import { MdEmail, MdArrowForward, MdCheckCircle } from 'react-icons/md';
import { FaBell } from 'react-icons/fa';
import { subscribeAPI } from '../../services/api';

export const Subscribe = () => {
  const [email,     setEmail]     = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await subscribeAPI.subscribe(email);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      data-aos="fade-up"
      className="relative overflow-hidden py-16 sm:py-20 my-10 mx-4 sm:mx-8 lg:mx-16 rounded-3xl
        bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900
        dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"
    >
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">

        {/* Icon */}
        <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/20 rounded-2xl mb-6">
          <FaBell className="text-primary text-2xl" />
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-3">
          Stay in the Loop
        </h2>
        <p className="text-gray-400 text-sm sm:text-base mb-8 max-w-md mx-auto">
          Get notified about new arrivals, exclusive deals, and performance tips — straight to your inbox.
        </p>

        {submitted ? (
          <div className="flex flex-col items-center gap-3 bg-green-500/10 border border-green-500/30
            rounded-2xl px-6 py-6 text-green-400 animate-fade-in">
            <MdCheckCircle className="text-4xl" />
            <p className="font-bold text-base">You're subscribed!</p>
            <p className="text-sm text-green-400/80">
              Check your inbox — we sent you a confirmation + a welcome discount code 🎁
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="flex-1 relative">
              <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="your@email.com"
                disabled={loading}
                className={`w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/10 border text-white
                  placeholder-gray-500 focus:outline-none focus:border-primary transition-colors duration-200
                  disabled:opacity-60
                  ${error ? "border-red-500" : "border-white/10 hover:border-white/20"}`}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary
                text-white font-bold px-6 py-3.5 rounded-xl hover:shadow-glow hover:scale-105
                duration-200 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed
                disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Subscribing...
                </>
              ) : (
                <>Subscribe <MdArrowForward /></>
              )}
            </button>
          </form>
        )}

        {error && <p className="text-red-400 text-xs mt-2">{error}</p>}

        <p className="text-gray-600 text-xs mt-4">
          No spam, ever. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
};

export default Subscribe;
