import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import DarkMode from "../components/Navbar/DarkMode";
import logo from "../assets/logo.png";
import {
  FaShieldAlt, FaTruck, FaStar, FaArrowRight,
  FaInstagram, FaFacebook, FaLinkedin,
} from "react-icons/fa";
import { FaCarSide, FaBolt, FaHeadset, FaBars } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { ChevronDown } from "lucide-react";

/* ─── tiny fade-in helper ─── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay, ease: "easeOut" },
});

/* ─── data ─── */
const features = [
  {
    icon: <FaShieldAlt className="text-2xl" />,
    title: "100% Genuine Parts",
    desc: "Every product is verified authentic — no counterfeits, ever.",
    color: "bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400",
  },
  {
    icon: <FaTruck className="text-2xl" />,
    title: "Express Delivery",
    desc: "Same-day dispatch on orders placed before 3 PM.",
    color: "bg-orange-100 dark:bg-orange-500/20 text-orange-500 dark:text-orange-400",
  },
  {
    icon: <FaBolt className="text-2xl" />,
    title: "Performance Upgrades",
    desc: "Curated selection of performance parts for every build.",
    color: "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400",
  },
  {
    icon: <FaHeadset className="text-2xl" />,
    title: "24/7 Expert Support",
    desc: "Our automotive specialists are always ready to help.",
    color: "bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400",
  },
];

const stats = [
  { value: "10K+", label: "Products" },
  { value: "50K+", label: "Happy Customers" },
  { value: "4.9★", label: "Average Rating" },
  { value: "99%", label: "Satisfaction Rate" },
];

const categories = [
  { name: "Tyres & Wheels", icon: "🛞", count: "240+ items" },
  { name: "Interior", icon: "🪑", count: "180+ items" },
  { name: "Electronics", icon: "📡", count: "320+ items" },
  { name: "Performance", icon: "⚡", count: "150+ items" },
  { name: "Exterior", icon: "🚗", count: "200+ items" },
  { name: "Lighting", icon: "💡", count: "130+ items" },
];

const testimonials = [
  {
    name: "Farhan A.",
    role: "Car Enthusiast",
    text: "MOTORLY never disappoints! Genuine parts, fast delivery, excellent packaging.",
    rating: 5,
    avatar: "https://picsum.photos/seed/farhan/80/80",
  },
  {
    name: "Babar Azam",
    role: "Daily Driver",
    text: "Ordered brake pads and received them within 2 days. Amazing service!",
    rating: 5,
    avatar: "https://picsum.photos/seed/babar/80/80",
  },
  {
    name: "Usman K.",
    role: "Mechanic",
    text: "Easy to use website, smooth checkout, and secure payment. Great experience!",
    rating: 5,
    avatar: "https://picsum.photos/seed/usman/80/80",
  },
];

/* ─── component ─── */
const Landing = () => {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLaunch = () => navigate("/shop");

  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white duration-200 overflow-x-hidden">

      {/* ══════════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl sm:text-2xl flex-shrink-0">
            <img src={logo} alt="Motorly" className="w-8 h-8 sm:w-9 sm:h-9" />
            <span>Motorly</span>
          </Link>

          {/* Nav links — desktop */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
            <a href="#features" className="hover:text-primary duration-200">Features</a>
            <a href="#categories" className="hover:text-primary duration-200">Categories</a>
            <a href="#testimonials" className="hover:text-primary duration-200">Reviews</a>
            <Link to="/shop" className="hover:text-primary duration-200">Shop</Link>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <DarkMode />
            {isLoggedIn ? (
              <>
                <span className="hidden sm:block text-sm text-gray-600 dark:text-gray-300 font-medium">
                  Hi, {user.name.split(" ")[0]}
                </span>
                <button
                  onClick={handleLaunch}
                  className="bg-gradient-to-r from-primary/80 to-secondary text-white text-sm
                    font-semibold px-4 py-2 rounded-full hover:scale-105 duration-200 whitespace-nowrap"
                >
                  Go to Store →
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden sm:inline-block text-sm font-medium px-4 py-2 rounded-full
                    border border-primary/50 hover:bg-primary/5 duration-200 whitespace-nowrap"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold px-4 py-2 rounded-full bg-gradient-to-r
                    from-primary/80 to-secondary text-white hover:scale-105 duration-200 whitespace-nowrap"
                >
                  Sign Up
                </Link>
              </>
            )}
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 duration-200"
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
              className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100
                dark:border-gray-800 overflow-hidden"
            >
              <div className="px-4 py-4 flex flex-col gap-1">
                {[
                  { label: "Features",   href: "#features" },
                  { label: "Categories", href: "#categories" },
                  { label: "Reviews",    href: "#testimonials" },
                  { label: "Shop",       href: "/shop", isLink: true },
                ].map((item) => (
                  item.isLink
                    ? <Link key={item.label} to={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="py-2.5 px-3 rounded-xl text-sm font-medium text-gray-700
                          dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800
                          hover:text-primary duration-200">
                        {item.label}
                      </Link>
                    : <a key={item.label} href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="py-2.5 px-3 rounded-xl text-sm font-medium text-gray-700
                          dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800
                          hover:text-primary duration-200">
                        {item.label}
                      </a>
                ))}
                {!isLoggedIn && (
                  <div className="flex gap-3 mt-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                    <Link to="/login" onClick={() => setMobileOpen(false)}
                      className="flex-1 text-center py-2.5 rounded-xl border border-primary/40
                        text-primary text-sm font-semibold hover:bg-primary/5 duration-200">
                      Sign In
                    </Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)}
                      className="flex-1 text-center py-2.5 rounded-xl bg-gradient-to-r
                        from-primary to-secondary text-white text-sm font-semibold
                        hover:scale-[1.02] duration-200">
                      Sign Up
                    </Link>
                  </div>
                )}
                {isLoggedIn && (
                  <div className="flex gap-3 mt-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                    <button onClick={() => { handleLaunch(); setMobileOpen(false); }}
                      className="flex-1 text-center py-2.5 rounded-xl bg-gradient-to-r
                        from-primary to-secondary text-white text-sm font-semibold duration-200">
                      Go to Store →
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* BG image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1920&q=90)" }}
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        {/* Accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="w-8 sm:w-12 h-0.5 bg-primary" />
              <span className="text-primary text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase">
                Premium Automotive Store
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="text-5xl sm:text-7xl md:text-8xl font-extrabold text-white leading-none tracking-tight mb-6"
            >
              Upgrade
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Your Drive.
              </span>
            </motion.h1>

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-base sm:text-xl text-gray-300 font-light max-w-xl mb-10 leading-relaxed"
            >
              Premium car accessories, genuine parts, and performance upgrades — all in one place. Trusted by 50,000+ enthusiasts.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              {isLoggedIn ? (
                <button
                  onClick={handleLaunch}
                  className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary text-white font-bold tracking-wide uppercase text-sm sm:text-base px-8 sm:px-10 py-4 rounded-full hover:shadow-[0_0_40px_rgba(254,169,40,0.5)] hover:scale-105 duration-300"
                >
                  <FaCarSide className="text-lg" />
                  Go to Store
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary text-white font-bold tracking-wide uppercase text-sm sm:text-base px-8 sm:px-10 py-4 rounded-full hover:shadow-[0_0_40px_rgba(254,169,40,0.5)] hover:scale-105 duration-300"
                  >
                    Sign In & Shop
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                  <button
                    onClick={handleLaunch}
                    className="inline-flex items-center justify-center gap-2 border border-gray-500 hover:border-primary text-gray-300 hover:text-white font-medium tracking-wide uppercase text-sm sm:text-base px-8 sm:px-10 py-4 rounded-full duration-300"
                  >
                    Browse Store
                  </button>
                </>
              )}
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="flex flex-wrap gap-8 mt-14 pt-8 border-t border-gray-700/60"
            >
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col">
                  <span className="text-2xl sm:text-3xl font-extrabold text-primary">{s.value}</span>
                  <span className="text-gray-400 text-xs sm:text-sm uppercase tracking-widest mt-0.5">{s.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-500"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════ */}
      <section id="features" className="py-20 sm:py-28 bg-gray-50 dark:bg-gray-950 duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">Why Motorly</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
              Built for Car Enthusiasts
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
              We obsess over quality so you can focus on the drive.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                {...fadeUp(i * 0.1)}
                className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm hover:shadow-lg duration-300 border border-gray-100 dark:border-gray-800 group hover:-translate-y-1"
              >
                <div className={`inline-flex p-3 rounded-xl mb-4 ${f.color}`}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-base sm:text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-6">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CATEGORIES
      ══════════════════════════════════════════ */}
      <section id="categories" className="py-20 sm:py-28 duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">Shop by Category</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
              Find What You Need
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
              From performance parts to interior accessories — we've got every corner of your car covered.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <motion.button
                key={cat.name}
                {...fadeUp(i * 0.07)}
                onClick={handleLaunch}
                className="group flex flex-col items-center gap-3 bg-gray-50 dark:bg-gray-800 hover:bg-primary/10 dark:hover:bg-primary/20 border border-gray-200 dark:border-gray-700 hover:border-primary/50 rounded-2xl p-5 duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <span className="text-3xl sm:text-4xl group-hover:scale-110 duration-300">{cat.icon}</span>
                <span className="font-semibold text-xs sm:text-sm text-center leading-tight">{cat.name}</span>
                <span className="text-xs text-gray-400 dark:text-gray-500">{cat.count}</span>
              </motion.button>
            ))}
          </div>

          <motion.div {...fadeUp(0.3)} className="flex justify-center mt-10">
            <button
              onClick={handleLaunch}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/80 to-secondary text-white font-semibold px-8 py-3.5 rounded-full hover:scale-105 duration-200 shadow-md"
            >
              View All Products
              <FaArrowRight />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SOCIAL PROOF BANNER
      ══════════════════════════════════════════ */}
      <section className="py-16 bg-gradient-to-r from-primary/90 to-secondary text-white duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <motion.div {...fadeUp()} className="text-center md:text-left">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2">
                Join 50,000+ Motorly Customers
              </h2>
              <p className="text-white/80 text-sm sm:text-base">
                Get exclusive deals, early access to new arrivals, and expert tips.
              </p>
            </motion.div>
            <motion.div {...fadeUp(0.2)} className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              {isLoggedIn ? (
                <button
                  onClick={handleLaunch}
                  className="bg-white text-primary font-bold px-8 py-3.5 rounded-full hover:scale-105 duration-200 shadow-lg whitespace-nowrap"
                >
                  Shop Now →
                </button>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="bg-white text-primary font-bold px-8 py-3.5 rounded-full hover:scale-105 duration-200 shadow-lg text-center whitespace-nowrap"
                  >
                    Create Free Account
                  </Link>
                  <button
                    onClick={handleLaunch}
                    className="border-2 border-white/60 text-white font-semibold px-8 py-3.5 rounded-full hover:bg-white/10 duration-200 text-center whitespace-nowrap"
                  >
                    Browse First
                  </button>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════ */}
      <section id="testimonials" className="py-20 sm:py-28 bg-gray-50 dark:bg-gray-950 duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">Reviews</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
              What Customers Say
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                {...fadeUp(i * 0.1)}
                className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden"
              >
                {/* Quote mark */}
                <span className="absolute top-3 right-4 text-7xl font-serif text-primary/10 leading-none select-none">
                  "
                </span>
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <FaStar key={j} className="text-yellow-400 text-sm" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-6 mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="font-bold text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════ */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80)" }}
        />
        <div className="absolute inset-0 bg-black/75" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center text-white">
          <motion.div {...fadeUp()}>
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-4">Ready to Upgrade?</p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              Your Perfect Ride
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Starts Here.
              </span>
            </h2>
            <p className="text-gray-300 text-base sm:text-lg mb-10 max-w-xl mx-auto">
              Sign up in seconds and get instant access to 10,000+ premium automotive products.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isLoggedIn ? (
                <button
                  onClick={handleLaunch}
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary text-white font-bold px-10 py-4 rounded-full hover:shadow-[0_0_40px_rgba(254,169,40,0.5)] hover:scale-105 duration-300 text-base"
                >
                  Go to Store <FaArrowRight />
                </button>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary text-white font-bold px-10 py-4 rounded-full hover:shadow-[0_0_40px_rgba(254,169,40,0.5)] hover:scale-105 duration-300 text-base"
                  >
                    Get Started Free <FaArrowRight />
                  </Link>
                  <button
                    onClick={handleLaunch}
                    className="inline-flex items-center justify-center gap-2 border border-gray-500 hover:border-primary text-gray-300 hover:text-white font-medium px-10 py-4 rounded-full duration-300 text-base"
                  >
                    Browse Without Account
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer className="bg-gray-950 text-gray-400 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-10">
            {/* Brand */}
            <div className="sm:col-span-2 md:col-span-1">
              <Link to="/" className="flex items-center gap-2 font-bold text-xl text-white mb-3">
                <img src={logo} alt="Motorly" className="w-8 h-8" />
                Motorly
              </Link>
              <p className="text-sm leading-6">
                Premium automotive accessories for every car enthusiast. Quality you can trust.
              </p>
              <div className="flex gap-4 mt-5">
                <a href="#" className="hover:text-primary duration-200"><FaInstagram className="text-xl" /></a>
                <a href="#" className="hover:text-primary duration-200"><FaFacebook className="text-xl" /></a>
                <a href="#" className="hover:text-primary duration-200"><FaLinkedin className="text-xl" /></a>
              </div>
            </div>

            {/* Quick links */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                {["Home", "Shop", "About", "Contact"].map((l) => (
                  <li key={l}>
                    <a href="#" className="hover:text-primary duration-200 hover:translate-x-1 inline-block">{l}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Categories</h4>
              <ul className="space-y-2 text-sm">
                {["Tyres & Wheels", "Interior", "Electronics", "Performance"].map((l) => (
                  <li key={l}>
                    <a href="#" className="hover:text-primary duration-200 hover:translate-x-1 inline-block">{l}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Account */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Account</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/login" className="hover:text-primary duration-200 hover:translate-x-1 inline-block">Sign In</Link></li>
                <li><Link to="/register" className="hover:text-primary duration-200 hover:translate-x-1 inline-block">Create Account</Link></li>
                <li><Link to="/forgot-password" className="hover:text-primary duration-200 hover:translate-x-1 inline-block">Forgot Password</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <p>© {new Date().getFullYear()} Motorly. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary duration-200">Privacy Policy</a>
              <a href="#" className="hover:text-primary duration-200">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Landing;
