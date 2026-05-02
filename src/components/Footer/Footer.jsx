import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import {
  FaInstagram, FaFacebook, FaLinkedin, FaTwitter,
  FaMapMarkerAlt, FaPhone, FaEnvelope,
} from 'react-icons/fa';

const quickLinks = [
  { label: "Home",       to: "/" },
  { label: "Shop",       to: "/shop" },
  { label: "My Orders",  to: "/orders" },
  { label: "About Us",   to: "/" },
];

const categories = [
  "Tyres & Wheels",
  "Interior",
  "Electronics",
  "Performance",
  "Exterior",
  "Lighting",
];

const socials = [
  { icon: <FaInstagram />, href: "#", label: "Instagram" },
  { icon: <FaFacebook />,  href: "#", label: "Facebook" },
  { icon: <FaLinkedin />,  href: "#", label: "LinkedIn" },
  { icon: <FaTwitter />,   href: "#", label: "Twitter" },
];

export const Footer = () => {
  return (
    <footer className="bg-gray-950 text-gray-400 duration-200">

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <img src={logo} alt="Motorly" className="w-9 h-9" />
              <span className="text-white font-extrabold text-xl tracking-tight">Motorly</span>
            </Link>
            <p className="text-sm leading-relaxed mb-5 max-w-xs">
              Pakistan's premier automotive accessories store. Premium parts, genuine quality, fast delivery.
            </p>
            {/* Socials */}
            <div className="flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-primary/20 hover:text-primary
                    flex items-center justify-center text-sm transition-all duration-200 hover:scale-110"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="text-sm hover:text-primary duration-200 hover:translate-x-1
                      inline-flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary/40 group-hover:bg-primary
                      transition-colors duration-200 flex-shrink-0" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Categories</h4>
            <ul className="space-y-3">
              {categories.map((c) => (
                <li key={c}>
                  <Link
                    to="/shop"
                    className="text-sm hover:text-primary duration-200 hover:translate-x-1
                      inline-flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary/40 group-hover:bg-primary
                      transition-colors duration-200 flex-shrink-0" />
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Contact</h4>
            <ul className="space-y-4">
              {[
                { icon: <FaMapMarkerAlt />, text: "Islamabad, Pakistan" },
                { icon: <FaPhone />,        text: "+92 300 1234567" },
                { icon: <FaEnvelope />,     text: "support@motorly.com" },
              ].map(({ icon, text }) => (
                <li key={text} className="flex items-start gap-3 text-sm">
                  <span className="text-primary mt-0.5 flex-shrink-0">{icon}</span>
                  <span className="hover:text-white duration-200 cursor-default">{text}</span>
                </li>
              ))}
            </ul>

            {/* Account links */}
            <div className="mt-6 pt-5 border-t border-white/5">
              <h5 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Account</h5>
              <div className="flex flex-col gap-2">
                {[
                  { label: "Sign In",        to: "/login" },
                  { label: "Create Account", to: "/register" },
                  { label: "My Orders",      to: "/orders" },
                ].map((l) => (
                  <Link
                    key={l.label}
                    to={l.to}
                    className="text-xs hover:text-primary duration-200"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5
          flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p>© {new Date().getFullYear()} Motorly. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-primary duration-200">Privacy Policy</a>
            <a href="#" className="hover:text-primary duration-200">Terms of Service</a>
            <a href="#" className="hover:text-primary duration-200">Cookie Policy</a>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
