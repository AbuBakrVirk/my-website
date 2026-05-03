import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import {
  FaInstagram, FaFacebook, FaLinkedin, FaTwitter, FaWhatsapp,
  FaMapMarkerAlt, FaPhone, FaEnvelope,
} from 'react-icons/fa';

const quickLinks = [
  { label: "Home",       to: "/" },
  { label: "Shop",       to: "/shop" },
  { label: "About Us",   to: "/about" },
  { label: "Contact",    to: "/contact" },
  { label: "My Orders",  to: "/orders" },
];

const categories = [
  { label: "Tyres & Wheels", section: "tyres" },
  { label: "Interior",       section: "interior" },
  { label: "Electronics",    section: "electronics" },
  { label: "Performance",    section: "top-rated" },
  { label: "Exterior",       section: "products" },
  { label: "Lighting",       section: "products" },
];

const socials = [
  { icon: <FaInstagram />, href: "https://instagram.com",          label: "Instagram", color: "hover:bg-pink-500" },
  { icon: <FaFacebook />,  href: "https://facebook.com",           label: "Facebook",  color: "hover:bg-blue-600" },
  { icon: <FaLinkedin />,  href: "https://linkedin.com",           label: "LinkedIn",  color: "hover:bg-blue-700" },
  { icon: <FaTwitter />,   href: "https://twitter.com",            label: "Twitter",   color: "hover:bg-sky-500" },
  { icon: <FaWhatsapp />,  href: "https://wa.me/923001234567",     label: "WhatsApp",  color: "hover:bg-green-500" },
];

export const Footer = () => {
  const scrollToSection = (section) => {
    const el = document.getElementById(section);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
            <div className="flex flex-wrap gap-2">
              {socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  className={`w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-sm
                    hover:text-white ${s.color} duration-200 hover:scale-110`}>
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
                  <Link to={l.to}
                    className="text-sm hover:text-primary duration-200 hover:translate-x-1
                      inline-flex items-center gap-1.5 group">
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
                <li key={c.label}>
                  <Link to="/shop"
                    onClick={() => setTimeout(() => scrollToSection(c.section), 100)}
                    className="text-sm hover:text-primary duration-200 hover:translate-x-1
                      inline-flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-primary/40 group-hover:bg-primary
                      transition-colors duration-200 flex-shrink-0" />
                    {c.label}
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
                { icon: <FaPhone />,        text: "+92 300 1234567",    href: "tel:+923001234567" },
                { icon: <FaEnvelope />,     text: "support@motorly.com", href: "mailto:support@motorly.com" },
              ].map(({ icon, text, href }) => (
                <li key={text} className="flex items-start gap-3 text-sm">
                  <span className="text-primary mt-0.5 flex-shrink-0">{icon}</span>
                  {href
                    ? <a href={href} className="hover:text-white duration-200">{text}</a>
                    : <span>{text}</span>}
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
                  { label: "Forgot Password",to: "/forgot-password" },
                ].map((l) => (
                  <Link key={l.label} to={l.to}
                    className="text-xs hover:text-primary duration-200 hover:translate-x-1 inline-block">
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
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/privacy" className="hover:text-primary duration-200">Privacy Policy</Link>
            <Link to="/terms"   className="hover:text-primary duration-200">Terms of Service</Link>
            <Link to="/contact" className="hover:text-primary duration-200">Contact Us</Link>
            <Link to="/about"   className="hover:text-primary duration-200">About Us</Link>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
