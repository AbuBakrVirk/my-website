import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.png";
import {
  FaShieldAlt, FaTruck, FaHeadset, FaAward,
  FaUsers, FaBoxOpen, FaStar,
} from "react-icons/fa";
import { FaBolt, FaBars } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import DarkMode from "../components/Navbar/DarkMode";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: "easeOut" },
});

const stats = [
  { icon: <FaBoxOpen />, value: "10,000+", label: "Products" },
  { icon: <FaUsers />,   value: "50,000+", label: "Customers" },
  { icon: <FaStar />,    value: "4.9★",    label: "Avg Rating" },
  { icon: <FaTruck />,   value: "2 Days",  label: "Avg Delivery" },
];

const values = [
  { icon: <FaShieldAlt className="text-violet-500 text-2xl" />, title: "100% Genuine", desc: "Every product is verified authentic. No counterfeits, ever.", bg: "bg-violet-50 dark:bg-violet-900/20" },
  { icon: <FaTruck className="text-orange-500 text-2xl" />,     title: "Fast Delivery", desc: "Same-day dispatch on orders placed before 3 PM.", bg: "bg-orange-50 dark:bg-orange-900/20" },
  { icon: <FaBolt className="text-yellow-500 text-2xl" />,      title: "Performance Focus", desc: "Curated parts for every build, from daily drivers to track cars.", bg: "bg-yellow-50 dark:bg-yellow-900/20" },
  { icon: <FaHeadset className="text-green-500 text-2xl" />,    title: "Expert Support", desc: "Our automotive specialists are available 24/7 to help.", bg: "bg-green-50 dark:bg-green-900/20" },
];

const team = [
  { name: "ABU BAKAR VIRK", role: "Founder & CEO", img: "https://picsum.photos/seed/ceo/200/200" },
  { name: "Umair Hassan",     role: "Head of Products", img: "https://picsum.photos/seed/products/200/200" },
  { name: "Waiza Khan",      role: "Customer Success", img: "https://picsum.photos/seed/sara/200/200" },
  { name: "Rajab Ayan",    role: "Lead Developer", img: "https://picsum.photos/seed/dev/200/200" },
];

const About = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

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
            <Link to="/contact" className="hover:text-primary duration-200">Contact</Link>
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
    <section className="relative py-20 sm:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10" />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div {...fadeUp()}>
          <span className="text-primary text-sm font-bold uppercase tracking-widest">Our Story</span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mt-3 mb-6 dark:text-white">
            Built by Car Enthusiasts,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              For Car Enthusiasts
            </span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Motorly was founded in 2022 with a simple mission — make it easy for every Pakistani car owner to find genuine, high-quality automotive accessories at fair prices, delivered fast.
          </p>
        </motion.div>
      </div>
    </section>

    {/* Stats */}
    <section className="py-12 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div key={s.label} {...fadeUp(i * 0.1)}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 text-center shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="text-primary text-2xl flex justify-center mb-2">{s.icon}</div>
              <p className="text-2xl sm:text-3xl font-extrabold text-primary">{s.value}</p>
              <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Mission */}
    <section className="py-16 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div {...fadeUp()}>
            <span className="text-primary text-sm font-bold uppercase tracking-widest">Our Mission</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-2 mb-5 dark:text-white">
              Upgrade Every Ride in Pakistan
            </h2>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
              We believe every car deserves the best accessories — whether you're upgrading your daily commuter or building a performance machine. We source directly from verified manufacturers to ensure authenticity and quality.
            </p>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
              From Karachi to Peshawar, we deliver to every corner of Pakistan with fast, reliable shipping and a hassle-free return policy.
            </p>
            <Link to="/shop" className="inline-flex items-center gap-2 mt-6 bg-gradient-to-r from-primary to-secondary text-white font-semibold px-6 py-3 rounded-full hover:scale-105 duration-200 shadow-md">
              Explore Products →
            </Link>
          </motion.div>
          <motion.div {...fadeUp(0.2)} className="grid grid-cols-2 gap-4">
            {values.map((v) => (
              <div key={v.title} className={`${v.bg} rounded-2xl p-5 border border-gray-100 dark:border-gray-800`}>
                <div className="mb-3">{v.icon}</div>
                <h3 className="font-bold text-sm dark:text-white mb-1">{v.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>

    {/* Team */}
    <section className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div {...fadeUp()} className="text-center mb-12">
          <span className="text-primary text-sm font-bold uppercase tracking-widest">The Team</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-2 dark:text-white">People Behind Motorly</h2>
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {team.map((m, i) => (
            <motion.div key={m.name} {...fadeUp(i * 0.1)} className="text-center">
              <img src={m.img} alt={m.name} className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover mx-auto mb-3 ring-4 ring-primary/20" />
              <p className="font-bold text-sm dark:text-white">{m.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{m.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-16 bg-gradient-to-r from-primary to-secondary text-white text-center">
      <div className="max-w-2xl mx-auto px-4">
        <FaAward className="text-5xl mx-auto mb-4 opacity-80" />
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Ready to Upgrade Your Ride?</h2>
        <p className="text-white/80 mb-6">Join 50,000+ satisfied customers across Pakistan.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/shop" className="bg-white text-primary font-bold px-8 py-3 rounded-full hover:scale-105 duration-200 shadow-lg">
            Shop Now →
          </Link>
          <Link to="/contact" className="border-2 border-white/60 text-white font-semibold px-8 py-3 rounded-full hover:bg-white/10 duration-200">
            Contact Us
          </Link>
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer className="bg-gray-950 text-gray-400 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <p>© {new Date().getFullYear()} Motorly. All rights reserved.</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/privacy" className="hover:text-primary duration-200">Privacy Policy</Link>
          <Link to="/terms"   className="hover:text-primary duration-200">Terms of Service</Link>
          <Link to="/contact" className="hover:text-primary duration-200">Contact Us</Link>
          <Link to="/shop"    className="hover:text-primary duration-200">Shop</Link>
        </div>
      </div>
    </footer>

  </div>
  );
};

export default About;
