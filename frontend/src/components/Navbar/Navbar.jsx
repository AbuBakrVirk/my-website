import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { IoMdSearch, IoMdClose } from "react-icons/io";
import { FaCaretDown, FaCartShopping, FaBars } from "react-icons/fa6";
import {
  FaSignOutAlt, FaUser, FaBoxOpen, FaHome, FaStar,
  FaTachometerAlt, FaInfoCircle, FaEnvelope, FaShoppingBag,
} from "react-icons/fa";
import { MdElectricBolt, MdDashboard } from "react-icons/md";
import { GiCarWheel } from "react-icons/gi";
import DarkMode from './DarkMode';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const ALL_PRODUCTS = [
  { id: "p1", name: "Interior Accessories Kit",       section: "products",  price: "$49.99" },
  { id: "p2", name: "Premium Car Mats (Red & Black)", section: "products",  price: "$34.99" },
  { id: "p3", name: "Full Car Cover",                 section: "products",  price: "$79.99" },
  { id: "p4", name: "Interior Renovation Spray",      section: "products",  price: "$19.99" },
  { id: "p5", name: "Chrome Rims Set",                section: "tyres",     price: "$299.99" },
  { id: "p6", name: "Premium Leather Seat Covers",    section: "top-rated", price: "$129.99" },
  { id: "p7", name: "Ambient LED Interior Lights",    section: "top-rated", price: "$44.99" },
  { id: "p8", name: "Car Armrest Organizer",          section: "top-rated", price: "$24.99" },
];

// Category sections (lower bar)
const ShopSections = [
  { id: 1, label: "Home",        section: null,          icon: <FaHome /> },
  { id: 2, label: "Top Rated",   section: "top-rated",   icon: <FaStar /> },
  { id: 3, label: "Tyres",       section: "tyres",       icon: <GiCarWheel /> },
  { id: 4, label: "Interior",    section: "interior",    icon: <FaUser /> },
  { id: 5, label: "Electronics", section: "electronics", icon: <MdElectricBolt /> },
];

const TrendingLinks = [
  { id: 1, label: "Trending Products", section: "trending",     desc: "What's hot right now" },
  { id: 2, label: "Best Selling",      section: "best-selling", desc: "Customer favourites" },
  { id: 3, label: "Top Rated",         section: "top-rated",    desc: "Highest rated items" },
  { id: 4, label: "New Arrivals",      section: "new",          desc: "Just landed" },
];

const scrollToSection = (section, navigate, location) => {
  if (!section) { navigate("/shop"); return; }
  if (location.pathname === "/shop") {
    const el = document.getElementById(section);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    navigate("/shop");
    setTimeout(() => {
      const el = document.getElementById(section);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 400);
  }
};

export const Navbar = ({ handleOrderPopup, onCartOpen }) => {
  const { isLoggedIn, user, logout } = useAuth();
  const { totalQty } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [userMenuOpen,   setUserMenuOpen]   = useState(false);
  const [trendingOpen,   setTrendingOpen]   = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery,    setSearchQuery]    = useState("");
  const [searchResults,  setSearchResults]  = useState([]);
  const [searchOpen,     setSearchOpen]     = useState(false);

  const userMenuRef = useRef(null);
  const trendingRef = useRef(null);
  const searchRef   = useRef(null);

  const handleSearch = (q) => {
    setSearchQuery(q);
    if (q.trim().length < 2) { setSearchResults([]); setSearchOpen(false); return; }
    setSearchResults(ALL_PRODUCTS.filter(p => p.name.toLowerCase().includes(q.toLowerCase())));
    setSearchOpen(true);
  };

  const handleSearchSelect = (product) => {
    setSearchQuery(""); setSearchResults([]); setSearchOpen(false);
    scrollToSection(product.section, navigate, location);
  };

  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
      if (trendingRef.current && !trendingRef.current.contains(e.target)) setTrendingOpen(false);
      if (searchRef.current  && !searchRef.current.contains(e.target))  setSearchOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => { setMobileMenuOpen(false); }, [location]);

  const handleLogout = () => {
    logout(); setUserMenuOpen(false); setMobileMenuOpen(false); navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white duration-200 relative z-40" style={{ overflow: "visible" }}>

      {/* ══════════════════════════════════════
          UPPER NAVBAR
      ══════════════════════════════════════ */}
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm duration-200">
        <div className="container px-4 flex items-center justify-between gap-4 py-3">

          {/* Logo */}
          <Link to="/" className="font-bold text-xl sm:text-2xl flex items-center gap-2 flex-shrink-0">
            <img src={logo} alt="Motorly" className="w-8 h-8 sm:w-10 sm:h-10" />
            <span className="hidden sm:block text-gray-900 dark:text-white">Motorly</span>
          </Link>

          {/* Page links — visible on md+ */}
          <nav className="hidden md:flex items-center gap-1 flex-shrink-0">
            {[
              { label: "Home",    to: "/",        icon: <FaHome className="text-[11px]" /> },
              { label: "Shop",    to: "/shop",    icon: <FaShoppingBag className="text-[11px]" /> },
              { label: "About",   to: "/about",   icon: <FaInfoCircle className="text-[11px]" /> },
              { label: "Contact", to: "/contact", icon: <FaEnvelope className="text-[11px]" /> },
            ].map((l) => (
              <Link key={l.to} to={l.to}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium duration-200 whitespace-nowrap
                  ${isActive(l.to)
                    ? "text-primary"
                    : "text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800"}`}>
                <span className={isActive(l.to) ? "text-primary" : "text-gray-400"}>{l.icon}</span>
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Search */}
          <div className="flex-1 max-w-xs hidden md:block" ref={searchRef}>
            <div className="relative">
              <IoMdSearch className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400 text-lg pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setSearchOpen(true)}
                placeholder="Search products..."
                className="w-full rounded-full border border-gray-200 dark:border-gray-700
                  bg-gray-50 dark:bg-gray-800 pl-9 pr-4 py-1.5 text-sm focus:outline-none
                  focus:border-primary dark:text-white placeholder-gray-400 duration-200"
              />
              {searchQuery && (
                <button onClick={() => { setSearchQuery(""); setSearchResults([]); setSearchOpen(false); }}
                  className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 hover:text-gray-600">
                  <IoMdClose className="text-sm" />
                </button>
              )}
              {searchOpen && searchResults.length > 0 && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-gray-800
                  rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-[99999]">
                  <p className="px-4 pt-3 pb-1 text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Results</p>
                  {searchResults.map((p) => (
                    <button key={p.id} onClick={() => handleSearchSelect(p)}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-sm
                        hover:bg-gray-50 dark:hover:bg-gray-700 duration-200 text-left">
                      <span className="font-medium dark:text-white">{p.name}</span>
                      <span className="text-primary font-bold text-xs">{p.price}</span>
                    </button>
                  ))}
                </div>
              )}
              {searchOpen && searchQuery.length >= 2 && searchResults.length === 0 && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-gray-800
                  rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 px-4 py-3 z-[99999]">
                  <p className="text-sm text-gray-400">No results for "{searchQuery}"</p>
                </div>
              )}
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">

            {/* Cart */}
            <button onClick={onCartOpen}
              className="relative bg-gradient-to-r from-primary to-secondary text-white
                py-1.5 px-3 sm:px-4 rounded-full flex items-center gap-2 whitespace-nowrap
                hover:scale-105 duration-200 shadow-sm">
              <span className="hidden sm:block text-sm font-semibold">Cart</span>
              <FaCartShopping className="text-base sm:text-lg" />
              {totalQty > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px]
                  font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                  {totalQty > 99 ? "99+" : totalQty}
                </span>
              )}
            </button>

            {/* User menu */}
            {isLoggedIn ? (
              <div className="relative" ref={userMenuRef}>
                <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800
                    hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-1.5 rounded-full duration-200">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary
                    flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-sm font-medium max-w-[80px] truncate dark:text-white">
                    {user?.name?.split(" ")[0]}
                  </span>
                  <FaCaretDown className={`text-xs text-gray-500 transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800
                    rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700
                    overflow-hidden z-[9999] animate-fade-in">
                    <div className="px-4 py-3 bg-primary/5 dark:bg-primary/10 border-b border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary
                          flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {user?.name?.[0]?.toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold dark:text-white truncate">{user?.name}</p>
                          <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                        </div>
                      </div>
                    </div>
                    {[
                      { icon: <MdDashboard className="text-primary" />, label: "Dashboard",  path: "/account" },
                      { icon: <FaBoxOpen className="text-primary" />,   label: "My Orders",  path: "/orders" },
                      { icon: <FaUser className="text-primary" />,      label: "My Account", path: "/account" },
                    ].map((item) => (
                      <button key={item.label}
                        onClick={() => { setUserMenuOpen(false); navigate(item.path); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm
                          hover:bg-gray-50 dark:hover:bg-gray-700 duration-200 dark:text-gray-200">
                        {item.icon} {item.label}
                      </button>
                    ))}
                    <div className="border-t border-gray-100 dark:border-gray-700" />
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm
                        text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 duration-200">
                      <FaSignOutAlt /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login"
                  className="hidden sm:inline-flex items-center text-sm font-semibold px-4 py-1.5
                    rounded-full border-2 border-primary text-primary hover:bg-primary/5 duration-200">
                  Sign In
                </Link>
                <Link to="/register"
                  className="inline-flex items-center text-sm font-semibold px-4 py-1.5
                    rounded-full bg-gradient-to-r from-primary to-secondary text-white
                    hover:scale-105 duration-200 shadow-md">
                  Sign Up
                </Link>
              </div>
            )}

            <DarkMode />

            {/* Hamburger */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 duration-200"
              aria-label="Toggle menu">
              {mobileMenuOpen
                ? <IoMdClose className="text-xl text-gray-700 dark:text-white" />
                : <FaBars className="text-xl text-gray-700 dark:text-white" />}
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          MOBILE MENU
      ══════════════════════════════════════ */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-lg animate-slide-up">
          {/* Mobile search */}
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
            <div className="relative">
              <IoMdSearch className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400 text-lg" />
              <input type="text" value={searchQuery} onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-200
                  dark:border-gray-700 pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary
                  dark:text-white placeholder-gray-400" />
            </div>
            {searchOpen && searchResults.length > 0 && (
              <div className="mt-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                {searchResults.map((p) => (
                  <button key={p.id} onClick={() => { setMobileMenuOpen(false); handleSearchSelect(p); }}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-sm
                      hover:bg-gray-50 dark:hover:bg-gray-700 duration-200 text-left">
                    <span className="font-medium dark:text-white">{p.name}</span>
                    <span className="text-primary font-bold text-xs">{p.price}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Page links */}
          <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
            {[
              { label: "Home",    to: "/",        icon: <FaHome /> },
              { label: "Shop",    to: "/shop",    icon: <FaShoppingBag /> },
              { label: "About",   to: "/about",   icon: <FaInfoCircle /> },
              { label: "Contact", to: "/contact", icon: <FaEnvelope /> },
              { label: "Orders",  to: "/orders",  icon: <FaBoxOpen /> },
            ].map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 py-3 text-sm border-b border-gray-50 dark:border-gray-800 last:border-0 duration-200
                  ${isActive(l.to) ? "text-primary font-semibold" : "text-gray-700 dark:text-gray-300 hover:text-primary"}`}>
                <span className={isActive(l.to) ? "text-primary" : "text-primary/60"}>{l.icon}</span>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Shop sections */}
          <div className="px-4 py-2">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-1 mt-1">Shop Sections</p>
            {ShopSections.map((item) => (
              <button key={item.id}
                onClick={() => { setMobileMenuOpen(false); scrollToSection(item.section, navigate, location); }}
                className="w-full flex items-center gap-3 py-2.5 text-sm text-gray-700 dark:text-gray-300
                  hover:text-primary border-b border-gray-50 dark:border-gray-800 last:border-0 duration-200 text-left">
                <span className="text-primary/60">{item.icon}</span>
                {item.label}
              </button>
            ))}
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-1 mt-3">Trending</p>
            {TrendingLinks.map((item) => (
              <button key={item.id}
                onClick={() => { setMobileMenuOpen(false); scrollToSection(item.section, navigate, location); }}
                className="w-full flex items-center gap-3 py-2.5 text-sm text-gray-600
                  dark:text-gray-400 hover:text-primary duration-200 text-left">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 flex-shrink-0" />
                {item.label}
              </button>
            ))}
          </div>

          {/* Auth */}
          {!isLoggedIn ? (
            <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 flex gap-3">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2.5 rounded-xl border-2 border-primary
                  text-primary text-sm font-semibold hover:bg-primary/5 duration-200">
                Sign In
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2.5 rounded-xl bg-gradient-to-r
                  from-primary to-secondary text-white text-sm font-semibold hover:scale-[1.02] duration-200">
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 flex gap-3">
              <button onClick={() => { setMobileMenuOpen(false); navigate("/orders"); }}
                className="flex-1 text-center py-2.5 rounded-xl border border-gray-200 dark:border-gray-700
                  text-sm font-medium hover:border-primary hover:text-primary duration-200 dark:text-gray-300">
                My Orders
              </button>
              <button onClick={handleLogout}
                className="flex-1 text-center py-2.5 rounded-xl bg-red-50 dark:bg-red-900/20
                  border border-red-200 dark:border-red-800 text-red-500 text-sm font-medium duration-200">
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════
          LOWER NAVBAR — desktop only
      ══════════════════════════════════════ */}
      <div className="hidden md:flex justify-center bg-gray-900 text-white relative" style={{ overflow: "visible" }}>
        <ul className="flex items-center" style={{ overflow: "visible" }}>
          {ShopSections.map((data) => (
            <li key={data.id}>
              <button onClick={() => scrollToSection(data.section, navigate, location)}
                className="flex items-center gap-1.5 px-4 py-2.5 text-sm text-gray-300
                  hover:text-primary hover:bg-white/5 duration-200">
                <span className="text-primary/60 text-xs">{data.icon}</span>
                {data.label}
              </button>
            </li>
          ))}

          {/* Trending dropdown */}
          <li className="relative" ref={trendingRef} style={{ overflow: "visible" }}>
            <button onClick={() => setTrendingOpen(!trendingOpen)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm duration-200
                ${trendingOpen ? "text-primary bg-white/5" : "text-gray-300 hover:text-primary hover:bg-white/5"}`}>
              <FaTachometerAlt className="text-primary/60 text-xs" />
              Trending
              <FaCaretDown className={`text-xs transition-all duration-200 ${trendingOpen ? "rotate-180 text-primary" : ""}`} />
            </button>

            {trendingOpen && (
              <div className="absolute left-0 top-[calc(100%+2px)] w-64 rounded-2xl bg-gray-900
                border border-gray-700 shadow-2xl py-2 animate-fade-in" style={{ zIndex: 99999 }}>
                {TrendingLinks.map((data) => (
                  <button key={data.id}
                    onClick={() => { setTrendingOpen(false); scrollToSection(data.section, navigate, location); }}
                    className="w-full flex items-start gap-3 px-4 py-3 hover:bg-white/5 duration-200 group text-left">
                    <span className="w-2 h-2 rounded-full bg-primary/50 group-hover:bg-primary
                      flex-shrink-0 mt-1.5 transition-colors duration-200" />
                    <div>
                      <p className="text-sm text-gray-200 group-hover:text-primary duration-200 font-medium">{data.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{data.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
