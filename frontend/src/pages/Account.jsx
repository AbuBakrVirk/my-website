import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ordersAPI } from "../services/api";
import logo from "../assets/logo.png";
import DarkMode from "../components/Navbar/DarkMode";
import OrderReceipt from "../components/Checkout/OrderReceipt";
import {
  FaUserCircle, FaSignOutAlt, FaBoxOpen, FaShoppingBag,
  FaEnvelope, FaPhone, FaCalendarAlt, FaCheck,
} from "react-icons/fa";
import { MdDashboard, MdSecurity, MdReceipt } from "react-icons/md";

const Account = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [receipt, setReceipt] = useState(null);
  const [tab,     setTab]     = useState("dashboard");

  useEffect(() => {
    if (!isLoggedIn) { navigate("/login"); return; }
    ordersAPI.getMyOrders()
      .then((d) => setOrders(d.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isLoggedIn]);

  const totalSpent = orders.reduce((s, o) => s + o.total, 0);
  const recentOrders = orders.slice(0, 3);

  const tabs = [
    { id: "dashboard", label: "Dashboard",  icon: <MdDashboard /> },
    { id: "orders",    label: "My Orders",  icon: <FaBoxOpen /> },
    { id: "security",  label: "Security",   icon: <MdSecurity /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 dark:text-white duration-200">

      {/* Navbar */}
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <Link to="/shop" className="flex items-center gap-2 font-bold text-xl">
            <img src={logo} alt="Motorly" className="w-8 h-8" />
            <span className="hidden sm:block dark:text-white">Motorly</span>
          </Link>
          <div className="flex items-center gap-3">
            <DarkMode />
            <Link to="/shop" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary duration-200">← Shop</Link>
            <button onClick={() => { logout(); navigate("/"); }}
              className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 duration-200 font-medium">
              <FaSignOutAlt /> <span className="hidden sm:block">Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            {/* Profile card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm mb-4 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary
                flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <p className="font-bold dark:text-white">{user?.name}</p>
              <p className="text-xs text-gray-400 mt-0.5 truncate">{user?.email}</p>
              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 gap-2 text-center">
                <div>
                  <p className="text-lg font-extrabold text-primary">{orders.length}</p>
                  <p className="text-xs text-gray-400">Orders</p>
                </div>
                <div>
                  <p className="text-lg font-extrabold text-primary">${totalSpent.toFixed(0)}</p>
                  <p className="text-xs text-gray-400">Spent</p>
                </div>
              </div>
            </div>

            {/* Nav tabs */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
              {tabs.map((t) => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium duration-200 text-left
                    ${tab === t.id
                      ? "bg-primary/10 dark:bg-primary/20 text-primary border-l-4 border-primary"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 border-l-4 border-transparent"}`}>
                  <span className="text-base">{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">

            {/* ── Dashboard ── */}
            {tab === "dashboard" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-extrabold dark:text-white">Welcome back, {user?.name?.split(" ")[0]}! 👋</h1>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Here's your account overview.</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { icon: "📦", label: "Total Orders",  value: orders.length },
                    { icon: "💰", label: "Total Spent",   value: `$${totalSpent.toFixed(2)}` },
                    { icon: "✅", label: "Confirmed",     value: orders.filter(o => o.status === "confirmed").length },
                  ].map((s) => (
                    <div key={s.label} className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
                      <p className="text-2xl mb-1">{s.icon}</p>
                      <p className="text-xl font-extrabold text-primary">{s.value}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Profile info */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
                  <h2 className="font-bold text-base dark:text-white mb-4 flex items-center gap-2">
                    <FaUserCircle className="text-primary" /> Profile Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { icon: <FaUserCircle className="text-primary" />,  label: "Full Name",  value: user?.name },
                      { icon: <FaEnvelope className="text-primary" />,    label: "Email",      value: user?.email },
                      { icon: <FaPhone className="text-primary" />,       label: "Phone",      value: user?.phone || "Not provided" },
                      { icon: <FaCalendarAlt className="text-primary" />, label: "Member Since", value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long" }) : "—" },
                    ].map((f) => (
                      <div key={f.label} className="flex items-start gap-3 bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                        <span className="mt-0.5 flex-shrink-0">{f.icon}</span>
                        <div>
                          <p className="text-xs text-gray-400">{f.label}</p>
                          <p className="text-sm font-semibold dark:text-white mt-0.5">{f.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent orders */}
                {recentOrders.length > 0 && (
                  <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-bold text-base dark:text-white flex items-center gap-2">
                        <FaBoxOpen className="text-primary" /> Recent Orders
                      </h2>
                      <button onClick={() => setTab("orders")} className="text-xs text-primary hover:underline">View all</button>
                    </div>
                    <div className="flex flex-col gap-3">
                      {recentOrders.map((o) => (
                        <div key={o.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                          <div>
                            <p className="text-xs font-bold text-primary">#{o.id}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{new Date(o.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-primary">${o.total.toFixed(2)}</span>
                            <button onClick={() => setReceipt(o)}
                              className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-lg hover:bg-primary/20 duration-200 flex items-center gap-1">
                              <MdReceipt /> Receipt
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Orders ── */}
            {tab === "orders" && (
              <div>
                <h1 className="text-2xl font-extrabold dark:text-white mb-6">My Orders</h1>
                {loading ? (
                  <div className="flex justify-center py-16">
                    <svg className="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-16">
                    <FaShoppingBag className="text-5xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="font-semibold text-gray-500 dark:text-gray-400 mb-4">No orders yet</p>
                    <Link to="/shop" className="bg-gradient-to-r from-primary to-secondary text-white font-semibold px-6 py-2.5 rounded-full hover:scale-105 duration-200 text-sm">
                      Start Shopping →
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="font-bold text-sm text-primary">#{order.id}</span>
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold
                                ${order.status === "confirmed" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-blue-100 text-blue-700"}`}>
                                ✓ {order.status}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400">
                              {new Date(order.createdAt).toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" })}
                              {" · "}{order.items.length} item{order.items.length !== 1 ? "s" : ""}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <p className="text-lg font-extrabold text-primary">${order.total.toFixed(2)}</p>
                            <button onClick={() => setReceipt(order)}
                              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-gradient-to-r from-primary/80 to-secondary text-white hover:scale-105 duration-200">
                              <MdReceipt /> Receipt
                            </button>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex justify-between text-xs text-gray-500 dark:text-gray-400 py-0.5">
                              <span>{item.name} × {item.qty}</span>
                              <span>${item.lineTotal.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Security ── */}
            {tab === "security" && (
              <div>
                <h1 className="text-2xl font-extrabold dark:text-white mb-6">Security</h1>
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-5">
                  <div className="flex items-start justify-between gap-4 pb-5 border-b border-gray-100 dark:border-gray-800">
                    <div>
                      <p className="font-semibold dark:text-white text-sm">Password</p>
                      <p className="text-xs text-gray-400 mt-0.5">Last changed: unknown</p>
                    </div>
                    <Link to="/forgot-password"
                      className="text-xs font-semibold text-primary border border-primary/40 px-3 py-1.5 rounded-lg hover:bg-primary/5 duration-200 whitespace-nowrap">
                      Change Password
                    </Link>
                  </div>
                  <div className="flex items-start justify-between gap-4 pb-5 border-b border-gray-100 dark:border-gray-800">
                    <div>
                      <p className="font-semibold dark:text-white text-sm">Email Address</p>
                      <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 dark:bg-green-900/20 px-2.5 py-1 rounded-full font-semibold">
                      <FaCheck className="text-xs" /> Verified
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold dark:text-white text-sm">Sign Out Everywhere</p>
                      <p className="text-xs text-gray-400 mt-0.5">Sign out from all devices</p>
                    </div>
                    <button onClick={() => { logout(); navigate("/"); }}
                      className="text-xs font-semibold text-red-500 border border-red-200 dark:border-red-800 px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 duration-200 whitespace-nowrap">
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>

      {receipt && <OrderReceipt order={receipt} onClose={() => setReceipt(null)} />}
    </div>
  );
};

export default Account;
