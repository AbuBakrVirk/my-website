import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.png";
import {
  FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock,
  FaInstagram, FaFacebook, FaLinkedin, FaWhatsapp,
} from "react-icons/fa";
import { FaBars } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { MdSend, MdCheckCircle } from "react-icons/md";
import DarkMode from "../components/Navbar/DarkMode";
import { contactAPI } from "../services/api";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay },
});

const contactInfo = [
  { icon: <FaMapMarkerAlt className="text-primary text-xl" />, title: "Address", lines: ["Islamabad, Pakistan"] },
  { icon: <FaPhone className="text-primary text-xl" />,        title: "Phone",   lines: ["+92 300 1234567", "+92 51 1234567"] },
  { icon: <FaEnvelope className="text-primary text-xl" />,     title: "Email",   lines: ["support@motorly.com", "orders@motorly.com"] },
  { icon: <FaClock className="text-primary text-xl" />,        title: "Hours",   lines: ["Mon–Sat: 9 AM – 8 PM", "Sun: 11 AM – 5 PM"] },
];

const Contact = () => {
  const [form, setForm]       = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [serverError, setServerError] = useState("");
  const [mobileOpen, setMobileOpen]   = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = "Name is required";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.subject.trim()) e.subject = "Subject is required";
    if (!form.message.trim()) e.message = "Message is required";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setServerError("");
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await contactAPI.send(form);
      setSent(true);
    } catch (err) {
      setServerError(err.message || "Failed to send. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const field = (key, label, type = "text", placeholder = "") => (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => { setForm({ ...form, [key]: e.target.value }); if (errors[key]) setErrors({ ...errors, [key]: "" }); }}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-xl border bg-gray-50 dark:bg-gray-800 dark:text-white
          focus:outline-none focus:border-primary transition-colors duration-200 text-sm
          ${errors[key] ? "border-red-400" : "border-gray-200 dark:border-gray-700"}`}
      />
      {errors[key] && <p className="text-red-500 text-xs">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white duration-200 min-h-screen">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <img src={logo} alt="Motorly" className="w-8 h-8" />
            <span className="dark:text-white">Motorly</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-5 text-sm font-medium text-gray-600 dark:text-gray-300">
              <Link to="/" className="hover:text-primary duration-200">Home</Link>
              <Link to="/shop" className="hover:text-primary duration-200">Shop</Link>
              <Link to="/about" className="hover:text-primary duration-200">About</Link>
            </div>
            <DarkMode />
            <Link to="/shop" className="bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold px-4 py-2 rounded-full hover:scale-105 duration-200">
              Shop Now
            </Link>
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 duration-200"
              aria-label="Toggle menu"
            >
              {mobileOpen
                ? <IoMdClose className="text-xl dark:text-white" />
                : <FaBars className="text-xl dark:text-white" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 overflow-hidden"
            >
              <div className="px-4 py-3 flex flex-col gap-1">
                {[
                  { label: "Home",    to: "/" },
                  { label: "Shop",    to: "/shop" },
                  { label: "About",   to: "/about" },
                  { label: "Contact", to: "/contact" },
                ].map((item) => (
                  <Link key={item.label} to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className="py-2.5 px-3 rounded-xl text-sm font-medium text-gray-700
                      dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800
                      hover:text-primary duration-200">
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 text-center">
        <motion.div {...fadeUp()} className="max-w-2xl mx-auto px-4">
          <span className="text-primary text-sm font-bold uppercase tracking-widest">Get in Touch</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold mt-3 mb-4 dark:text-white">Contact Us</h1>
          <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg">
            Have a question, feedback, or need help with your order? We're here for you.
          </p>
        </motion.div>
      </section>

      {/* Content */}
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Contact info */}
            <motion.div {...fadeUp()}>
              <h2 className="text-2xl font-extrabold mb-6 dark:text-white">We'd Love to Hear From You</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                Whether you have a question about a product, need help tracking your order, or just want to say hello — our team is ready to help.
              </p>

              <div className="flex flex-col gap-5 mb-8">
                {contactInfo.map((c) => (
                  <div key={c.title} className="flex items-start gap-4 bg-gray-50 dark:bg-gray-800 rounded-2xl p-4">
                    <div className="mt-0.5 flex-shrink-0">{c.icon}</div>
                    <div>
                      <p className="font-semibold text-sm dark:text-white mb-1">{c.title}</p>
                      {c.lines.map((l) => <p key={l} className="text-sm text-gray-500 dark:text-gray-400">{l}</p>)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Social */}
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Follow Us</p>
                <div className="flex gap-3">
                  {[
                    { icon: <FaInstagram />, href: "https://instagram.com", label: "Instagram", color: "hover:bg-pink-500" },
                    { icon: <FaFacebook />,  href: "https://facebook.com",  label: "Facebook",  color: "hover:bg-blue-600" },
                    { icon: <FaLinkedin />,  href: "https://linkedin.com",  label: "LinkedIn",  color: "hover:bg-blue-700" },
                    { icon: <FaWhatsapp />,  href: "https://wa.me/923001234567", label: "WhatsApp", color: "hover:bg-green-500" },
                  ].map((s) => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                      className={`w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center
                        text-gray-600 dark:text-gray-400 hover:text-white ${s.color} duration-200 hover:scale-110`}>
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Contact form */}
            <motion.div {...fadeUp(0.2)}>
              {sent ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16 gap-4">
                  <div className="bg-green-100 dark:bg-green-900/30 p-5 rounded-full">
                    <MdCheckCircle className="text-green-500 text-5xl" />
                  </div>
                  <h3 className="text-xl font-bold dark:text-white">Message Sent!</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs">
                    Thanks for reaching out. We'll get back to you within 24 hours.
                  </p>
                  <button onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                    className="mt-2 text-primary text-sm font-semibold hover:underline">
                    Send another message
                  </button>
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
                  <h2 className="text-xl font-bold mb-6 dark:text-white">Send a Message</h2>
                  <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {field("name",  "Full Name",  "text",  "Your name")}
                      {field("email", "Email",      "email", "you@example.com")}
                    </div>
                    {field("subject", "Subject", "text", "How can we help?")}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
                      <textarea
                        rows={5}
                        value={form.message}
                        onChange={(e) => { setForm({ ...form, message: e.target.value }); if (errors.message) setErrors({ ...errors, message: "" }); }}
                        placeholder="Tell us more..."
                        className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-gray-900 dark:text-white
                          focus:outline-none focus:border-primary transition-colors duration-200 text-sm resize-none
                          ${errors.message ? "border-red-400" : "border-gray-200 dark:border-gray-700"}`}
                      />
                      {errors.message && <p className="text-red-500 text-xs">{errors.message}</p>}
                    </div>
                    {serverError && (
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
                        <p className="text-red-600 dark:text-red-400 text-sm">{serverError}</p>
                      </div>
                    )}
                    <button type="submit" disabled={loading}
                      className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary
                        text-white font-bold py-3.5 rounded-xl hover:scale-[1.02] duration-200 shadow-md
                        disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100">
                      {loading ? (
                        <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg> Sending...</>
                      ) : <><MdSend /> Send Message</>}
                    </button>
                  </form>
                </div>
              )}
            </motion.div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-8 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} Motorly. All rights reserved.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/privacy" className="hover:text-primary duration-200">Privacy Policy</Link>
            <Link to="/terms"   className="hover:text-primary duration-200">Terms of Service</Link>
            <Link to="/about"   className="hover:text-primary duration-200">About Us</Link>
            <Link to="/shop"    className="hover:text-primary duration-200">Shop</Link>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Contact;
